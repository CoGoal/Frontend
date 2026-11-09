import { Bell, CircleDollarSign, CircleUser } from 'lucide-react'
import { APP_NAME, HEADER_TEXTS as T } from '../../../shared/config/texts'
import styles from './Header.module.css'

interface HeaderProps {
    coins?: number
}

export default function Header({ coins }: HeaderProps) {
    return (
        <header className={styles.header}>
        <span className={styles.brand}>{APP_NAME}</span>

        <div className={styles.actions}>
            <button type="button" className={styles.iconButton} aria-label={T.profile} title={T.profile}>
            <CircleUser size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button type="button" className={styles.iconButton} aria-label={T.notifications} title={T.notifications}>
            <Bell size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {/* Баланс показываем, только если он известен */}
            {coins !== undefined && (
            <div className={styles.coins} title={T.coins}>
                <CircleDollarSign size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{coins}</span>
            </div>
            )}
        </div>
        </header>
    )
}