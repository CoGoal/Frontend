import type { Role } from '../../../entities/session/model/types'

// Профиль: имя, аватар, монеты
export interface Profile {
    id: number
    username: string
    email: string
    name: string
    avatarUrl: string | null
    coins: number
    role: Role
    createdAt: string
}

// Что можно отправить, чтобы изменить профиль (всё необязательное)
export interface UpdateProfileBody {
    name?: string
    avatarUrl?: string | null
}