import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types/user';
import { getUserByRole } from '../data/mockUsers';

interface AuthStore extends AuthState {
  login: (role: User['role']) => void;
  logout: () => void;
  switchUser: (role: User['role']) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (role: User['role']) => {
        set({ isLoading: true });
        
        setTimeout(() => {
          const user = getUserByRole(role);
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({ isLoading: false });
          }
        }, 500);
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      },
      
      switchUser: (role: User['role']) => {
        const user = getUserByRole(role);
        if (user) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);