import { create } from 'zustand';
import type { User, AuthState } from '@/src/types';
import { mockUser } from '@/src/constants/mockData';

interface AuthStore extends AuthState {
  setAuthenticated: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,

  setAuthenticated: (user, token) =>
    set({ isAuthenticated: true, user, token, isLoading: false }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  logout: () =>
    set({ isAuthenticated: false, user: null, token: null, isLoading: false }),

  setLoading: (loading) => set({ isLoading: loading }),
}));

export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.user);
}
