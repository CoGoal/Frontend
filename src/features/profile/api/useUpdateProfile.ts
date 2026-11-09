import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../entities/session/api/client'
import { ENDPOINTS } from '../../../shared/api/endpoints'
import { queryKeys } from '../../../shared/api/queryKeys'
import type { Profile, UpdateProfileBody } from '../model/types'

export function useUpdateProfile() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: (body: UpdateProfileBody) =>
        api<Profile>(ENDPOINTS.profile, { method: 'PATCH', body }),
        onSuccess: (profile) => client.setQueryData(queryKeys.profile, profile),
    })
}