import { create } from 'zustand'
import { User } from "shared-types"
import { log } from 'console'
import { DateISO } from "shared-types"


interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  sessionExpiry: DateISO | null

  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  isSessionExpired: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,

  setUser: (user) => {
    console.log('Setting user:', user)
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    set({
      user,
      isAuthenticated: true,
      sessionExpiry: expiresAt,
      error: null,
    })
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      sessionExpiry: null,
      error: null,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  isSessionExpired: () => {
    const expiry = get().sessionExpiry
    if (!expiry) return true
    return new Date() > new Date(expiry)
  },
}))
