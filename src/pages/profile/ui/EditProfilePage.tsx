import { useState, type ReactNode, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'
import { MainLayout } from '../../../widgets/main-layout'
import { useChangePassword, useLogout } from '../../../features/auth/api'
import { useChangeUsername, useEmailChange, useUpdateProfile } from '../../../features/profile/api'
import type { Profile } from '../../../features/profile/model/types'
import { parseServerError, type FormErrors } from '../../../shared/api/errors'
import { LIMITS } from '../../../shared/config/limits'
import { ROUTES } from '../../../shared/config/routes'
import { EDIT_PROFILE_TEXTS as T } from '../../../shared/config/texts'
import { EMAIL_RE, USERNAME_RE, passwordError } from '../../../shared/lib/validators'
import auth from '../../../shared/ui/auth.module.css'
import styles from './EditProfilePage.module.css'

// Все поля формы
interface FormValues {
    name: string
    username: string
    email: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

// Аватар показываем, только если это настоящая ссылка
const isHttpUrl = (url: string | null) => /^https?:\/\//i.test(url ?? '')

interface InputProps {
    id: string
    type?: string
    value: string
    onChange: (value: string) => void
    error?: string
    autoComplete?: string
    maxLength?: number
    placeholder?: string
}

function Input({ id, type = 'text', value, onChange, error, autoComplete, maxLength, placeholder }: InputProps) {
    return (
        <input
        className={`${auth.input} ${error ? auth.inputError : ''}`}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        />
    )
}

interface RowProps {
    label: string
    htmlFor: string
    error?: string
    hint?: string
    children: ReactNode
}

// Одна строка карточки: подпись слева, поле справа
function Row({ label, htmlFor, error, hint, children }: RowProps) {
    return (
        <div className={styles.row}>
        <label className={styles.rowLabel} htmlFor={htmlFor}>{label}</label>
        <div className={styles.rowValue}>
            {children}
            {error && <span className={auth.errorText} id={`${htmlFor}-error`}>{error}</span>}
            {hint && !error && <span className={styles.hint}>{hint}</span>}
        </div>
        </div>
    )
}

// Один запрос из тех, что нужно отправить при сохранении
interface Step {
    run: () => Promise<unknown>
    fieldMap: Record<string, string>
    codeMap?: Record<string, string>
    message?: string
    finish?: () => void
}

interface EditProfilePageProps {
    profile: Profile
    onLoggedOut: () => void
}

export default function EditProfilePage({ profile, onLoggedOut }: EditProfilePageProps) {
    const update = useUpdateProfile()
    const usernameChange = useChangeUsername()
    const emailChange = useEmailChange()
    const passwordChange = useChangePassword()
    const logout = useLogout()

    const [values, setValues] = useState<FormValues>({
        name: profile.name || '',
        username: profile.username,
        email: profile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [saved, setSaved] = useState<string[]>([])
    const [saving, setSaving] = useState(false)

    // Что из полей человек действительно поменял
    const nameChanged = values.name.trim() !== (profile.name || '')
    const usernameChanged = values.username !== profile.username
    const emailChanged = values.email.trim().toLowerCase() !== profile.email.toLowerCase()
    const passwordChanged = values.newPassword !== '' || values.confirmPassword !== ''

    function change(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    }

    // Проверка полей до отправки на сервер
    function validate(): FormErrors {
        const found: FormErrors = {}
        if (nameChanged && (!values.name.trim() || values.name.trim().length > LIMITS.nameMax)) {
        found.name = T.nameInvalid
        }
        if (usernameChanged && !USERNAME_RE.test(values.username)) found.username = T.usernameInvalid
        if (emailChanged && !EMAIL_RE.test(values.email.trim())) found.email = T.emailInvalid
        if ((emailChanged || passwordChanged) && !values.currentPassword) {
        found.currentPassword = T.currentPasswordRequired
        }
        if (passwordChanged) {
        const problem = passwordError(values.newPassword)
        if (problem) found.newPassword = problem
        if (values.newPassword !== values.confirmPassword) found.confirmPassword = T.passwordsMismatch
        }
        return found
    }

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        setSaved([])

        const clientErrors = validate()
        setErrors(clientErrors)
        if (Object.keys(clientErrors).length > 0) return

        // Собираем только те запросы, которые нужны. Пароль идёт последним,
        // потому что после его смены сайт просит войти заново
        const steps: Step[] = []
        if (nameChanged) {
        steps.push({
            run: () => update.mutateAsync({ name: values.name.trim() }),
            fieldMap: { name: 'name' },
            message: T.profileSaved,
        })
        }
        if (usernameChanged) {
        steps.push({
            run: () => usernameChange.mutateAsync(values.username),
            fieldMap: { username: 'username' },
            codeMap: { USERNAME_TAKEN: 'username' },
            message: T.profileSaved,
        })
        }
        if (emailChanged) {
        steps.push({
            run: () => emailChange.mutateAsync({ newEmail: values.email.trim(), password: values.currentPassword }),
            fieldMap: { newEmail: 'email', password: 'currentPassword' },
            codeMap: { EMAIL_TAKEN: 'email', EMAIL_UNCHANGED: 'email', INVALID_PASSWORD: 'currentPassword' },
            message: T.emailSent,
        })
        }
        if (passwordChanged) {
        steps.push({
            run: () => passwordChange.mutateAsync({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            }),
            fieldMap: { currentPassword: 'currentPassword', newPassword: 'newPassword' },
            codeMap: { INVALID_PASSWORD: 'currentPassword' },
            finish: onLoggedOut,
        })
        }

        if (steps.length === 0) {
        setErrors({ form: T.nothingChanged })
        return
        }

        setSaving(true)
        const done: string[] = []

        for (const step of steps) {
        try {
            await step.run()
        } catch (err) {
            // Если запрос не прошёл, останавливаемся и показываем ошибку у нужного поля
            setErrors(parseServerError(err, { fieldMap: step.fieldMap, codeMap: step.codeMap }))
            setSaving(false)
            return
        }
        if (step.message && !done.includes(step.message)) done.push(step.message)
        setSaved([...done])
        step.finish?.()
        }

        setSaving(false)
        // Пароли стираем, а новый email возвращаем к старому: он поменяется после подтверждения
        setValues((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: emailChanged ? profile.email : prev.email,
        }))
    }

    return (
        <MainLayout coins={profile.coins} activeItem="profile">
        <h1 className={styles.title}>{T.pageTitle}</h1>

        <div className={styles.grid}>
            {/* Левая карточка: кто это */}
            <aside className={`${styles.card} ${styles.aside}`}>
            {isHttpUrl(profile.avatarUrl) ? (
                <img
                className={styles.avatar}
                src={profile.avatarUrl ?? undefined}
                alt={T.avatarAlt}
                referrerPolicy="no-referrer"
                />
            ) : (
                <div className={`${styles.avatar} ${styles.avatarEmpty}`} aria-label={T.avatarAlt}>
                <User size={56} strokeWidth={1.25} aria-hidden="true" />
                </div>
            )}

            <h2 className={styles.name}>{profile.name || profile.username}</h2>
            <p className={styles.meta}>@{profile.username}</p>
            <p className={styles.meta}>{profile.email}</p>

            <div className={styles.asideActions}>
                <Link to={ROUTES.profile} className={styles.backLink}>{T.backToProfile}</Link>
                <button
                type="button"
                className={styles.outlineButton}
                disabled={logout.isPending}
                onClick={() => logout.mutate(false, { onSuccess: onLoggedOut })}
                >
                {T.logout}
                </button>
            </div>

            <button
                type="button"
                className={styles.textButton}
                disabled={logout.isPending}
                onClick={() => logout.mutate(true, { onSuccess: onLoggedOut })}
            >
                {T.logoutAll}
            </button>

            {logout.isError && (
                <p className={auth.formError} role="alert">{parseServerError(logout.error).form}</p>
            )}
            </aside>

            {/* Правая карточка: поля */}
            <form
            className={`${styles.card} ${styles.details}`}
            onSubmit={handleSubmit}
            noValidate
            aria-label={T.pageTitle}
            >
            <Row label={T.nameLabel} htmlFor="edit-name" error={errors.name}>
                <Input
                id="edit-name"
                value={values.name}
                onChange={(v) => change('name', v)}
                error={errors.name}
                autoComplete="name"
                maxLength={LIMITS.nameMax}
                />
            </Row>

            <Row label={T.usernameLabel} htmlFor="edit-username" error={errors.username}>
                <Input
                id="edit-username"
                value={values.username}
                onChange={(v) => change('username', v)}
                error={errors.username}
                autoComplete="username"
                maxLength={LIMITS.usernameMax}
                />
            </Row>

            <Row label={T.emailLabel} htmlFor="edit-email" error={errors.email} hint={T.emailHint}>
                <Input
                id="edit-email"
                type="email"
                value={values.email}
                onChange={(v) => change('email', v)}
                error={errors.email}
                autoComplete="email"
                maxLength={LIMITS.emailMax}
                />
            </Row>

            <Row
                label={T.currentPasswordLabel}
                htmlFor="edit-current-password"
                error={errors.currentPassword}
                hint={T.currentPasswordHint}
            >
                <Input
                id="edit-current-password"
                type="password"
                value={values.currentPassword}
                onChange={(v) => change('currentPassword', v)}
                error={errors.currentPassword}
                autoComplete="current-password"
                />
            </Row>

            <Row label={T.newPasswordLabel} htmlFor="edit-new-password" error={errors.newPassword}>
                <Input
                id="edit-new-password"
                type="password"
                value={values.newPassword}
                onChange={(v) => change('newPassword', v)}
                error={errors.newPassword}
                autoComplete="new-password"
                placeholder={T.newPasswordPlaceholder}
                />
            </Row>

            <Row
                label={T.confirmPasswordLabel}
                htmlFor="edit-confirm-password"
                error={errors.confirmPassword}
                hint={T.passwordHint}
            >
                <Input
                id="edit-confirm-password"
                type="password"
                value={values.confirmPassword}
                onChange={(v) => change('confirmPassword', v)}
                error={errors.confirmPassword}
                autoComplete="new-password"
                />
            </Row>

            <div className={styles.footer}>
                {errors.form && <p className={auth.formError} role="alert">{errors.form}</p>}
                {saved.map((message) => (
                <p key={message} className={styles.success} role="status">{message}</p>
                ))}
                <button className={`${auth.submitButton} ${styles.submit}`} type="submit" disabled={saving}>
                {saving ? T.submitting : T.submit}
                </button>
            </div>
            </form>
        </div>
        </MainLayout>
    )
}