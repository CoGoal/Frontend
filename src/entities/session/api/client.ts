import { useAuthStore } from '../model/authStore'
import { createApiClient } from '../../../shared/api/transport'

export const api = createApiClient(useAuthStore)