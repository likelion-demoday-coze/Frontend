import api, { clearCsrfToken, fetchCsrfToken } from './axiosInstance';
import type { ApiResponse } from '../types/api';

const baseURL = import.meta.env.VITE_API_URL;

//내 정보 조회
export interface CsrfResult {
  headerName: string; //이게 뭐지
  token: string;
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

//내 정보 조회
export interface getMeResult {
  memberId: number;
  nickname: string;
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
  const { data } = await api.get<ApiResponse<NicknameResult>>(
    '/api/v1/members/nickname-availability',
    { params: payload }
  );
  return data.result;
};

//내 정보 조회
export const getMe = async () => {
  const { data } =
    await api.get<ApiResponse<getMeResult>>('/api/v1/members/me');
  return data.result;
};

//로그아웃(응답본문 없고, 헤더만 보는듯)
export const logout = async () => {
  await api.post('/api/v1/auth/logout');

  clearCsrfToken();
  await fetchCsrfToken();
};
