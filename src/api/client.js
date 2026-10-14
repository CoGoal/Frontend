import { useAuthStore } from '../store/authStore'
import { createApiClient } from './transport.js'

export const api = createApiClient(useAuthStore)
