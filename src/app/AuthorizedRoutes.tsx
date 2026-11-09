import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../shared/config/routes'
import EditProfileScreen from '../pages/profile/ui/EditProfileScreen'
import ProfileScreen from '../pages/profile/ui/ProfileScreen'

export default function AuthorizedRoutes() {
    return (
        <Routes>
        <Route path={ROUTES.profile} element={<ProfileScreen />} />
        <Route path={ROUTES.profileEdit} element={<EditProfileScreen />} />
        {/* Любой другой адрес ведёт в профиль */}
        <Route path="*" element={<Navigate to={ROUTES.profile} replace />} />
        </Routes>
    )
}