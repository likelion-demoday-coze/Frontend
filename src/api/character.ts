import api, { fetchCsrfToken, hasCsrfToken } from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { MyCharacter } from '../types/character';
import type { CharacterEvolution } from '../utils/characterEvolution';

// 내 캐릭터 상태 조회
export const getMyCharacter = async (options?: {
  timeout?: number;
  suppressNetworkAlert?: boolean;
}) => {
  const { data } = await api.get<ApiResponse<MyCharacter>>(
    '/api/v1/characters/me',
    options
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 표시한 진화 단계만 확인하며 캐릭터와 주가는 변경하지 않음
export const confirmCharacterEvolution = async (
  stage: CharacterEvolution['stage']
) => {
  if (!hasCsrfToken()) await fetchCsrfToken();
  const { data } = await api.patch<ApiResponse<null>>(
    '/api/v1/characters/me/evolution',
    { stage },
    { timeout: 15000, suppressNetworkAlert: true }
  );
  if (!data.isSuccess) throw new Error(data.message);
};
