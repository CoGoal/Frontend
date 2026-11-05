import type { ApiError, ServerProblem, Tokens } from './types'

interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  sessionId: number
  setTokens: (tokens: Tokens) => void
  clear: (notice?: string) => void
}

interface StoreLike {
  getState: () => SessionState
}

export interface ApiOptions {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

export function createApiClient(
  store: StoreLike,
  fetcher: typeof fetch = (input, init) => fetch(input, init),
) {
  let refreshTask: { sessionId: number; promise: Promise<void> } | null = null

  const sessionChanged = (): ApiError =>
    Object.assign(new Error('Сессия изменилась. Повторите запрос.'), { status: 401 })

  async function request(path: string, options: ApiOptions, sessionId: number): Promise<unknown> {
    const { method = 'GET', body, auth = true, signal } = options
    const state = store.getState()
    if (auth && state.sessionId !== sessionId) throw sessionChanged()

    const payload = typeof body === 'function' ? (body as () => unknown)() : body

    const headers: Record<string, string> = {}
    if (payload !== undefined) headers['Content-Type'] = 'application/json'
    if (auth && state.accessToken) headers.Authorization = 'Bearer ' + state.accessToken

    const response = await fetcher('/api/v1' + path, {
      method,
      signal,
      headers,
      body: payload === undefined ? undefined : JSON.stringify(payload),
    })
    if (auth && store.getState().sessionId !== sessionId) throw sessionChanged()

    const text = await response.text()
    let data: unknown = null
    try { data = text ? JSON.parse(text) : null } catch { /* Прокси может вернуть HTML. */ }

    if (!response.ok) {
      const problem = data as ServerProblem | null
      const error: ApiError = Object.assign(
        new Error(problem?.message || problem?.detail || 'Не удалось выполнить запрос'),
        { status: response.status, problem, accessToken: state.accessToken },
      )
      throw error
    }
    if (text && data === null) throw new Error('Сервер вернул неожиданный ответ')
    return data
  }

  function refresh(sessionId: number): Promise<void> {
    if (refreshTask?.sessionId === sessionId) return refreshTask.promise
    const refreshToken = store.getState().refreshToken

    const promise: Promise<void> = request('/auth/refresh', {
      method: 'POST', body: { refreshToken }, auth: false,
    }, sessionId).then((data) => {
      if (store.getState().sessionId !== sessionId) throw sessionChanged()
      store.getState().setTokens(data as Tokens)
    }).catch((error: ApiError) => {
      if (error.status === 401 && store.getState().sessionId === sessionId) {
        store.getState().clear('Сессия завершена. Войдите снова.')
      }
      throw error
    }).finally(() => {
      if (refreshTask?.promise === promise) refreshTask = null
    })

    refreshTask = { sessionId, promise }
    return promise
  }

  return async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
    const sessionId = store.getState().sessionId
    try {
      return (await request(path, options, sessionId)) as T
    } catch (e) {
      const error = e as ApiError
      const current = store.getState()
      if (options.auth === false || error.status !== 401 || current.sessionId !== sessionId) throw error
      if (!current.refreshToken) {
        current.clear('Сессия завершена. Войдите снова.')
        throw error
      }
      if (error.accessToken === current.accessToken) await refresh(sessionId)
      return (await request(path, options, sessionId)) as T
    }
  }
}