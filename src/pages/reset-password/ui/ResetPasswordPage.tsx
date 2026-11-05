import { useState, type SubmitEvent } from 'react'
import { useResetPassword } from '../../../features/auth/api'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import EyeIcon from '../../../shared/ui/EyeIcon'
import Logo from '../../../shared/ui/Logo'
import { passwordError } from '../../../shared/lib/validators'
import { RESET_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'

const ERROR_OPTIONS = {
  fieldMap: { newPassword: 'password', password: 'password' },
  fallback: T.linkInvalid,
}

interface ResetPasswordPageProps {
  token: string | null
  onGoToLogin: () => void
  onGoToForgot: () => void
}

export default function ResetPasswordPage({ token, onGoToLogin, onGoToForgot }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState(false)
  const reset = useResetPassword()

  function change(field: 'password' | 'confirmPassword', value: string) {
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
    setErrors({}) // Сбрасываем ошибки при вводе
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!token) return // без токена менять пароль нельзя (форму мы и не показываем)

    const newErrors: FormErrors = {}
    if (passwordError(password)) newErrors.password = passwordError(password)
    if (!confirmPassword.trim()) newErrors.confirmPassword = T.confirmRequired
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = T.passwordsMismatch
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    reset.mutate(
      { token, newPassword: password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)),
      },
    )
  }

  // В ссылке нет токена — менять пароль нельзя
  if (!token) {
    return (
      <main className={styles.page}>
        <Logo />

        <div className={styles.card}>
          <form noValidate>
            <h2 className={styles.title}>{T.title}</h2>

            <div className={styles.description} role="alert">
              <p>{T.linkInvalidAsk}</p>
            </div>

            <p className={styles.registerText}>
              <a
                href="#forgot"
                className={styles.registerLink}
                onClick={(e) => { e.preventDefault(); onGoToForgot() }}
              >
                {T.getNewLink}
              </a>
            </p>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <Logo />

      <div className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>{T.title}</h2>

          {done ? (
            <div className={styles.description} role="status">
              <p>{T.doneTitle}</p>
              <p>{T.doneDescription}</p>
            </div>
          ) : (
            <>
              <div className={styles.description}>
                <p>{T.description}</p>
              </div>

              {/* Поле: Новый пароль */}
              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>{T.passwordLabel}</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword.password ? 'text' : 'password'}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder={T.passwordPlaceholder}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => change('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                    aria-label={showPassword.password ? T.hidePassword : T.showPassword}
                  >
                    <EyeIcon crossed={showPassword.password} />
                  </button>
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              {/* Поле: Подтверждение пароля */}
              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>{T.confirmLabel}</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder={T.confirmPlaceholder}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => change('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    aria-label={showPassword.confirm ? T.hidePassword : T.showPassword}
                  >
                    <EyeIcon crossed={showPassword.confirm} />
                  </button>
                </div>
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
              </div>

              {errors.form && (
                <div className={styles.formError} role="alert">
                  {errors.form}{' '}
                  <a
                    href="#forgot"
                    className={styles.inlineLink}
                    onClick={(e) => { e.preventDefault(); onGoToForgot() }}
                  >
                    {T.getNewLink}
                  </a>
                </div>
              )}

              <button
                className={styles.submitButton}
                type="submit"
                disabled={reset.isPending}
              >
                {reset.isPending ? T.submitting : T.submit}
              </button>
            </>
          )}

          <p className={styles.registerText}>
            {done ? T.allDone : T.rememberedPassword}{' '}
            <a
              href="#login"
              className={styles.registerLink}
              onClick={(e) => { e.preventDefault(); onGoToLogin() }}
            >
              {T.login}
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}