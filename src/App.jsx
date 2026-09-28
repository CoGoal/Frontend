import { useEffect, useState } from 'react'

export default function App() {
  const [backend, setBackend] = useState('проверяю…')

  useEffect(() => {
    fetch('/v3/api-docs')
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`)
        return res.json()
      })
      .then((spec) => setBackend(`✅ доступен (${spec.info?.title ?? 'OpenAPI'})`))
      .catch((e) => setBackend(`❌ недоступен: ${e.message}`))
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>CoGoal</h1>
      <p>Бэкенд: {backend}</p>
    </main>
  )
}
