import { useState } from 'react'
import { useForgotPassword } from '../api/hooks'
import { parseServerError } from '../api/errors'
import AuthField from '../components/AuthField'
import { EMAIL_RE } from '../utils/validators'
import './LoginPage.css' // стили общие для всех экранов авторизации

const ERROR_OPTIONS = {
  fieldMap: { email: 'email' },
  fallback: 'Не удалось отправить ссылку',
}

export default function ForgotPasswordPage({ onGoToLogin }) {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const forgot = useForgotPassword()

  function change(value) {
    setEmail(value)
    setErrors({})
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!EMAIL_RE.test(email.trim())) {
      setErrors({ email: 'Введите корректный email' })
      return
    }

    forgot.mutate(email.trim(), {
      onSuccess: () => setSent(true),
      onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)),
    })
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-logo">CoGoal</h1>
        <p className="login-tagline">Достигай целей вместе.</p>

        <h2 className="login-title">Восстановление пароля</h2>

        {sent ? (
          <p className="login-description" role="status">
            Если аккаунт с адресом {email.trim()} существует, мы отправили на него
            ссылку для сброса пароля. Ссылка действительна 30 минут.
          </p>
        ) : (
          <>
            <p className="login-description">
              Введите email, указанный при регистрации.
              <br />
              Мы отправим на него ссылку для сброса пароля.
              <br />
              Ссылка действительна 30 минут
            </p>

            <AuthField
              name="email"
              type="email"
              placeholder="email"
              autoComplete="email"
              value={email}
              onChange={change}
              error={errors.email}
            />

            {errors.form && <p className="login-error" role="alert">{errors.form}</p>}

            <button className="login-submit" type="submit" disabled={forgot.isPending}>
              {forgot.isPending ? 'Отправляем…' : 'Получить ссылку'}
            </button>
          </>
        )}

        <p className="login-register">
          Вспомнили пароль?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onGoToLogin?.() }}>Войти</a>
        </p>
      </form>
    </main>
  )
}