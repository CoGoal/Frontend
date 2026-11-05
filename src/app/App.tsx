import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../entities/session/model/authStore'
import { useSessionCleanup } from '../features/auth/model/useSessionCleanup'
import { ROUTES } from '../shared/config/routes'
import AppRoutes from './AppRoutes'
import ProfileScreen from '../pages/profile/ui/ProfileScreen'

export default function App() {
  const { pathname } = useLocation()
  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
  const actionPage = pathname === ROUTES.reset || pathname === ROUTES.confirmEmail

  useSessionCleanup(actionPage)

  if (hasSession && !actionPage) return <ProfileScreen />
  return <AppRoutes />
}