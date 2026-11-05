import { useMutation } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) => api<void>(ENDPOINTS.forgotPassword, {
            method: 'POST', body: { email }, auth: false,
        }),
    })
}