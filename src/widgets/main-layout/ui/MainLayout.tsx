import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar, { type NavKey } from './Sidebar'
import styles from './MainLayout.module.css'

interface MainLayoutProps {
    coins?: number
    activeItem?: NavKey
    children: ReactNode
}

// Общая рамка: меню слева, шапка сверху, а внутри то, что передаст страница
export default function MainLayout({ coins, activeItem, children }: MainLayoutProps) {
    return (
        <div className={styles.layout}>
        <Sidebar activeItem={activeItem} />
        <div className={styles.column}>
            <Header coins={coins} />
            <main className={styles.content}>{children}</main>
        </div>
        </div>
    )
}