import { useState } from 'react'
import { useResetPassword } from '../api/hooks'
import { parseServerError } from '../api/errors'
import EyeIcon from '../components/EyeIcon'
import { passwordError } from '../utils/validators'
import './LoginPage.css'

const ERROR_OPTIONS = {
  fieldMap: { newPassword: 'password', password: 'password' },
  fallback: 'Ссылка недействительна или срок её действия истёк',
}

export default function ResetPasswordPage({ token, onGoToLogin, onGoToForgot }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const reset = useResetPassword()

  function change(field, value) {
    if (field === 'password') setPassword(value)
    if (field === 'confirmPassword') setConfirmPassword(value)
    setErrors({}) // Сбрасываем ошибки при вводе
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}
    if (passwordError(password)) newErrors.password = passwordError(password)
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Подтвердите пароль'
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
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
          <form noValidate>
            <h2 className="login-title">Восстановление пароля</h2>
            
            <div className="login-description" role="alert">
              <p>Ссылка недействительна или срок её действия истёк. Запросите новую.</p>
            </div>

            <p className="login-register-text">
              <a
                href="#forgot"
                className="login-register-link"
                onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}
              >
                Получить новую ссылку
              </a>
            </p>
          </form>
        </div>
      </main>
    )
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
          <h2 className="login-title">Восстановление пароля</h2>

          {done ? (
            <div className="login-description" role="status">
              <p>Пароль успешно изменён!</p>
              <p>Теперь вы можете войти с новым паролем.</p>
            </div>
          ) : (
            <>
              <div className="login-description">
                <p>Придумайте новый пароль для вашего аккаунта.</p>
              </div>

              {/* Поле: Новый пароль */}
              <div className="login-field">
                <label htmlFor="password" className="login-label">Новый пароль</label>
                <div className="login-password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword.password ? 'text' : 'password'}
                    className={`login-input ${errors.password ? 'login-input-error' : ''}`}
                    placeholder="Минимум 8 символов"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => change('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="login-eye-button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                    aria-label={showPassword.password ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    <EyeIcon crossed={showPassword.password} />
                  </button>
                </div>
                {errors.password && <span className="login-error-text">{errors.password}</span>}
              </div>

              {/*Поле: Подтверждение пароля */}
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
                    value={confirmPassword}
                    onChange={(e) => change('confirmPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    className="login-eye-button"
                    onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    aria-label={showPassword.confirm ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    <EyeIcon crossed={showPassword.confirm} />
                  </button>
                </div>
                {errors.confirmPassword && <span className="login-error-text">{errors.confirmPassword}</span>}
              </div>

              {errors.form && (
                <div className="login-form-error" role="alert">
                  {errors.form}{' '}
                  <a
                    href="#forgot"
                    className="login-inline-link"
                    onClick={(e) => { e.preventDefault(); onGoToForgot?.() }}
                  >
                    Получить новую ссылку
                  </a>
                </div>
              )}

              <button
                className="login-submit-button"
                type="submit"
                disabled={reset.isPending}
              >
                {reset.isPending ? 'Сохраняем…' : 'Сохранить пароль'}
              </button>
            </>
          )}

          <p className="login-register-text">
            {done ? 'Всё готово? ' : 'Вспомнили пароль? '}
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
