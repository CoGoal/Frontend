import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, History, Medal, Palette, Trophy } from 'lucide-react'
import type { Achievement } from '../../../features/profile/model/types'
import { SIDE_CARDS_TEXTS as T } from '../../../shared/config/texts'
import styles from './SideCards.module.css'

interface SideCardProps {
    icon: LucideIcon
    title: string
    linkText: string
    children: ReactNode
}

// Одна карточка: значок, заголовок, содержимое и ссылка внизу.
// Ссылка пока ни к чему не ведёт, поэтому это кнопка
function SideCard({ icon: Icon, title, linkText, children }: SideCardProps) {
    return (
        <section className={styles.card}>
        <Icon className={styles.icon} size={20} strokeWidth={1.75} aria-hidden="true" />
        <h2 className={styles.title}>{title}</h2>
        {children}
        <button type="button" className={styles.link}>
            {linkText}
            <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>
        </section>
    )
}

interface SideCardsProps {
    achievements: Achievement[]
}

export default function SideCards({ achievements }: SideCardsProps) {
    return (
        <aside className={styles.column}>
        <SideCard icon={History} title={T.historyTitle} linkText={T.historyLink}>
            <p className={styles.text}>{T.historyDescription}</p>
        </SideCard>

        <SideCard icon={Trophy} title={T.achievementsTitle} linkText={T.achievementsLink}>
            {achievements.length > 0 ? (
            <ul className={styles.list}>
                {achievements.slice(0, 2).map((item) => (
                <li key={item.code} className={styles.listItem}>
                    <Medal className={styles.listIcon} size={16} strokeWidth={1.75} aria-hidden="true" />
                    {item.title}
                </li>
                ))}
            </ul>
            ) : (
            <p className={styles.text}>{T.achievementsEmpty}</p>
            )}
        </SideCard>

        <SideCard icon={Palette} title={T.lookTitle} linkText={T.lookLink}>
            <p className={styles.text}>{T.lookDescription}</p>
        </SideCard>
        </aside>
    )
}