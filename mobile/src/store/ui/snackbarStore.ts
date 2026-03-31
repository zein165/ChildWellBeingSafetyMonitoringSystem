import { create } from 'zustand';

interface SnackbarState {
  visible: boolean;
  message: string;
  timeout: number;

  showSnackbar: (message: string, timeout?: number) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>(set => ({
  visible: false,
  message: '',
  timeout: 4000,

  showSnackbar: (message: string, timeout: number = 4000) =>
    set({ visible: true, message, timeout }),
  hideSnackbar: () => set({ visible: false }),
}));
