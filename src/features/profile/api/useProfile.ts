import { useQuery } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { queryKeys } from '../../../shared/api/queryKeys'
import { useAuthStore } from '../../../entities/session/model/authStore'
import type { ApiError } from '../../../shared/api/types'
import type { Profile } from '../model/types'
import { PROFILE_POLL_INTERVAL_MS } from '../../../shared/config/limits'

// Сервер отвечает PROFILE_PENDING, пока профиль после регистрации ещё создаётся
export const profilePending = (error: unknown) =>
    (error as ApiError | null)?.problem?.code === 'PROFILE_PENDING'

export function useProfile(enabled: boolean = true) {
    const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
    return useQuery({
        queryKey: queryKeys.profile,
        queryFn: ({ signal }) => api<Profile>(ENDPOINTS.profile, { signal }),
        enabled: enabled && hasSession,
        retry: false,
        refetchInterval: (query) => profilePending(query.state.error) ? PROFILE_POLL_INTERVAL_MS : false,
    })
}