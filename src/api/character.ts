import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { MyCharacter } from '../types/character';

// 내 캐릭터 상태 조회
export const getMyCharacter = async () => {
  const { data } = await api.get<ApiResponse<MyCharacter>>(
    '/api/v1/characters/me'
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};
