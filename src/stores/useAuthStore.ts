import { create } from 'zustand';
import type { getMeResult } from '../api/auth';

interface AuthState {
  member: getMeResult | null;
  isInitialized: boolean;

  setMember: (member: getMeResult) => void;
  clearAuth: () => void;
  setInitialized: () => void;
}

const useAuthstore = create<AuthState>()((set) => ({
  member: null,
  isInitialized: false,

  setMember: (member) => set({ member }),

  clearAuth: () => set({ member: null }),

  setInitialized: () => set({ isInitialized: true }),
}));

export default useAuthstore;
