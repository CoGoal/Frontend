import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../../features/auth/api'
import { useProfile, profilePending } from '../../../features/profile/api'
import { parseServerError } from '../../../shared/api/errors'
import { ROUTES } from '../../../shared/config/routes'
import { PROFILE_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'
import ProfilePage from './ProfilePage'

export default function ProfileScreen() {
    const navigate = useNavigate()
    const profile = useProfile()
    const logout = useLogout()

    function goToLogin() {
        navigate(ROUTES.login, { replace: true })
    }

    if (profile.data) return <ProfilePage profile={profile.data} onLoggedOut={goToLogin} />

    const waiting = profile.isPending || profilePending(profile.error)

    return (
        <main className={styles.page}>
        <div className={styles.card}>
            <h2 className={styles.title}>{waiting ? T.pendingTitle : T.errorTitle}</h2>

            <p className={styles.description} role="status">
            {waiting ? T.pendingDescription : parseServerError(profile.error).form}
            </p>

            {!waiting && (
            <button className={styles.submitButton} onClick={() => profile.refetch()}>
                {T.retry}
            </button>
            )}

            {logout.isError && <p role="alert">{parseServerError(logout.error).form}</p>}

            <button
            className={styles.resendLink}
            disabled={logout.isPending}
            onClick={() => logout.mutate(false, { onSuccess: goToLogin })}
            >
            {T.logout}
            </button>
        </div>
        </main>
    )
}