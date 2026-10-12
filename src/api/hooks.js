import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { api } from './client'

export const profileKey = ['profile']

//профиль текущего пользователя: GET /users/me
export function useProfile() {
  const hasSession = useAuthStore((s) => Boolean(s.accessToken || s.refreshToken))

  return useQuery({
    queryKey: profileKey,
    queryFn: () => api('/users/me'),
    enabled: hasSession,
  })
}

//общая часть входа и регистрации: сохранить токены и положить профиль в кэш
function useAuthMutation(path) {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((s) => s.setTokens)

  return useMutation({
    mutationFn: (body) => api(path, { method: 'POST', body, auth: false }),
    onSuccess: (data) => {
      setTokens(data)
      queryClient.setQueryData(profileKey, data.user)
    },
  })
}

export const useLogin = () => useAuthMutation('/auth/login')
export const useRegister = () => useAuthMutation('/auth/register')

// POST/auth/password/forgot — отправить письмо со ссылкой
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) =>
      api('/auth/password/forgot', { method: 'POST', body: { email }, auth: false }),
  })
}

// POST/auth/password/reset — установить новый пароль по токену из письма
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }) =>
      api('/auth/password/reset', { method: 'POST', body: { token, newPassword }, auth: false }),
  })
}

// удаляем токены и очищаем весь кэш запросов
export function useLogout() {
  const queryClient = useQueryClient()
  const clear = useAuthStore((s) => s.clear)

  return () => {
    clear()
    queryClient.clear()
  }
}