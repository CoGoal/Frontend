// Проверяем ротацию токенов отдельно от React и браузера.
export function createApiClient(store, fetcher = (...args) => fetch(...args)) {
  let refreshTask = null
  const sessionChanged = () => Object.assign(new Error('Сессия изменилась. Повторите запрос.'), { status: 401 })

  async function request(path, options, sessionId) {
    const { method = 'GET', body, auth = true, signal } = options
    const state = store.getState()
    if (auth && state.sessionId !== sessionId) throw sessionChanged()
    const payload = typeof body === 'function' ? body() : body
    const response = await fetcher('/api/v1' + path, {
      method, signal,
      headers: {
        ...(payload !== undefined && { 'Content-Type': 'application/json' }),
        ...(auth && state.accessToken && { Authorization: 'Bearer ' + state.accessToken }),
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    })
    if (auth && store.getState().sessionId !== sessionId) throw sessionChanged()
    const text = await response.text()
    let data = null
    try { data = text ? JSON.parse(text) : null } catch { /* Прокси может вернуть HTML. */ }
    if (!response.ok) {
      const error = new Error(data?.message || data?.detail || 'Не удалось выполнить запрос')
      error.status = response.status
      error.problem = data
      error.accessToken = state.accessToken
      throw error
    }
    if (text && data === null) throw new Error('Сервер вернул неожиданный ответ')
    return data
  }

  function refresh(sessionId) {
    if (refreshTask?.sessionId === sessionId) return refreshTask.promise
    const refreshToken = store.getState().refreshToken
    const task = { sessionId }
    task.promise = request('/auth/refresh', {
      method: 'POST', body: { refreshToken }, auth: false,
    }, sessionId).then((data) => {
      if (store.getState().sessionId !== sessionId) throw sessionChanged()
      store.getState().setTokens(data)
    }).catch((error) => {
      if (error.status === 401 && store.getState().sessionId === sessionId) {
        store.getState().clear('Сессия завершена. Войдите снова.')
      }
      throw error
    }).finally(() => {
      if (refreshTask === task) refreshTask = null
    })
    refreshTask = task
    return task.promise
  }

  return async function api(path, options = {}) {
    const sessionId = store.getState().sessionId
    try {
      return await request(path, options, sessionId)
    } catch (error) {
      const current = store.getState()
      if (options.auth === false || error.status !== 401 || current.sessionId !== sessionId) throw error
      if (!current.refreshToken) {
        current.clear('Сессия завершена. Войдите снова.')
        throw error
      }
      // Поздний 401 от старого access не должен повторно вращать новый refresh.
      if (error.accessToken === current.accessToken) await refresh(sessionId)
      return request(path, options, sessionId)
    }
  }
}
