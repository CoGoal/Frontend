import { useState, type SubmitEvent } from 'react'
import { useForgotPassword } from '../../../features/auth/api'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import Logo from '../../../shared/ui/Logo'
import { EMAIL_RE } from '../../../shared/lib/validators'
import { FORGOT_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'

const ERROR_OPTIONS = {
  fieldMap: { email: 'email' },
  fallback: T.failed,
}

interface ForgotPasswordPageProps {
  onGoToLogin: () => void
}

export default function ForgotPasswordPage({ onGoToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)
  const forgot = useForgotPassword()

  function change(value: string) {
    setEmail(value)
    setErrors({})
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!EMAIL_RE.test(email.trim())) {
      setErrors({ email: T.emailInvalid })
      return
    }

    forgot.mutate(email.trim(), {
      onSuccess: () => setSent(true),
      onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)),
    })
  }

  function handleResend() {
    // Сбрасываем sent и отправляем снова
    setSent(false)
    forgot.mutate(email.trim(), {
      onSuccess: () => setSent(true),
      onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)),
    })
  }

  return (
    <main className={styles.page}>
      <Logo />

      <div className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          {sent ? (
            // Страница успеха
            <>
              <div className={styles.successIconWrapper}>
                <img src="/check-icon.svg" alt={T.sentAlt} />
              </div>

              <h2 className={styles.successTitle}>{T.sentTitle}</h2>

              <div className={styles.successDescription}>
                <p>{T.sentDescription(email.trim())}</p>
              </div>

              <button
                type="button"
                className={styles.successButton}
                onClick={onGoToLogin}
              >
                {T.backToLogin}
              </button>

              <p className={styles.resendText}>
                {T.notReceived}{' '}
                <button
                  type="button"
                  className={styles.resendLink}
                  onClick={handleResend}
                  disabled={forgot.isPending}
                >
                  {forgot.isPending ? T.sending : T.resend}
                </button>
              </p>
            </>
          ) : (
            // Форма ввода email
            <>
              <h2 className={styles.title}>{T.title}</h2>

              <div className={styles.description}>
                <p>{T.description}</p>
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>{T.emailLabel}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder={T.emailPlaceholder}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => change(e.target.value)}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              {errors.form && (
                <div className={styles.formError} role="alert">
                  {errors.form}
                </div>
              )}

              <button
                className={styles.submitButton}
                type="submit"
                disabled={forgot.isPending}
              >
                {forgot.isPending ? T.sending : T.submit}
              </button>
            </>
          )}

          {!sent && (
            <p className={styles.registerText}>
              {T.rememberedPassword}{' '}
              <a
                href="#login"
                className={styles.registerLink}
                onClick={(e) => { e.preventDefault(); onGoToLogin() }}
              >
                {T.login}
              </a>
            </p>
          )}
        </form>
      </div>
    </main>
  )
}