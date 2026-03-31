import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setLogin: () => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,

  setLogin: () => set({ isLoggedIn: true }),
  setLogout: () => set({ isLoggedIn: false }),
}));
