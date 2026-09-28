const TOKEN_KEY = 'cogoal_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)

export async function pingBackend() {
  const res = await fetch('/v3/api-docs')
  if (!res.ok) throw new Error(`Backend answered ${res.status}`)
  const spec = await res.json()
  return spec.info?.title ?? 'OpenAPI'
}

export async function api(path, options = {}) {
  const token = getToken()
  const res = await fetch(`/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const problem = await res.json().catch(() => null)
    const err = new Error(problem?.detail ?? res.statusText)
    err.status = res.status
    err.problem = problem
    throw err
  }
  return res.status === 204 ? null : res.json()
}