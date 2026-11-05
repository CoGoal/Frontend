import type { Tokens } from '../../../shared/api/types'

// Роль пользователя: обычный или администратор
export type Role = 'USER' | 'ADMIN'

// Данные аккаунта (то, что хранит сервер входа). Даты приходят текстом.
export interface AuthUser {
    id: number
    email: string
    username: string
    role: Role
    roles?: Role[]
    createdAt: string
}

// Ответ сервера на вход, регистрацию и обновление ключей
export interface AuthResponse extends Tokens {
    expiresIn: number
    user: AuthUser
    tokenType?: 'Bearer'
    refreshExpiresIn?: number
}