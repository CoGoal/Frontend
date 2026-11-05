import { useState, type SubmitEvent } from 'react'
import { useChangePassword, useLogout } from '../../../features/auth/api'
import { useAccount, useUpdateProfile, useChangeUsername, useEmailChange } from '../../../features/profile/api'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import { EMAIL_RE, USERNAME_RE, passwordError } from '../../../shared/lib/validators'
import { LIMITS } from '../../../shared/config/limits'
import { PROFILE_PAGE_TEXTS as T, APP_NAME } from '../../../shared/config/texts'
import type { Profile } from '../../../features/profile/model/types'
import auth from '../../../shared/ui/auth.module.css'
import styles from './ProfilePage.module.css'

interface FieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
  maxLength?: number
}

function Field({ label, name, type = 'text', value, onChange, error, autoComplete, maxLength }: FieldProps) {
  return (
    <div className={auth.field}>
      <label className={auth.label} htmlFor={name}>{label}</label>
      <input
        className={`${auth.input} ${error ? auth.inputError : ''}`}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? name + '-error' : undefined}
      />
      {error && <span className={auth.errorText} id={name + '-error'}>{error}</span>}
    </div>
  )
}

interface FeedbackProps {
  errors: FormErrors
  message: string
}

function Feedback({ errors, message }: FeedbackProps) {
  return (
    <>
      {errors.form && <p className={auth.formError} role="alert">{errors.form}</p>}
      {message && <p className={styles.success} role="status">{message}</p>}
    </>
  )
}

// Четыре формы на странице. Для каждой хранится своё сообщение об успехе или ошибке
type Section = 'profile' | 'username' | 'password' | 'email'

interface SectionFeedback {
  errors: FormErrors
  message: string
}

interface ProfilePageProps {
  profile: Profile
  onLoggedOut: () => void
}

