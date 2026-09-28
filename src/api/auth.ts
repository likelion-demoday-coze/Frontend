import api, { clearCsrfToken, fetchCsrfToken } from './axiosInstance';

const baseURL = import.meta.env.VITE_API_URL;

// 백엔드 공통 응답 구조 작성필요
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T; // 실제 데이터는 여기에 들어감
}

//내 정보 조회
export interface CsrfResult {
  paramterName: string;
  token: string;
  haderName: string; //이게 뭐지
}

export interface SignupRequest {
  nickname: string;
}

export interface SignupResult {
  memberId: number;
  nickname: string;
}

export interface NicknameRequest {
  nickname: string;
}

export interface NicknameResult {
  available: boolean;
}
//카카오 로그인 -> 브라우저 직접 이동
export const startKaKaoLogin = () => {
  window.location.href = `${baseURL}/api/v1/auth/oauth2/authorization/kakao`;
};

//회원가입
export const signup = async (payload: SignupRequest) => {
  const { data } = await api.post<ApiResponse<SignupResult>>(
    '/api/v1/auth/signup',
    payload
  );
  return data.result;
};

//닉네임 사용 가능 여부 확인
export const checkNickname = async (payload: NicknameRequest) => {
  const { data } = await api.post<ApiResponse<NicknameResult>>(
    '/api/v1/members/nickname-availability',
    payload
  );
  return data.result;
};

//로그아웃(응답본문 없고, 헤더만 보는듯)
export const logout = async () => {
  await api.post('/api/v1/auth/logout');

  clearCsrfToken();
  await fetchCsrfToken();
};
