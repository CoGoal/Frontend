import { useState } from 'react'
import { useLogin } from '../api/hooks'
import { parseServerError } from '../api/errors'
import AuthField from '../components/AuthField'
import EyeIcon from '../components/EyeIcon'
import './LoginPage.css'

// Как поля из ответа сервера соответствуют полям нашей формы
const ERROR_OPTIONS = {
  fieldMap: { email: 'login', username: 'login', login: 'login', password: 'password' },
  codeMap: { USER_NOT_FOUND: 'login', INVALID_PASSWORD: 'password' },
  fallback: 'Не удалось войти',
}

export default function LoginPage({ onGoToRegister, onGoToForgot }) {
  const [values, setValues] = useState({ login: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const login = useLogin() //вызываем хук

  function change(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const clientErrors = {}
    if (!values.login.trim()) clientErrors.login = 'Введите email или имя пользователя'
    if (!values.password) clientErrors.password = 'Введите пароль'
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) return //Если есть ошибка, но функция заканчивается,то на сервер ничего не отправляется

    // Если в строке есть «@» — это email, иначе username
    const identifier = values.login.trim()
    const credentials = identifier.includes('@')
      ? { email: identifier }
      : { username: identifier }

    // При успехе токены сохранит сам хук useLogin, а App сам покажет следующий экран
    login.mutate(
      { ...credentials, password: values.password },
      { onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)) },
    )
  }

  return (
    <main className="login-page">
      {/* Логотип вынесен за пределы карточки */}
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

      <div className="login-card">
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="login-title">Вход в аккаунт</h2>

          <div className="login-field">
            <label htmlFor="login" className="login-label">
              Email или username
            </label>
            <input
              id="login"
              name="login"
              type="text"
              className={`login-input ${errors.login ? 'login-input-error' : ''}`}
              placeholder="Введите email или username"
              autoComplete="username"
              value={values.login}
              onChange={(e) => change('login', e.target.value)}
            />
            {errors.login && <span className="login-error-text">{errors.login}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Пароль
            </label>
            <div className="login-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                placeholder="Введите пароль"
                autoComplete="current-password"
                value={values.password}
                onChange={(e) => change('password', e.target.value)}
              />
              <button
                type="button"
                className="login-eye-button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                <EyeIcon crossed={showPassword} />
              </button>
            </div>
            {errors.password && <span className="login-error-text">{errors.password}</span>}
          </div>

          <div className="login-forgot-wrapper">
            <a
              className="login-forgot-link"
              href="#forgot"
              onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}
            >
              Забыли пароль?
            </a>
          </div>

          {errors.form && (
            <div className="login-form-error" role="alert">
              {errors.form}
            </div>
          )}

          <button
            className="login-submit-button"
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? 'Входим…' : 'Войти'}
          </button>

          <p className="login-register-text">
            Нет аккаунта?{' '}
            <a
              href="#register"
              className="login-register-link"
              onClick={(e) => { e.preventDefault(); onGoToRegister?.() }}
            >
              Регистрация
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}