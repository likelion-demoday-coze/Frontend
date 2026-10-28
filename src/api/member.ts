import api from './axiosInstance';
import type { getMeResult } from './auth';
import type { ApiResponse } from '../types/api';
import type { MyPage } from '../types/member';

//마이페이지 프로필·보유 자산·학습 기록 조회
export const getMyPage = async () => {
  const { data } = await api.get<ApiResponse<MyPage>>(
    '/api/v1/members/me/mypage'
  );
  return data.result;
};

//닉네임 변경 (변경된 회원 정보 반환)
export const updateNickname = async (nickname: string) => {
  const { data } = await api.patch<ApiResponse<getMeResult>>(
    '/api/v1/members/me/nickname',
    { nickname }
  );
  return data.result;
};
