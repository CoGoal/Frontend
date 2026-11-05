import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../entities/session/model/authStore'
import { ROUTES } from '../shared/config/routes'
import ForgotPasswordPage from '../pages/forgot-password/ui/ForgotPasswordPage'
import LoginPage from '../pages/login/ui/LoginPage'
import RegisterPage from '../pages/register/ui/RegisterPage'
import ResetPasswordPage from '../pages/reset-password/ui/ResetPasswordPage'
import ConfirmEmailPage from '../pages/confirm-email/ui/ConfirmEmailPage'

export default function AppRoutes() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const notice = useAuthStore((s) => s.notice)

    function goToLogin() {
        navigate(ROUTES.login, { replace: true })
    }

    return (
        <Routes>
        <Route
            path={ROUTES.reset}
            element={<ResetPasswordPage token={token} onGoToLogin={goToLogin} onGoToForgot={() => navigate(ROUTES.forgot)} />}
        />
        <Route
            path={ROUTES.confirmEmail}
            element={<ConfirmEmailPage token={token} onGoToLogin={goToLogin} />}
        />
        <Route path={ROUTES.register} element={<RegisterPage onGoToLogin={goToLogin} />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage onGoToLogin={goToLogin} />} />
        <Route
            path="*"
            element={
            <LoginPage
                notice={notice}
                onGoToRegister={() => navigate(ROUTES.register)}
                onGoToForgot={() => navigate(ROUTES.forgot)}
            />
            }
        />
        </Routes>
    )
}