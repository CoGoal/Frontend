// Общие правила проверки полей
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/

export function passwordError(password) {
  if (password.length < 8) return 'Минимум 8 символов'
  if (new TextEncoder().encode(password).length > 72) return 'Не больше 72 байт: для кириллицы лимит короче'
  return undefined
}
