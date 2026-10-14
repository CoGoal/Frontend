import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist((set) => ({
  accessToken: null, refreshToken: null, sessionId: 0, notice: '',
  startSession: ({ accessToken, refreshToken }) => set((state) => ({
    accessToken, refreshToken, notice: '', sessionId: state.sessionId + 1,
  })),
  setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
  clear: (notice = '') => set((state) => ({
    accessToken: null, refreshToken: null, notice, sessionId: state.sessionId + 1,
  })),
}), {
  name: 'cogoal-auth',
  partialize: ({ accessToken, refreshToken }) => ({ accessToken, refreshToken }),
}))
