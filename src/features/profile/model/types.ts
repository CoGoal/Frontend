import type { Role } from '../../../entities/session/model/types'

// Числа для карточек на странице профиля
export interface ProfileStats {
    completedGoals: number
    activePacts: number
    failedGoals: number
}

// Достижение: например, «Первая победа»
export interface Achievement {
    code: string
    title: string
    receivedAt: string
}

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
    stats?: ProfileStats
    achievements?: Achievement[]
}

// Что можно отправить, чтобы изменить профиль (всё необязательное)
export interface UpdateProfileBody {
    name?: string
    avatarUrl?: string | null
}