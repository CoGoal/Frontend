import { useState } from 'react'
import { useAccount, useUpdateProfile, useChangeUsername, useChangePassword, useEmailChange, useLogout } from '../api/hooks'
import { parseServerError } from '../api/errors'
import { EMAIL_RE, USERNAME_RE, passwordError } from '../utils/validators'
import './ProfilePage.css'

function Field({ label, name, type = 'text', value, onChange, error, autoComplete, maxLength }) {
  return <div className="login-field">
    <label className="login-label" htmlFor={name}>{label}</label>
    <input className={'login-input ' + (error ? 'login-input-error' : '')} id={name} name={name}
      type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete}
      maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? name + '-error' : undefined} />
    {error && <span className="login-error-text" id={name + '-error'}>{error}</span>}
  </div>
}
function Feedback({ errors, message }) {
  return <>{errors.form && <p className="login-form-error" role="alert">{errors.form}</p>}
    {message && <p className="profile-success" role="status">{message}</p>}</>
}
export default function ProfilePage({ profile, onLoggedOut }) {
  const account = useAccount()
  const update = useUpdateProfile()
  const usernameChange = useChangeUsername()
  const passwordChange = useChangePassword()
  const emailChange = useEmailChange()
  const logout = useLogout()
  const [name, setName] = useState(profile.name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')
  const [username, setUsername] = useState(profile.username || '')
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [email, setEmail] = useState({ newEmail: '', password: '' })
  const [feedback, setFeedback] = useState({})
  function result(section, errors = {}, message = '') {
    setFeedback((state) => ({ ...state, [section]: { errors, message } }))
  }
  const props = (section) => feedback[section] || { errors: {}, message: '' }
  const failure = (section, fieldMap, codeMap) => (err) => result(section, parseServerError(err, { fieldMap, codeMap }))
  function saveProfile(e) {
    e.preventDefault()
    const errors = {}
    if (!name.trim() || name.trim().length > 100) errors.name = 'Введите имя от 1 до 100 символов'
    if (avatarUrl.trim() && !/^https?:\/\//i.test(avatarUrl.trim())) errors.avatarUrl = 'Укажите ссылку, начинающуюся с http:// или https://'
    if (avatarUrl.trim().length > 2048) errors.avatarUrl = 'Ссылка слишком длинная'
    result('profile', errors)
    if (Object.keys(errors).length) return
    update.mutate({ name: name.trim(), avatarUrl: avatarUrl.trim() || null }, {
      onSuccess: () => result('profile', {}, 'Профиль сохранён'),
      onError: failure('profile', { name: 'name', avatarUrl: 'avatarUrl' }),
    })
  }
  function saveUsername(e) {
    e.preventDefault()
    if (!USERNAME_RE.test(username)) return result('username', { username: 'От 3 до 32 символов: латинские буквы, цифры и _' })
    result('username')
    usernameChange.mutate(username, {
      onSuccess: () => result('username', {}, 'Логин изменён. Используйте его при следующем входе.'),
      onError: failure('username', { username: 'username' }, { USERNAME_TAKEN: 'username' }),
    })
  }
  function savePassword(e) {
    e.preventDefault()
    const errors = {}
    if (!passwords.currentPassword) errors.currentPassword = 'Введите текущий пароль'
    if (passwordError(passwords.newPassword)) errors.newPassword = passwordError(passwords.newPassword)
    if (passwords.newPassword !== passwords.confirmPassword) errors.confirmPassword = 'Пароли не совпадают'
    result('password', errors)
    if (Object.keys(errors).length) return
    passwordChange.mutate({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }, {
      onSuccess: onLoggedOut,
      onError: failure('password', { currentPassword: 'currentPassword', newPassword: 'newPassword' }),
    })
  }
  function saveEmail(e) {
    e.preventDefault()
    const errors = {}
    if (!EMAIL_RE.test(email.newEmail.trim())) errors.newEmail = 'Введите корректный email'
    if (!email.password) errors.password = 'Введите текущий пароль'
    result('email', errors)
    if (Object.keys(errors).length) return
    emailChange.mutate({ newEmail: email.newEmail.trim(), password: email.password }, {
      onSuccess: () => {
        setEmail((state) => ({ ...state, password: '' }))
        result('email', {}, 'Письмо отправлено на новый адрес. Подтвердите email по ссылке из письма.')
      },
      onError: failure('email', { newEmail: 'newEmail', password: 'password' }, { EMAIL_TAKEN: 'newEmail', EMAIL_UNCHANGED: 'newEmail', INVALID_PASSWORD: 'password' }),
    })
  }
  const identity = account.data || profile
  return <main className="profile-page">
    <header className="profile-header"><div><span className="login-logo-text">CoGoal</span><h1>Мой профиль</h1></div>
      <button className="resend-link" disabled={logout.isPending} onClick={() => logout.mutate(false, { onSuccess: onLoggedOut })}>Выйти</button></header>
    {logout.isError && <p className="login-form-error" role="alert">{parseServerError(logout.error).form}</p>}
    <section className="profile-summary" aria-label="Данные профиля">
      {/^https?:\/\//i.test(profile.avatarUrl || '') && <img className="profile-avatar" src={profile.avatarUrl} alt="Аватар" referrerPolicy="no-referrer" />}
      <div><h2>{profile.name || identity.username}</h2><p>@{identity.username}</p><p>{identity.email}</p></div>
      <p className="profile-coins">{profile.coins} монет</p>
    </section>
    <div className="profile-grid">
      <form className="profile-panel" onSubmit={saveProfile} noValidate aria-label="Редактирование профиля">
        <h2>Имя и аватар</h2>
        <Field label="Имя" name="profile-name" value={name} onChange={setName} error={props('profile').errors.name} autoComplete="name" maxLength={100} />
        <Field label="Ссылка на аватар" name="avatar-url" type="url" value={avatarUrl} onChange={setAvatarUrl} error={props('profile').errors.avatarUrl} maxLength={2048} />
        <p className="profile-hint">Чтобы убрать аватар, оставьте ссылку пустой.</p>
        <Feedback {...props('profile')} /><button className="login-submit-button" disabled={update.isPending}>Сохранить профиль</button>
      </form>
      <form className="profile-panel" onSubmit={saveUsername} noValidate aria-label="Смена логина">
        <h2>Логин для входа</h2><Field label="Новый username" name="new-username" value={username} onChange={setUsername} error={props('username').errors.username} autoComplete="username" maxLength={32} />
        <Feedback {...props('username')} /><button className="login-submit-button" disabled={usernameChange.isPending}>Изменить логин</button>
      </form>
      <form className="profile-panel" onSubmit={savePassword} noValidate aria-label="Смена пароля">
        <h2>Смена пароля</h2>
        {[['currentPassword', 'Текущий пароль'], ['newPassword', 'Новый пароль'], ['confirmPassword', 'Повторите новый пароль']].map(([key, label]) =>
          <Field key={key} label={label} name={key} type="password" value={passwords[key]}
            onChange={(value) => setPasswords((state) => ({ ...state, [key]: value }))} error={props('password').errors[key]}
            autoComplete={key === 'currentPassword' ? 'current-password' : 'new-password'} />)}
        <p className="profile-hint">После смены пароля нужно будет войти снова.</p>
        <Feedback {...props('password')} /><button className="login-submit-button" disabled={passwordChange.isPending}>Изменить пароль</button>
      </form>
      <form className="profile-panel" onSubmit={saveEmail} noValidate aria-label="Смена email">
        <h2>Смена email</h2><Field label="Новый email" name="new-email" type="email" value={email.newEmail} maxLength={255}
          onChange={(value) => setEmail((state) => ({ ...state, newEmail: value }))} error={props('email').errors.newEmail} autoComplete="email" />
        <Field label="Пароль для смены email" name="email-password" type="password" value={email.password}
          onChange={(value) => setEmail((state) => ({ ...state, password: value }))} error={props('email').errors.password} autoComplete="current-password" />
        <Feedback {...props('email')} /><button className="login-submit-button" disabled={emailChange.isPending}>Отправить подтверждение</button>
      </form>
    </div>
    <button className="resend-link" disabled={logout.isPending} onClick={() => logout.mutate(true, { onSuccess: onLoggedOut })}>Выйти на всех устройствах</button>
  </main>
}
