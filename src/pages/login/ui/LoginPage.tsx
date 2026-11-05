import { useState, type SubmitEvent } from 'react'
import { useLogin } from '../../../features/auth/api'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import EyeIcon from '../../../shared/ui/EyeIcon'
import Logo from '../../../shared/ui/Logo'
import { LOGIN_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'

// Как поля из ответа сервера соответствуют полям нашей формы
const ERROR_OPTIONS = {
  fieldMap: { email: 'login', username: 'login', login: 'login', password: 'password' },
  codeMap: { USER_NOT_FOUND: 'login', INVALID_PASSWORD: 'password' },
  fallback: T.failed,
}

// Поля формы
type Field = 'login' | 'password'

interface LoginPageProps {
  notice?: string
  onGoToRegister: () => void
  onGoToForgot: () => void
}

export default function LoginPage({ onGoToRegister, onGoToForgot, notice }: LoginPageProps) {
  const [values, setValues] = useState<Record<Field, string>>({ login: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const login = useLogin()

  function change(field: Field, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const clientErrors: FormErrors = {}
    if (!values.login.trim()) clientErrors.login = T.loginRequired
    if (!values.password) clientErrors.password = T.passwordRequired
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    login.mutate(
      { login: values.login.trim(), password: values.password },
      { onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)) },
    )
  }

  return (
    <main className={styles.page}>
      <Logo />

      <div className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>{T.title}</h2>
          {notice && <p className={styles.description} role="status">{notice}</p>}

          <div className={styles.field}>
            <label htmlFor="login" className={styles.label}>
              {T.loginLabel}
            </label>
            <input
              id="login"
              name="login"
              type="text"
              className={`${styles.input} ${errors.login ? styles.inputError : ''}`}
              placeholder={T.loginPlaceholder}
              autoComplete="username"
              value={values.login}
              onChange={(e) => change('login', e.target.value)}
            />
            {errors.login && <span className={styles.errorText}>{errors.login}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              {T.passwordLabel}
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder={T.passwordPlaceholder}
                autoComplete="current-password"
                value={values.password}
                onChange={(e) => change('password', e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? T.hidePassword : T.showPassword}
              >
                <EyeIcon crossed={showPassword} />
              </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.forgotWrapper}>
            <a
              className={styles.forgotLink}
              href="#forgot"
              onClick={(e) => { e.preventDefault(); onGoToForgot() }}
            >
              {T.forgot}
            </a>
          </div>

          {errors.form && (
            <div className={styles.formError} role="alert">
              {errors.form}
            </div>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? T.submitting : T.submit}
          </button>

          <p className={styles.registerText}>
            {T.noAccount}{' '}
            <a
              href="#register"
              className={styles.registerLink}
              onClick={(e) => { e.preventDefault(); onGoToRegister() }}
            >
              {T.register}
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}