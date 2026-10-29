// 맛보기 퀴즈 도메인 타입 - 백엔드 Swagger 스키마 기준
import type { QuizOption } from './quiz';

export interface PreviewQuizQuestion {
  questionId: number;
  questionType: string;
  content: string;
  options: QuizOption[];
}

export interface PreviewQuizAnswerResult {
  questionId: number;
  selectedOptionId: number;
  correctOptionId: number;
  correctOptionContent: string;
  correct: boolean;
  explanation: string;
}
