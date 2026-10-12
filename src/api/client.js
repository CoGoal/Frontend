import { useAuthStore } from '../store/authStore'

// auth: false — не отправлять токен (вход, регистрация, восстановление пароля).
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const { accessToken } = useAuthStore.getState()

  const res = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!res.ok) {
    const problem = await res.json().catch(() => null)
    const err = new Error(problem?.message ?? problem?.detail ?? res.statusText)
    err.status = res.status
    err.problem = problem
    throw err
  }
  return res.status === 204 ? null : res.json()
}

// Обновление токенов по refresh-токену. Если одновременно упало несколько
// запросов, обновление выполняется один раз.
let refreshPromise = null

function refreshTokens() {
  const { refreshToken, setTokens, clear } = useAuthStore.getState()

  refreshPromise ??= request('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  })
    .then((data) => setTokens(data))
    .catch((err) => {
      clear() // refresh-токен тоже не подошёл — сессия закончена
      throw err
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

// Запрос с автоматическим обновлением токена: если сервер ответил 401,
// получаем новый токен и повторяем запрос один раз.
export async function api(path, options = {}) {
  try {
    return await request(path, options)
  } catch (err) {
    const canRefresh =
      err.status === 401 && options.auth !== false && useAuthStore.getState().refreshToken

    if (!canRefresh) throw err
    await refreshTokens()
    return request(path, options)
  }
}