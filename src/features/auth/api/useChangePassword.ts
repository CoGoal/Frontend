import { useMutation } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { NOTICES } from '../../../shared/config/texts'
import { useAuthStore } from '../../../entities/session/model/authStore'

export interface ChangePasswordBody {
    currentPassword: string
    newPassword: string
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (body: ChangePasswordBody) =>
        api<void>(ENDPOINTS.changePassword, { method: 'POST', body }),
        onSuccess: () => useAuthStore.getState().clear(NOTICES.passwordChanged),
    })
}