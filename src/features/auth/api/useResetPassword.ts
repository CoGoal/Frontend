import { useMutation } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { NOTICES } from '../../../shared/config/texts'
import { useAuthStore } from '../../../entities/session/model/authStore'

export interface ResetPasswordBody {
    token: string
    newPassword: string
}

export function useResetPassword() {
    return useMutation({
        mutationFn: (body: ResetPasswordBody) =>
        api<void>(ENDPOINTS.resetPassword, { method: 'POST', body, auth: false }),
        onSuccess: () => useAuthStore.getState().clear(NOTICES.passwordChanged),
    })
}