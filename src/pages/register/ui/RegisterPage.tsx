import { useState, type SubmitEvent } from 'react'
import { useRegister } from '../../../features/auth/api'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import EyeIcon from '../../../shared/ui/EyeIcon'
import Logo from '../../../shared/ui/Logo'
import { EMAIL_RE, USERNAME_RE, passwordError } from '../../../shared/lib/validators'
import { LIMITS } from '../../../shared/config/limits'
import { REGISTER_TEXTS as T } from '../../../shared/config/texts'
import styles from '../../../shared/ui/auth.module.css'

// Все поля формы регистрации
interface RegisterValues {
  email: string
  username: string
  name: string
  password: string
  confirmPassword: string
}

// Проверка на стороне фронта — те же правила, что в RegisterRequest из контракта
function validate({ email, username, name, password, confirmPassword }: RegisterValues): FormErrors {
  const errors: FormErrors = {}
  if (!EMAIL_RE.test(email.trim())) errors.email = T.emailInvalid
  if (!USERNAME_RE.test(username)) errors.username = T.usernameInvalid
  if (!name.trim()) errors.name = T.nameRequired
  else if (name.trim().length > LIMITS.nameMax) errors.name = T.nameTooLong
  if (passwordError(password)) errors.password = passwordError(password)
  if (!confirmPassword.trim()) errors.confirmPassword = T.confirmRequired
  else if (password !== confirmPassword) errors.confirmPassword = T.passwordsMismatch
  return errors
}

// Как поля из ответа сервера соответствуют полям нашей формы
const ERROR_OPTIONS = {
  fieldMap: { email: 'email', username: 'username', name: 'name', password: 'password' },
  codeMap: { EMAIL_TAKEN: 'email', USERNAME_TAKEN: 'username' },
  fallback: T.failed,
}

interface RegisterPageProps {
  onGoToLogin: () => void
}

export default function RegisterPage({ onGoToLogin }: RegisterPageProps) {
  const [values, setValues] = useState<RegisterValues>({
    email: '', username: '', name: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
  const [errors, setErrors] = useState<FormErrors>({})
  const register = useRegister() // register.isPending — идёт запрос

  function change(field: keyof RegisterValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const clientErrors = validate(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return

    // POST /auth/register: пользователь сразу авторизуется (требование 1.1.3)
    register.mutate(
      {
        email: values.email.trim(),
        username: values.username,
        name: values.name.trim(),
        password: values.password,
      },
      { onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)) },
    )
  }

  return (
    <main className={styles.page}>
      {/* Логотип ВНЕ карточки */}
      <Logo />

      {/* Белая карточка */}
      <div className={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={styles.title}>{T.title}</h2>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>{T.nameLabel}</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder={T.namePlaceholder}
              autoComplete="name"
              value={values.name}
              onChange={(e) => change('name', e.target.value)}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>{T.usernameLabel}</label>
            <input
              id="username"
              name="username"
              type="text"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder={T.usernamePlaceholder}
              autoComplete="username"
              value={values.username}
              onChange={(e) => change('username', e.target.value)}
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
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
              value={values.email}
              onChange={(e) => change('email', e.target.value)}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

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
                value={values.password}
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
                value={values.confirmPassword}
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
              {errors.form}
            </div>
          )}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={register.isPending}
          >
            {register.isPending ? T.submitting : T.submit}
          </button>

          <p className={styles.registerText}>
            {T.haveAccount}{' '}
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