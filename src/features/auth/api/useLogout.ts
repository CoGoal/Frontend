import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { useAuthStore } from '../../../entities/session/model/authStore'

export function useLogout() {
    const client = useQueryClient()
    return useMutation({
        // all: true значит «выйти на всех устройствах»
        mutationFn: (all: boolean) => api<void>(all ? ENDPOINTS.logoutAll : ENDPOINTS.logout, {
            method: 'POST',
            body: all ? undefined : () => ({ refreshToken: useAuthStore.getState().refreshToken }),
        }),
        onSuccess: async () => {
            useAuthStore.getState().clear()
            await client.cancelQueries()
            client.removeQueries()
        },
    })
}