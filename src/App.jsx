import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import { profilePending, useLogout, useProfile } from './api/hooks'
import { parseServerError } from './api/errors'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import ProfilePage from './pages/ProfilePage'

const routes = { '/register': 'register', '/forgot-password': 'forgot', '/reset-password': 'reset', '/email-confirm': 'confirm' }
const paths = { login: '/', register: '/register', forgot: '/forgot-password' }
const actionToken = new URLSearchParams(window.location.search).get('token')

export default function App() {
  const [page, setPage] = useState(() => routes[window.location.pathname] || 'login')
  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
  const notice = useAuthStore((s) => s.notice)
  const actionPage = page === 'reset' || page === 'confirm'
  const profile = useProfile(!actionPage)
  const logout = useLogout()
  const client = useQueryClient()
  const previousSession = useRef(hasSession)
  useEffect(() => {
    const listener = () => setPage(routes[window.location.pathname] || 'login')
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])
  useEffect(() => {
    if (!hasSession) {
      client.cancelQueries()
      client.removeQueries()
      if (previousSession.current && !actionPage) {
        window.history.replaceState({}, '', '/')
        setPage('login')
      }
    }
    previousSession.current = hasSession
  }, [hasSession, client, actionPage])
  function navigate(next) {
    window.history.pushState({}, '', paths[next] || '/')
    setPage(next)
  }
  function goToLogin() {
    window.history.replaceState({}, '', '/')
    setPage('login')
  }
  if (page === 'reset') return <ResetPasswordPage token={actionToken} onGoToLogin={goToLogin} onGoToForgot={() => navigate('forgot')} />
  if (page === 'confirm') return <ConfirmEmailPage token={actionToken} onGoToLogin={goToLogin} />
  if (hasSession) {
    if (profile.data) return <ProfilePage profile={profile.data} onLoggedOut={goToLogin} />
    const waiting = profile.isPending || profilePending(profile.error)
    return <main className="login-page"><div className="login-card">
      <h2 className="login-title">{waiting ? 'Готовим ваш профиль…' : 'Не удалось загрузить профиль'}</h2>
      <p className="login-description" role="status">{waiting
        ? 'Это может занять несколько секунд. Страница обновится автоматически.'
        : parseServerError(profile.error).form}</p>
      {!waiting && <button className="login-submit-button" onClick={() => profile.refetch()}>Повторить</button>}
      {logout.isError && <p role="alert">{parseServerError(logout.error).form}</p>}
      <button className="resend-link" disabled={logout.isPending} onClick={() => logout.mutate(false, { onSuccess: goToLogin })}>Выйти</button>
    </div></main>
  }
  if (page === 'register') return <RegisterPage onGoToLogin={goToLogin} />
  if (page === 'forgot') return <ForgotPasswordPage onGoToLogin={goToLogin} />
  return <LoginPage notice={notice} onGoToRegister={() => navigate('register')} onGoToForgot={() => navigate('forgot')} />
}
