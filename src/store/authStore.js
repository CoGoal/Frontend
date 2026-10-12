//хранилище токенов
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,

      //сохранить токены из ответа AuthResponse
      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        })),

      //удалить токены
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: 'cogoal-auth' },
  ),
)