import { useQuery } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { queryKeys } from '../../../shared/api/queryKeys'
import type { AuthUser } from '../../../entities/session/model/types'

export function useAccount() {
    return useQuery({
        queryKey: queryKeys.account,
        queryFn: ({ signal }) => api<AuthUser>(ENDPOINTS.account, { signal }),
    })
}