import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../shared/config/routes'
import EditProfilePage from './EditProfilePage'
import ProfileGate from './ProfileGate'

export default function EditProfileScreen() {
    const navigate = useNavigate()

    return (
        <ProfileGate>
        {(profile) => (
            <EditProfilePage
            profile={profile}
            onLoggedOut={() => navigate(ROUTES.login, { replace: true })}
            />
        )}
        </ProfileGate>
    )
}