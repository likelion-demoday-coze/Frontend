import { create } from 'zustand';

interface Member {
  memberId: number;
  nickname: string;
}

interface AuthState {
  member: Member | null;
  isInitialized: boolean;

  setMember: (member: Member) => void;
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
