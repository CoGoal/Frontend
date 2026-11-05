import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { queryKeys } from '../../../shared/api/queryKeys'
import { useAuthStore } from '../../../entities/session/model/authStore'
import type { AuthResponse } from '../../../entities/session/model/types'

export function useSessionMutation<TBody>(path: string) {
    const client = useQueryClient()
    // Три подписи в <>: что придёт в ответ, какая бывает ошибка, что отправляем
    return useMutation<AuthResponse, Error, TBody>({
        mutationFn: (body) => api<AuthResponse>(path, { method: 'POST', body, auth: false }),
        onSuccess: async (data) => {
        await client.cancelQueries()
        client.removeQueries()
        client.setQueryData(queryKeys.account, data.user)
        useAuthStore.getState().startSession(data)
        },
    })
}