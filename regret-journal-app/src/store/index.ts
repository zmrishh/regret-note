import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

// User Store
interface UserState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const response = await authService.login({ email, password });
          set({
            user: response.data,
            token: response.token,
            isAuthenticated: true
          });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },
      
      logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      register: async (userData) => {
        try {
          const response = await authService.register(userData);
          set({
            user: response.data,
            token: response.token,
            isAuthenticated: true
          });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Confession Store
interface ConfessionState {
  confessions: any[];
  nearbyConfessions: any[];
  loading: boolean;
  error: string | null;
  fetchConfessions: (params?: any) => Promise<void>;
  fetchNearbyConfessions: (longitude: number, latitude: number) => Promise<void>;
}

export const useConfessionStore = create<ConfessionState>()((set) => ({
  confessions: [],
  nearbyConfessions: [],
  loading: false,
  error: null,

  fetchConfessions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // Implement confession fetching logic
      // This would use the confessionService from api.ts
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  fetchNearbyConfessions: async (longitude, latitude) => {
    set({ loading: true, error: null });
    try {
      // Implement nearby confession fetching logic
      // This would use the confessionService from api.ts
      set({ loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  }
}));
