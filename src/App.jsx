import { useState } from 'react'
import { useAuthStore } from './store/authStore'
import { useLogout, useProfile } from './api/hooks'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

//токен сброса пароля из ссылки в письме
const resetToken = new URLSearchParams(window.location.search).get('token')

export default function App() {
  // 'login' | 'register' | 'forgot' | 'reset'
  const [page, setPage] = useState(resetToken ? 'reset' : 'login')

  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
  const profile = useProfile()
  const logout = useLogout()

  // переход ко входу; убираем токен из адресной строки
  function goToLogin() {
    window.history.replaceState({}, '', window.location.pathname)
    setPage('login')
  }

  if (page === 'reset') {
    return (
      <ResetPasswordPage
        token={resetToken}
        onGoToLogin={goToLogin}
        onGoToForgot={() => setPage('forgot')}
      />
    )
  }

  // Идёт проверка сохранённой сессии
  if (hasSession && profile.isPending) return null

  if (hasSession && profile.data) {
    // Заглушка до появления страницы профиля
    return (
      <div style={{ padding: 24 }}>
        <p>Вы вошли как {profile.data.username}</p>
        <button
          onClick={() => {
            logout()
            setPage('login')
          }}
        >
          Выйти
        </button>
      </div>
    )
  }

  if (page === 'register') {
    return <RegisterPage onGoToLogin={() => setPage('login')} />
  }

  if (page === 'forgot') {
    return <ForgotPasswordPage onGoToLogin={() => setPage('login')} />
  }

  return (
    <LoginPage
      onGoToRegister={() => setPage('register')}
      onGoToForgot={() => setPage('forgot')}
    />
  )
}