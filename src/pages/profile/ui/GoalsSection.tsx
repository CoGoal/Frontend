import { useState } from 'react'
import { GOALS_TEXTS as T } from '../../../shared/config/texts'
import styles from './GoalsSection.module.css'

type TabKey = 'all' | 'inPact' | 'completed'

// Для каждой вкладки: название и что писать, пока целей нет
const TABS: { key: TabKey; label: string; empty: string }[] = [
    { key: 'all', label: T.tabAll, empty: T.emptyAll },
    { key: 'inPact', label: T.tabInPact, empty: T.emptyInPact },
    { key: 'completed', label: T.tabCompleted, empty: T.emptyCompleted },
]

export default function GoalsSection() {
    const [tab, setTab] = useState<TabKey>('all')
    const current = TABS.find((t) => t.key === tab) ?? TABS[0]

    return (
        <section className={styles.section}>
        <h2 className={styles.title}>{T.title}</h2>

        <div className={styles.tabs} role="tablist" aria-label={T.tabsLabel}>
            {TABS.map(({ key, label }) => (
            <button
                key={key}
                type="button"
                role="tab"
                id={`goals-tab-${key}`}
                aria-selected={tab === key}
                aria-controls="goals-panel"
                className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
                onClick={() => setTab(key)}
            >
                {label}
            </button>
            ))}
        </div>

        {/* Когда появятся цели, здесь будут их карточки */}
        <div id="goals-panel" role="tabpanel" aria-labelledby={`goals-tab-${tab}`} className={styles.empty}>
            <p>{current.empty}</p>
        </div>
        </section>
    )
}