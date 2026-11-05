import { VALIDATION_TEXTS as T } from '../config/texts'
import { LIMITS } from '../config/limits'

// Общие правила проверки полей
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const USERNAME_RE = new RegExp(`^[a-zA-Z0-9_]{${LIMITS.usernameMin},${LIMITS.usernameMax}}$`)

// Принимает текст, возвращает текст ошибки или «ничего», если пароль хороший
export function passwordError(password: string): string | undefined {
  if (password.length < LIMITS.passwordMin) return T.passwordTooShort
  if (new TextEncoder().encode(password).length > LIMITS.passwordMaxBytes) return T.passwordTooLong
  return undefined
}