export default function ProfilePage({ profile, onLoggedOut }: ProfilePageProps) {
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
  const [feedback, setFeedback] = useState<Partial<Record<Section, SectionFeedback>>>({})

  function result(section: Section, errors: FormErrors = {}, message = '') {
    setFeedback((state) => ({ ...state, [section]: { errors, message } }))
  }
  const props = (section: Section): SectionFeedback => feedback[section] || { errors: {}, message: '' }
  const failure = (
    section: Section,
    fieldMap: Record<string, string>,
    codeMap?: Record<string, string>,
  ) => (err: unknown) => result(section, parseServerError(err, { fieldMap, codeMap }))

  function saveProfile(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors: FormErrors = {}
    if (!name.trim() || name.trim().length > LIMITS.nameMax) errors.name = T.nameInvalid
    if (avatarUrl.trim() && !/^https?:\/\//i.test(avatarUrl.trim())) errors.avatarUrl = T.avatarInvalid
    if (avatarUrl.trim().length > LIMITS.avatarUrlMax) errors.avatarUrl = T.avatarTooLong
    result('profile', errors)
    if (Object.keys(errors).length) return
    update.mutate({ name: name.trim(), avatarUrl: avatarUrl.trim() || null }, {
      onSuccess: () => result('profile', {}, T.profileSaved),
      onError: failure('profile', { name: 'name', avatarUrl: 'avatarUrl' }),
    })
  }

  function saveUsername(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!USERNAME_RE.test(username)) return result('username', { username: T.usernameInvalid })
    result('username')
    usernameChange.mutate(username, {
      onSuccess: () => result('username', {}, T.usernameSaved),
      onError: failure('username', { username: 'username' }, { USERNAME_TAKEN: 'username' }),
    })
  }

  function savePassword(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors: FormErrors = {}
    if (!passwords.currentPassword) errors.currentPassword = T.currentPasswordRequired
    if (passwordError(passwords.newPassword)) errors.newPassword = passwordError(passwords.newPassword)
    if (passwords.newPassword !== passwords.confirmPassword) errors.confirmPassword = T.passwordsMismatch
    result('password', errors)
    if (Object.keys(errors).length) return
    passwordChange.mutate({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }, {
      onSuccess: onLoggedOut,
      onError: failure('password', { currentPassword: 'currentPassword', newPassword: 'newPassword' }),
    })
  }

  function saveEmail(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const errors: FormErrors = {}
    if (!EMAIL_RE.test(email.newEmail.trim())) errors.newEmail = T.emailInvalid
    if (!email.password) errors.password = T.currentPasswordRequired
    result('email', errors)
    if (Object.keys(errors).length) return
    emailChange.mutate({ newEmail: email.newEmail.trim(), password: email.password }, {
      onSuccess: () => {
        setEmail((state) => ({ ...state, password: '' }))
        result('email', {}, T.emailSent)
      },
      onError: failure(
        'email',
        { newEmail: 'newEmail', password: 'password' },
        { EMAIL_TAKEN: 'newEmail', EMAIL_UNCHANGED: 'newEmail', INVALID_PASSWORD: 'password' },
      ),
    })
  }

  const identity = account.data || profile

  // as const фиксирует названия полей, чтобы passwords[key] было безопасным
  const passwordFields = [
    ['currentPassword', T.currentPassword],
    ['newPassword', T.newPassword],
    ['confirmPassword', T.confirmPassword],
  ] as const

  // Кнопка отправки в панели: общий вид из auth, прижатие книзу из профиля
  const submitClass = `${auth.submitButton} ${styles.submit}`

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.brand}>{APP_NAME}</span>
          <h1>{T.pageTitle}</h1>
        </div>
        <button
          className={auth.resendLink}
          disabled={logout.isPending}
          onClick={() => logout.mutate(false, { onSuccess: onLoggedOut })}
        >
          {T.logout}
        </button>
      </header>

      {logout.isError && (
        <p className={auth.formError} role="alert">{parseServerError(logout.error).form}</p>
      )}

      <section className={styles.summary} aria-label={T.summaryLabel}>
        {/^https?:\/\//i.test(profile.avatarUrl || '') && (
          <img className={styles.avatar} src={profile.avatarUrl ?? undefined} alt={T.avatarAlt} referrerPolicy="no-referrer" />
        )}
        <div>
          <h2>{profile.name || identity.username}</h2>
          <p>@{identity.username}</p>
          <p>{identity.email}</p>
        </div>
        <p className={styles.coins}>{T.coins(profile.coins)}</p>
      </section>

      <div className={styles.grid}>
        <form className={styles.panel} onSubmit={saveProfile} noValidate aria-label={T.profileFormLabel}>
          <h2>{T.profileFormTitle}</h2>
          <Field label={T.nameLabel} name="profile-name" value={name} onChange={setName}
            error={props('profile').errors.name} autoComplete="name" maxLength={LIMITS.nameMax} />
          <Field label={T.avatarLabel} name="avatar-url" type="url" value={avatarUrl} onChange={setAvatarUrl}
            error={props('profile').errors.avatarUrl} maxLength={LIMITS.avatarUrlMax} />
          <p className={styles.hint}>{T.avatarHint}</p>
          <Feedback {...props('profile')} />
          <button className={submitClass} disabled={update.isPending}>{T.profileSubmit}</button>
        </form>

        <form className={styles.panel} onSubmit={saveUsername} noValidate aria-label={T.usernameFormLabel}>
          <h2>{T.usernameFormTitle}</h2>
          <Field label={T.usernameLabel} name="new-username" value={username} onChange={setUsername}
            error={props('username').errors.username} autoComplete="username" maxLength={LIMITS.usernameMax} />
          <Feedback {...props('username')} />
          <button className={submitClass} disabled={usernameChange.isPending}>{T.usernameSubmit}</button>
        </form>

        <form className={styles.panel} onSubmit={savePassword} noValidate aria-label={T.passwordFormLabel}>
          <h2>{T.passwordFormTitle}</h2>
          {passwordFields.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              name={key}
              type="password"
              value={passwords[key]}
              onChange={(value) => setPasswords((state) => ({ ...state, [key]: value }))}
              error={props('password').errors[key]}
              autoComplete={key === 'currentPassword' ? 'current-password' : 'new-password'}
            />
          ))}
          <p className={styles.hint}>{T.passwordHint}</p>
          <Feedback {...props('password')} />
          <button className={submitClass} disabled={passwordChange.isPending}>{T.passwordSubmit}</button>
        </form>

        <form className={styles.panel} onSubmit={saveEmail} noValidate aria-label={T.emailFormLabel}>
          <h2>{T.emailFormTitle}</h2>
          <Field label={T.newEmailLabel} name="new-email" type="email" value={email.newEmail} maxLength={LIMITS.emailMax}
            onChange={(value) => setEmail((state) => ({ ...state, newEmail: value }))}
            error={props('email').errors.newEmail} autoComplete="email" />
          <Field label={T.emailPasswordLabel} name="email-password" type="password" value={email.password}
            onChange={(value) => setEmail((state) => ({ ...state, password: value }))}
            error={props('email').errors.password} autoComplete="current-password" />
          <Feedback {...props('email')} />
          <button className={submitClass} disabled={emailChange.isPending}>{T.emailSubmit}</button>
        </form>
      </div>

      <button
        className={auth.resendLink}
        disabled={logout.isPending}
        onClick={() => logout.mutate(true, { onSuccess: onLoggedOut })}
      >
        {T.logoutAll}
      </button>
    </main>
  )
}