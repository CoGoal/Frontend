import { ENDPOINTS } from '../../../shared/api/endpoints'
import { useSessionMutation } from './useSessionMutation'

export interface RegisterBody {
    email: string
    username: string
    name: string
    password: string
}

export const useRegister = () => useSessionMutation<RegisterBody>(ENDPOINTS.register)