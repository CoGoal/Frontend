import { useMutation } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'

export interface EmailChangeBody {
    newEmail: string
    password: string
}

export function useEmailChange() {
    return useMutation({
        mutationFn: (body: EmailChangeBody) =>
        api<void>(ENDPOINTS.emailChange, { method: 'POST', body }),
    })
}