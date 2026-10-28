import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type {
  TimeAttackAnswerResult,
  TimeAttackComplete,
  TimeAttackQuestion,
  TimeAttackResult,
  TimeAttackSession,
  TimeAttackToday,
} from '../types/timeAttack';

const BASE = '/api/v1/time-attacks';

//오늘의 시간외거래 참여 가능 횟수 조회
export const getTimeAttackToday = async () => {
  const { data } = await api.get<ApiResponse<TimeAttackToday>>(`${BASE}/today`);
  return data.result;
};

//시간외거래 세션 시작 (참여 횟수 1회 차감, 패스 회원은 생선 차감 없음)
export const createTimeAttackSession = async () => {
  const { data } = await api.post<ApiResponse<TimeAttackSession>>(
    `${BASE}/sessions`
  );
  return data.result;
};

//다음 문제 조회
export const getNextTimeAttackQuestion = async (sessionId: number) => {
  const { data } = await api.get<ApiResponse<TimeAttackQuestion>>(
    `${BASE}/sessions/${sessionId}/questions/next`
  );
  return data.result;
};

//답안 제출
export const submitTimeAttackAnswer = async (
  sessionId: number,
  questionId: number,
  selectedOptionId: number
) => {
  const { data } = await api.post<ApiResponse<TimeAttackAnswerResult>>(
    `${BASE}/sessions/${sessionId}/answers`,
    { questionId, selectedOptionId }
  );
  return data.result;
};

//제한 시간이 끝난 세션 완료 처리
export const completeTimeAttackSession = async (sessionId: number) => {
  const { data } = await api.post<ApiResponse<TimeAttackComplete>>(
    `${BASE}/sessions/${sessionId}/complete`
  );
  return data.result;
};

//결과 조회 (총정리)
export const getTimeAttackResult = async (sessionId: number) => {
  const { data } = await api.get<ApiResponse<TimeAttackResult>>(
    `${BASE}/sessions/${sessionId}/result`
  );
  return data.result;
};
