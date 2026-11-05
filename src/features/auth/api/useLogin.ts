import { ENDPOINTS } from '../../../shared/api/endpoints'
import { useSessionMutation } from './useSessionMutation'

export interface LoginBody {
    login: string
    password: string
}

export const useLogin = () => useSessionMutation<LoginBody>(ENDPOINTS.login)