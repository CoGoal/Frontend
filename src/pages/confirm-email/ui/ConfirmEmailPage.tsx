import { useConfirmEmail } from '../../../features/auth/api'
import { parseServerError } from '../../../shared/api/errors'
import { CONFIRM_EMAIL_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'

interface ConfirmEmailPageProps {
  token: string | null
  onGoToLogin: () => void
}

export default function ConfirmEmailPage({ token, onGoToLogin }: ConfirmEmailPageProps) {
  const confirm = useConfirmEmail()

  // Какое пояснение показать под заголовком
  let description = T.noToken
  if (confirm.isSuccess) description = T.success
  else if (token) description = T.ready

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>{T.title}</h2>

        <p className={styles.description} role="status">{description}</p>

        {confirm.isError && (
          <p className={styles.formError} role="alert">
            {parseServerError(confirm.error).form}
          </p>
        )}

        {token && !confirm.isSuccess && (
          <button
            className={styles.submitButton}
            disabled={confirm.isPending}
            onClick={() => confirm.mutate(token)}
          >
            {confirm.isPending ? T.submitting : T.submit}
          </button>
        )}

        <button className={styles.resendLink} onClick={onGoToLogin}>
          {T.backToLogin}
        </button>
      </div>
    </main>
  )
}