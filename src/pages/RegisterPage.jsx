import { useState } from 'react'
import { useRegister } from '../api/hooks'
import { parseServerError } from '../api/errors'
import EyeIcon from '../components/EyeIcon'
import { EMAIL_RE, USERNAME_RE, passwordError } from '../utils/validators'
import './LoginPage.css' // стили общие для входа и регистрации

// Проверка на стороне фронта — те же правила, что в RegisterRequest из контракта
function validate({ email, username, name, password, confirmPassword }) {
  const errors = {}
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Введите корректный email'
  if (!USERNAME_RE.test(username)) {
    errors.username = 'От 3 до 32 символов: латинские буквы, цифры и _'
  }
  if (!name.trim()) errors.name = 'Введите имя'
  else if (name.trim().length > 100) errors.name = 'Не больше 100 символов'
  if (passwordError(password)) errors.password = passwordError(password)
  if (!confirmPassword.trim()) errors.confirmPassword = 'Подтвердите пароль'
  else if (password !== confirmPassword) errors.confirmPassword = 'Пароли не совпадают'
  return errors
}

// Как поля из ответа сервера соответствуют полям нашей формы
const ERROR_OPTIONS = {
  fieldMap: { email: 'email', username: 'username', name: 'name', password: 'password' },
  codeMap: { EMAIL_TAKEN: 'email', USERNAME_TAKEN: 'username' },
  fallback: 'Не удалось создать аккаунт',
}

export default function RegisterPage({ onGoToLogin }) {
  const [values, setValues] = useState({ email: '', username: '', name: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
  const [errors, setErrors] = useState({})
  const register = useRegister() // register.isPending — идёт запрос

  function change(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  function handleSubmit(e) {
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
    <main className="login-page">
      {/* Логотип ВНЕ карточки */}
      <div className="login-logo-wrapper">
        <div className="login-logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#5B2A86"/>
            <path d="M12 20C12 15.5817 15.5817 12 20 12V12C24.4183 12 28 15.5817 28 20" stroke="white" strokeWidth="3"/>
            <circle cx="20" cy="20" r="4" fill="white"/>
          </svg>
        </div>
        <span className="login-logo-text">CoGoal</span>
      </div>

      {/* Белая карточка */}
      <div className="login-card">
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="login-title">Регистрация</h2>

          <div className="login-field">
            <label htmlFor="name" className="login-label">Имя</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`login-input ${errors.name ? 'login-input-error' : ''}`}
              placeholder="Иван Иванов"
              autoComplete="name"
              value={values.name}
              onChange={(e) => change('name', e.target.value)}
            />
            {errors.name && <span className="login-error-text">{errors.name}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="username" className="login-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className={`login-input ${errors.username ? 'login-input-error' : ''}`}
              placeholder="@username"
              autoComplete="username"
              value={values.username}
              onChange={(e) => change('username', e.target.value)}
            />
            {errors.username && <span className="login-error-text">{errors.username}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`login-input ${errors.email ? 'login-input-error' : ''}`}
              placeholder="example@email.com"
              autoComplete="email"
              value={values.email}
              onChange={(e) => change('email', e.target.value)}
            />
            {errors.email && <span className="login-error-text">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">Пароль</label>
            <div className="login-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword.password ? 'text' : 'password'}
                className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                placeholder="Минимум 8 символов"
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => change('password', e.target.value)}
              />
              <button
                type="button"
                className="login-eye-button"
                onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                aria-label={showPassword.password ? 'Скрыть пароль' : 'Показать пароль'}
              >
                <EyeIcon crossed={showPassword.password} />
              </button>
            </div>
            {errors.password && <span className="login-error-text">{errors.password}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="confirmPassword" className="login-label">Подтверждение пароля</label>
            <div className="login-password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                className={`login-input ${errors.confirmPassword ? 'login-input-error' : ''}`}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(e) => change('confirmPassword', e.target.value)}
              />
              <button
                type="button"
                className="login-eye-button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                aria-label={showPassword.confirm ? 'Скрыть пароль' : 'Показать пароль'}
              >
                <EyeIcon crossed={showPassword.confirm} />
              </button>
            </div>
            {errors.confirmPassword && <span className="login-error-text">{errors.confirmPassword}</span>}
          </div>

          {errors.form && (
            <div className="login-form-error" role="alert">
              {errors.form}
            </div>
          )}

          <button
            className="login-submit-button"
            type="submit"
            disabled={register.isPending}
          >
            {register.isPending ? 'Создаём…' : 'Регистрация'}
          </button>

          <p className="login-register-text">
            Уже есть аккаунт?{' '}
            <a
              href="#login"
              className="login-register-link"
              onClick={(e) => { e.preventDefault(); onGoToLogin?.() }}
            >
              Войти
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
