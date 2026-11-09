import type { LucideIcon } from 'lucide-react'
import { Bell, CircleUser, Handshake, House, Settings, Target } from 'lucide-react'
import logoIcon from '../../../shared/ui/logo.svg'
import { APP_NAME, SIDEBAR_TEXTS as T } from '../../../shared/config/texts'
import styles from './Sidebar.module.css'

// Названия пунктов меню. Страница по ним говорит, какой пункт подсветить
export type NavKey = 'home' | 'goals' | 'pacts' | 'notifications' | 'profile' | 'settings'

interface NavItem {
    id: NavKey
    label: string
    icon: LucideIcon
}

// Пункты вверху меню
const TOP_ITEMS: NavItem[] = [
    { id: 'home', label: T.home, icon: House },
    { id: 'goals', label: T.goals, icon: Target },
    { id: 'pacts', label: T.pacts, icon: Handshake },
    { id: 'notifications', label: T.notifications, icon: Bell },
]

// Пункты внизу меню
const BOTTOM_ITEMS: NavItem[] = [
    { id: 'profile', label: T.profile, icon: CircleUser },
    { id: 'settings', label: T.settings, icon: Settings },
]

interface NavButtonProps extends NavItem {
    active: boolean
}

// Пока пункты ни к чему не ведут, поэтому это просто кнопки
function NavButton({ label, icon: Icon, active }: NavButtonProps) {
    return (
        <button
        type="button"
        className={`${styles.item} ${active ? styles.itemActive : ''}`}
        aria-label={label}
        title={label}
        aria-current={active ? 'page' : undefined}
        >
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
    )
}

interface SidebarProps {
    activeItem?: NavKey
}

export default function Sidebar({ activeItem }: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
        <img className={styles.logo} src={logoIcon} alt={APP_NAME} />

        <nav className={styles.nav} aria-label={T.navLabel}>
            <div className={styles.group}>
            {TOP_ITEMS.map((item) => (
                <NavButton key={item.id} {...item} active={item.id === activeItem} />
            ))}
            </div>
            <div className={styles.group}>
            {BOTTOM_ITEMS.map((item) => (
                <NavButton key={item.id} {...item} active={item.id === activeItem} />
            ))}
            </div>
        </nav>
        </aside>
    )
}