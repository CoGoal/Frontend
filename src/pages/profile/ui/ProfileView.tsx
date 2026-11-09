import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { MainLayout } from '../../../widgets/main-layout'
import type { Profile } from '../../../features/profile/model/types'
import { ROUTES } from '../../../shared/config/routes'
import { PROFILE_VIEW_TEXTS as T } from '../../../shared/config/texts'
import GoalsSection from './GoalsSection'
import SideCards from './SideCards'
import styles from './ProfileView.module.css'

interface ProfileViewProps {
    profile: Profile
}

// Аватар показываем, только если это настоящая ссылка
const isHttpUrl = (url: string | null) => /^https?:\/\//i.test(url ?? '')

export default function ProfileView({ profile }: ProfileViewProps) {
    const stats = [
        { label: T.completedGoals, value: profile.stats?.completedGoals ?? 0 },
        { label: T.activeGoals, value: profile.stats?.activePacts ?? 0 },
        { label: T.completedPacts, value: 0 }, // этого поля в описании сервера пока нет
        { label: T.coins, value: profile.coins },
    ]

    return (
        <MainLayout coins={profile.coins} activeItem="profile">
        <h1 className={styles.title}>{T.pageTitle}</h1>

        <section className={styles.user}>
            <div className={styles.userInfo}>
            {isHttpUrl(profile.avatarUrl) ? (
                <img
                className={styles.avatar}
                src={profile.avatarUrl ?? undefined}
                alt={T.avatarAlt}
                referrerPolicy="no-referrer"
                />
            ) : (
                <div className={`${styles.avatar} ${styles.avatarEmpty}`} aria-label={T.avatarAlt}>
                <User size={32} strokeWidth={1.5} aria-hidden="true" />
                </div>
            )}

            <div>
                <h2 className={styles.name}>{profile.name || profile.username}</h2>
                <p className={styles.username}>@{profile.username}</p>
            </div>
            </div>

            <Link to={ROUTES.profileEdit} className={styles.editButton}>
            {T.edit}
            </Link>
        </section>

        <section className={styles.stats} aria-label={T.statsLabel}>
            {stats.map(({ label, value }) => (
            <div key={label} className={styles.card}>
                <span className={styles.value}>{value}</span>
                <span className={styles.label}>{label}</span>
            </div>
            ))}
        </section>

        <div className={styles.columns}>
            <GoalsSection />
            <SideCards achievements={profile.achievements ?? []} />
        </div>
        </MainLayout>
    )
}