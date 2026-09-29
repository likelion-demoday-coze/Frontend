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
  isInitialized: true, // 임시: getMe 붙이기 전까지 /mypage는 항상 /login으로 리다이렉트됨

  setMember: (member) => set({ member }),
  clearAuth: () => set({ member: null }),
  setInitialized: () => set({ isInitialized: true }),
}));

export default useAuthstore;
