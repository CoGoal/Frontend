import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from 	'../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { queryKeys } from '../../../shared/api/queryKeys'
import type { AuthUser } from '../../../entities/session/model/types'

export function useChangeUsername() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: (username: string) =>
        api<AuthUser>(ENDPOINTS.username, { method: 'PATCH', body: { username } }),
        onSuccess: (account) => {
        client.setQueryData(queryKeys.account, account)
        client.invalidateQueries({ queryKey: queryKeys.profile })
        },
    })
}