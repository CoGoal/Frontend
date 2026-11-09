import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../entities/session/model/authStore'
import { useSessionCleanup } from '../features/auth/model/useSessionCleanup'
import { ROUTES } from '../shared/config/routes'
import AppRoutes from './AppRoutes'
import AuthorizedRoutes from './AuthorizedRoutes'

export default function App() {
  const { pathname } = useLocation()
  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))

  // Страницы по ссылкам из писем открываются и у вошедших, и у невошедших
  const actionPage = pathname === ROUTES.reset || pathname === ROUTES.confirmEmail

  useSessionCleanup(actionPage)

  if (hasSession && !actionPage) return <AuthorizedRoutes />
  return <AppRoutes />
}