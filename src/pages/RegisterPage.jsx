import { useState } from 'react'
import { useRegister } from '../api/hooks'
import { parseServerError } from '../api/errors'
import AuthField from '../components/AuthField'
import EyeIcon from '../components/EyeIcon'
import { EMAIL_RE, USERNAME_RE } from '../utils/validators'
import './LoginPage.css' // стили общие для входа и регистрации

// Проверка на стороне фронта — те же правила, что в RegisterRequest из контракта
function validate({ email, username, name, password }) {
  const errors = {}
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Введите корректный email'
  if (!USERNAME_RE.test(username)) {
    errors.username = 'От 3 до 32 символов: латинские буквы, цифры и _'
  }
  if (!name.trim()) errors.name = 'Введите имя'
  else if (name.trim().length > 100) errors.name = 'Не больше 100 символов'
  if (password.length < 8) errors.password = 'Пароль должен быть не короче 8 символов'
  return errors
}

// Как поля из ответа сервера соответствуют полям нашей формы
const ERROR_OPTIONS = {
  fieldMap: { email: 'email', username: 'username', name: 'name', password: 'password' },
  codeMap: { EMAIL_TAKEN: 'email', USERNAME_TAKEN: 'username' },
  fallback: 'Не удалось создать аккаунт',
}

export default function RegisterPage({ onGoToLogin }) {
  const [values, setValues] = useState({ email: '', username: '', name: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
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
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-logo">CoGoal</h1>
        <p className="login-tagline">Достигай целей вместе.</p>

        <h2 className="login-title">Регистрация</h2>

        <AuthField
          name="email"
          type="email"
          placeholder="email"
          autoComplete="email"
          value={values.email}
          onChange={(v) => change('email', v)}
          error={errors.email}
        />

        <AuthField
          name="username"
          placeholder="username"
          autoComplete="username"
          value={values.username}
          onChange={(v) => change('username', v)}
          error={errors.username}
        />

        <AuthField
          name="name"
          placeholder="имя пользователя"
          autoComplete="name"
          value={values.name}
          onChange={(v) => change('name', v)}
          error={errors.name}
        />

        <AuthField
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="пароль"
          autoComplete="new-password"
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

        {errors.form && <p className="login-error" role="alert">{errors.form}</p>}

        <button className="login-submit" type="submit" disabled={register.isPending}>
          {register.isPending ? 'Создаём…' : 'Создать аккаунт'}
        </button>

        <p className="login-register">
          Уже есть аккаунт?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onGoToLogin?.() }}>Войти</a>
        </p>
      </form>
    </main>
  )
}