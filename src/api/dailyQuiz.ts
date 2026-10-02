import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type {
  ActiveQuizSession,
  CreateSessionRequest,
  OriginalAnswerResult,
  QuizCategory,
  QuizResult,
  QuizSessionDetail,
  QuizSessionSummary,
  RetryAnswerResult,
} from '../types/quiz';

const BASE = '/api/v1/daily-quizzes';

//카테고리 목록 조회
export const getCategories = async () => {
  const { data } = await api.get<ApiResponse<{ category: QuizCategory }[]>>(
    `${BASE}/categories`
  );
  return data.result.map((item) => item.category);
};

//정규장 세션 생성 (생선 차감, 패스 회원은 무료)
export const createSession = async (payload: CreateSessionRequest) => {
  const { data } = await api.post<ApiResponse<QuizSessionSummary>>(
    `${BASE}/sessions`,
    payload
  );
  return data.result;
};

//진행 중인 세션 조회 (이어 풀기용)
//TODO: 진행 중 세션이 없을 때 null인지 에러 응답인지 백엔드 확인 필요
export const getActiveSession = async () => {
  const { data } = await api.get<ApiResponse<ActiveQuizSession | null>>(
    `${BASE}/sessions/active`
  );
  return data.result;
};

//세션 상세 조회 (문제, 보기, 풀이 여부)
export const getSessionDetail = async (sessionId: number) => {
  const { data } = await api.get<ApiResponse<QuizSessionDetail>>(
    `${BASE}/sessions/${sessionId}`
  );
  return data.result;
};

//처음 풀이 답안 제출 (주가 반영)
export const submitAnswer = async (
  sessionId: number,
  sessionQuestionId: number,
  selectedOptionId: number
) => {
  const { data } = await api.post<ApiResponse<OriginalAnswerResult>>(
    `${BASE}/sessions/${sessionId}/questions/${sessionQuestionId}/answers`,
    { selectedOptionId, attemptType: 'ORIGINAL' }
  );
  return data.result;
};

//오답 재풀이 답안 제출 (주가 미반영)
export const submitRetryAnswer = async (
  sessionId: number,
  sessionQuestionId: number,
  selectedOptionId: number
) => {
  const { data } = await api.post<ApiResponse<RetryAnswerResult>>(
    `${BASE}/sessions/${sessionId}/questions/${sessionQuestionId}/answers`,
    { selectedOptionId, attemptType: 'RETRY' }
  );
  return data.result;
};

//오답 재풀이 건너뛰고 세션 완료
export const completeSession = async (sessionId: number) => {
  const { data } = await api.post<ApiResponse<QuizResult>>(
    `${BASE}/sessions/${sessionId}/complete`
  );
  return data.result;
};

//결과 조회 (정산 화면)
export const getSessionResult = async (sessionId: number) => {
  const { data } = await api.get<ApiResponse<QuizResult>>(
    `${BASE}/sessions/${sessionId}/result`
  );
  return data.result;
};
