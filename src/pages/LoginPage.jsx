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
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-logo">CoGoal</h1>
        <p className="login-tagline">Достигай целей вместе.</p>

        <h2 className="login-title">Вход</h2>

        <AuthField
          name="login"
          placeholder="email или имя пользователя"
          autoComplete="username"
          value={values.login}
          onChange={(v) => change('login', v)}
          error={errors.login}
        />

        <AuthField
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          autoComplete="current-password"
          value={values.password}
          onChange={(v) => change('password', v)}
          error={errors.password}
        >
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            <EyeIcon crossed={showPassword} />
          </button>
        </AuthField>

        <a
          className="login-forgot"
          href="#forgot"
          onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}
        >
          Забыли пароль?
        </a>

        {errors.form && <p className="login-error" role="alert">{errors.form}</p>}

        <button className="login-submit" type="submit" disabled={login.isPending}>
          {login.isPending ? 'Входим…' : 'Войти'}
        </button>

        <p className="login-register">
          Нет аккаунта?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); onGoToRegister?.() }}>
            Регистрация
          </a>
        </p>
      </form>
    </main>
  )
}