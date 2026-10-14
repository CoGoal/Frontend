import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { api } from './client'

export const profileKey = ['profile']
export const accountKey = ['account']
export const profilePending = (error) => error?.problem?.code === 'PROFILE_PENDING'

export function useProfile(enabled = true) {
  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))
  return useQuery({
    queryKey: profileKey,
    queryFn: ({ signal }) => api('/users/me', { signal }),
    enabled: enabled && hasSession,
    retry: false,
    refetchInterval: (query) => profilePending(query.state.error) ? 2000 : false,
  })
}
export function useAccount() {
  return useQuery({ queryKey: accountKey, queryFn: ({ signal }) => api('/auth/me', { signal }) })
}
function useAuthMutation(path) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body) => api(path, { method: 'POST', body, auth: false }),
    onSuccess: async (data) => {
      await client.cancelQueries()
      client.removeQueries()
      client.setQueryData(accountKey, data.user)
      useAuthStore.getState().startSession(data)
    },
  })
}
export const useLogin = () => useAuthMutation('/auth/login')
export const useRegister = () => useAuthMutation('/auth/register')
export function useForgotPassword() {
  return useMutation({ mutationFn: (email) => api('/auth/password/forgot', {
    method: 'POST', body: { email }, auth: false,
  }) })
}
export function useResetPassword() {
  return useMutation({
    mutationFn: (body) => api('/auth/password/reset', { method: 'POST', body, auth: false }),
    onSuccess: () => useAuthStore.getState().clear('Пароль изменён. Войдите с новым паролем.'),
  })
}
export function useConfirmEmail() {
  return useMutation({
    mutationFn: (token) => api('/auth/email/confirm', { method: 'POST', body: { token }, auth: false }),
    onSuccess: () => useAuthStore.getState().clear('Email подтверждён. Войдите снова.'),
  })
}
export function useUpdateProfile() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body) => api('/users/me', { method: 'PATCH', body }),
    onSuccess: (profile) => client.setQueryData(profileKey, profile),
  })
}
export function useChangeUsername() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (username) => api('/auth/me/username', { method: 'PATCH', body: { username } }),
    onSuccess: (account) => {
      client.setQueryData(accountKey, account)
      client.invalidateQueries({ queryKey: profileKey })
    },
  })
}
export function useChangePassword() {
  return useMutation({
    mutationFn: (body) => api('/auth/change-password', { method: 'POST', body }),
    onSuccess: () => useAuthStore.getState().clear('Пароль изменён. Войдите с новым паролем.'),
  })
}
export function useEmailChange() {
  return useMutation({ mutationFn: (body) => api('/users/me/email-change', { method: 'POST', body }) })
}
export function useLogout() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (all = false) => api(all ? '/auth/logout-all' : '/auth/logout', {
      method: 'POST',
      body: all ? undefined : () => ({ refreshToken: useAuthStore.getState().refreshToken }),
    }),
    onSuccess: async () => {
      useAuthStore.getState().clear()
      await client.cancelQueries()
      client.removeQueries()
    },
  })
}
