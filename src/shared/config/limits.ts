export const LIMITS = {
    passwordMin: 8,
    passwordMaxBytes: 72,
    usernameMin: 3,
    usernameMax: 32,
    nameMax: 100,
    emailMax: 255,
    avatarUrlMax: 2048,
} as const

// Как часто спрашивать сервер, готов ли профиль (в миллисекундах)
export const PROFILE_POLL_INTERVAL_MS = 2000