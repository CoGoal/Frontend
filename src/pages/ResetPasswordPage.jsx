import { useState } from 'react'
import { useResetPassword } from '../api/hooks'
import { parseServerError } from '../api/errors'
import AuthField from '../components/AuthField'
import EyeIcon from '../components/EyeIcon'
import './LoginPage.css' // стили общие для всех экранов авторизации

const ERROR_OPTIONS = {
  fieldMap: { newPassword: 'password', password: 'password' },
  fallback: 'Ссылка недействительна или срок её действия истёк',
}

// Экран открывается по ссылке из письма: https://.../?token=...
export default function ResetPasswordPage({ token, onGoToLogin, onGoToForgot }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const reset = useResetPassword()

  function change(value) {
    setPassword(value)
    setErrors({})
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (password.length < 8) {
      setErrors({ password: 'Пароль должен быть не короче 8 символов' })
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
      <main className="login-page">
        <div className="login-card">
          <h1 className="login-logo">CoGoal</h1>
          <p className="login-tagline">Достигай целей вместе.</p>
          <h2 className="login-title">Восстановление пароля</h2>
          <p className="login-description" role="alert">
            Ссылка недействительна. Запросите новую.
          </p>
          <p className="login-register">
            <a href="#forgot" onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}>
              Получить новую ссылку
            </a>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-logo">CoGoal</h1>
        <p className="login-tagline">Достигай целей вместе.</p>

        <h2 className="login-title">Восстановление пароля</h2>

        {done ? (
          <p className="login-description" role="status">
            Пароль изменён. Теперь можно войти с новым паролем.
          </p>
        ) : (
          <>
            <AuthField
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="новый пароль"
              autoComplete="new-password"
              value={password}
              onChange={change}
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

            {errors.form && (
              <p className="login-error" role="alert">
                {errors.form}{' '}
                <a href="#forgot" className="login-inline-link"
                   onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}>
                  Получить новую ссылку
                </a>
              </p>
            )}

            <button className="login-submit" type="submit" disabled={reset.isPending}>
              {reset.isPending ? 'Сохраняем…' : 'Сохранить пароль'}
            </button>
          </>
        )}

        <p className="login-register">
          {done ? 'Всё готово? ' : 'Вспомнили пароль? '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onGoToLogin?.() }}>Войти</a>
        </p>
      </form>
    </main>
  )
}