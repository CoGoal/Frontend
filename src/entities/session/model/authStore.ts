import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tokens } from '../../../shared/api/types'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  sessionId: number
  notice: string
  startSession: (tokens: Tokens) => void
  setTokens: (tokens: Tokens) => void
  clear: (notice?: string) => void
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
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