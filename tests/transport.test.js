import test from 'node:test'
import assert from 'node:assert/strict'
import { createApiClient } from '../src/api/transport.js'
import { parseServerError } from '../src/api/errors.js'
import { passwordError } from '../src/utils/validators.js'

function session() {
  let state = { accessToken: 'old-access', refreshToken: 'old-refresh', sessionId: 1 }
  const store = { getState: () => state }
  const actions = {
    setTokens: (tokens) => { state = { ...state, ...tokens } },
    clear: () => { state = { ...state, accessToken: null, refreshToken: null, sessionId: state.sessionId + 1 } },
    startSession: (tokens) => { state = { ...state, ...tokens, sessionId: state.sessionId + 1 } },
  }
  state = { ...state, ...actions }
  return store
}
const json = (body, status = 200) => new Response(JSON.stringify(body), { status })
const denied = () => json({ code: 'UNAUTHORIZED' }, 401)
const tick = () => new Promise((resolve) => setImmediate(resolve))

test('successful empty 202 and 204 responses are accepted', async () => {
  for (const status of [202, 204]) {
    const api = createApiClient(session(), async () => new Response(null, { status }))
    assert.equal(await api('/auth/password/forgot', { auth: false }), null)
  }
})
test('parallel expired requests share one refresh and late 401 reuses its access token', async () => {
  const store = session()
  let refreshes = 0
  let lateReply
  const api = createApiClient(store, async (url, options) => {
    if (url.endsWith('/auth/refresh')) {
      refreshes++
      assert.deepEqual(JSON.parse(options.body), { refreshToken: 'old-refresh' })
      await tick()
      return json({ accessToken: 'new-access', refreshToken: 'new-refresh' })
    }
    if (options.headers.Authorization === 'Bearer old-access') {
      if (url.endsWith('/late')) return new Promise((resolve) => { lateReply = resolve })
      return denied()
    }
    assert.equal(options.headers.Authorization, 'Bearer new-access')
    return json({ ok: true })
  })
  const late = api('/late')
  await Promise.all([api('/users/me'), api('/auth/me')])
  lateReply(denied())
  await late
  assert.equal(refreshes, 1)
  assert.equal(store.getState().refreshToken, 'new-refresh')
})
test('logout revokes the rotated refresh when its initial access token expired', async () => {
  const store = session()
  let revoked
  const api = createApiClient(store, async (url, options) => {
    if (url.endsWith('/refresh')) return json({ accessToken: 'new-access', refreshToken: 'new-refresh' })
    if (options.headers.Authorization === 'Bearer old-access') return denied()
    revoked = JSON.parse(options.body).refreshToken
    return new Response(null, { status: 204 })
  })
  await api('/auth/logout', { method: 'POST', body: () => ({ refreshToken: store.getState().refreshToken }) })
  assert.equal(revoked, 'new-refresh')
})
test('invalid refresh clears the session, while a temporary service error preserves it', async () => {
  for (const status of [401, 503]) {
    const store = session()
    const api = createApiClient(store, async (url) => url.endsWith('/refresh') ? json({}, status) : denied())
    await assert.rejects(api('/users/me'))
    assert.equal(store.getState().refreshToken, status === 401 ? null : 'old-refresh')
  }
})
test('late refresh cannot restore a logged-out session or overwrite another login', async () => {
  for (const loginAgain of [false, true]) {
    const store = session()
    let resolveRefresh
    const api = createApiClient(store, async (url) => url.endsWith('/refresh')
      ? new Promise((resolve) => { resolveRefresh = resolve }) : denied())
    const pending = api('/users/me')
    await tick()
    store.getState().clear()
    if (loginAgain) store.getState().startSession({ accessToken: 'other-access', refreshToken: 'other-refresh' })
    resolveRefresh(json({ accessToken: 'new-access', refreshToken: 'new-refresh' }))
    await assert.rejects(pending)
    assert.equal(store.getState().accessToken, loginAgain ? 'other-access' : null)
  }
})
test('bad login does not attempt token refresh', async () => {
  let calls = 0
  const api = createApiClient(session(), async () => { calls++; return denied() })
  await assert.rejects(api('/auth/login', { method: 'POST', body: { login: 'person', password: 'wrong' }, auth: false }))
  assert.equal(calls, 1)
})
test('proxy HTML errors remain readable without exposing HTML in the form', async () => {
  const api = createApiClient(session(), async () => new Response('<html>Bad Gateway</html>', { status: 502 }))
  try { await api('/users/me') } catch (error) {
    assert.equal(error.status, 502)
    assert.match(parseServerError(error).form, /временно недоступен/)
  }
})
test('password validation enforces BCrypt byte limit for Cyrillic too', () => {
  assert.equal(passwordError('a'.repeat(72)), undefined)
  assert.ok(passwordError('a'.repeat(73)))
  assert.equal(passwordError('я'.repeat(36)), undefined)
  assert.ok(passwordError('я'.repeat(37)))
})
