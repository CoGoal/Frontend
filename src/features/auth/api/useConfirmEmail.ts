import { useMutation } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { NOTICES } from '../../../shared/config/texts'
import { useAuthStore } from '../../../entities/session/model/authStore'

export function useConfirmEmail() {
    return useMutation({
        mutationFn: (token: string) =>
        api<void>(ENDPOINTS.confirmEmail, { method: 'POST', body: { token }, auth: false }),
        onSuccess: () => useAuthStore.getState().clear(NOTICES.emailConfirmed),
    })
}