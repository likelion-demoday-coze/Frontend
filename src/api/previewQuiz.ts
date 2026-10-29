import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type {
  PreviewQuizAnswerResult,
  PreviewQuizQuestion,
} from '../types/previewQuiz';

const BASE = '/api/v1/preview-quizzes';

//맛보기 문제 3개 조회 (비로그인 가능, 정답·해설 없음)
export const getPreviewQuizzes = async () => {
  const { data } = await api.get<ApiResponse<PreviewQuizQuestion[]>>(BASE);
  return data.result;
};

//답안 제출 (서버에 저장되지 않고 주가·기록에도 반영 안 됨)
export const submitPreviewQuizAnswer = async (
  questionId: number,
  selectedOptionId: number
) => {
  const { data } = await api.post<ApiResponse<PreviewQuizAnswerResult>>(
    `${BASE}/${questionId}/answers`,
    { selectedOptionId }
  );
  return data.result;
};
