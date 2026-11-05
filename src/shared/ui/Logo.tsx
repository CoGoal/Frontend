import logoUrl from './logo.svg'
import { APP_NAME } from '../config/texts'
import styles from './Logo.module.css'

export default function Logo() {
    return (
        <div className={styles.wrapper}>
        <img className={styles.image} src={logoUrl} alt="" />
        <span className={styles.text}>{APP_NAME}</span>
        </div>
    )
}