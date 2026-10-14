import { useState } from 'react'
import { useForgotPassword } from '../api/hooks'
import { parseServerError } from '../api/errors'
import { EMAIL_RE } from '../utils/validators'
import './LoginPage.css'

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

  function handleResend() {
    // Сбрасываем sent и отправляем снова
    setSent(false)
    forgot.mutate(email.trim(), {
      onSuccess: () => setSent(true),
      onError: (err) => setErrors(parseServerError(err, ERROR_OPTIONS)),
    })
  }

  return (
    <main className="login-page">

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
          {sent ? (
            // Страница успеха
            <>
              <div className="success-icon-wrapper">
                <img 
                    src="/check-icon.svg" 
                    alt="Успешно отправлено"
                    className="success-icon"
                  />
              </div>

              <h2 className="success-title">Проверьте почту</h2>

              <div className="success-description">
                <p>
                  Если аккаунт {email.trim()} существует, письмо придёт на этот адрес.
                  Ссылка активна в течение 30 минут.
                </p>
              </div>

              <button
                type="button"
                className="success-button"
                onClick={onGoToLogin}
              >
                Вернуться на страницу входа
              </button>

              <p className="resend-text">
                Не пришло письмо?{' '}
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResend}
                  disabled={forgot.isPending}
                >
                  {forgot.isPending ? 'Отправляем…' : 'Отправить повторно'}
                </button>
              </p>
            </>
          ) : (
            // Форма ввода email
            <>
              <h2 className="login-title">Восстановление пароля</h2>

              <div className="login-description">
                <p>
                  Введите email, указанный при регистрации.
                  Мы отправим временную ссылку для сброса пароля 
                  (действует 30 минут)
                </p>
              </div>

              <div className="login-field">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`login-input ${errors.email ? 'login-input-error' : ''}`}
                  placeholder="Введите email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => change(e.target.value)}
                />
                {errors.email && <span className="login-error-text">{errors.email}</span>}
              </div>

              {errors.form && (
                <div className="login-form-error" role="alert">
                  {errors.form}
                </div>
              )}

              <button
                className="login-submit-button"
                type="submit"
                disabled={forgot.isPending}
              >
                {forgot.isPending ? 'Отправляем…' : 'Получить ссылку'}
              </button>
            </>
          )}

          {!sent && (
            <p className="login-register-text">
              Вспомнили пароль?{' '}
              <a
                href="#login"
                className="login-register-link"
                onClick={(e) => { e.preventDefault(); onGoToLogin?.() }}
              >
                Войти
              </a>
            </p>
          )}
        </form>
      </div>
    </main>
  )
}
