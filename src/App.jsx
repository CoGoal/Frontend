import { useEffect, useState } from 'react'
import { api, getToken, pingBackend, setToken } from './api/client'

export default function App() {
  const [backend, setBackend] = useState('проверяю…')
  const [token, setTokenInput] = useState(getToken() ?? '')
  const [categories, setCategories] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    pingBackend()
      .then((title) => setBackend(`✅ доступен (${title})`))
      .catch((e) => setBackend(`❌ недоступен: ${e.message}`))
  }, [])

  async function loadCategories() {
    setError(null)
    setToken(token.trim())
    try {
      const page = await api('/categories')
      setCategories(page.content)
    } catch (e) {
      setCategories(null)
      setError(`${e.status ?? ''} ${e.message}`)
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>CoGoal</h1>
      <p>Бэкенд: {backend}</p>

      <h2>Проверка защищённого эндпоинта</h2>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        placeholder="Вставьте JWT (HS256)"
        value={token}
        onChange={(e) => setTokenInput(e.target.value)}
      />
      <button onClick={loadCategories}>GET /api/v1/categories</button>

      {error && <p style={{ color: 'crimson' }}>Ошибка: {error}</p>}
      {categories && (
        <ul>
          {categories.length === 0 && <li>Категорий пока нет (это нормально)</li>}
          {categories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
    </main>
  )
}