export interface Tokens {
    accessToken: string
    refreshToken: string
}

export interface ServerProblem {
    code?: string
    message?: string
    detail?: string
    details?: { field: string; message: string }[]
}

export interface ApiError extends Error {
    status?: number
    problem?: ServerProblem | null
    accessToken?: string | null
}