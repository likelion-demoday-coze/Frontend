// 데일리 퀴즈(정규장) 도메인 타입 - 백엔드 Swagger 스키마 기준

// 정규장에서 선택 가능한 8개 카테고리
export type QuizCategory =
  | 'MACRO_ECONOMY'
  | 'FINANCIAL_MARKET'
  | 'STOCK_INVESTMENT'
  | 'INTEREST_BOND'
  | 'EXCHANGE_GLOBAL_ECONOMY'
  | 'REAL_ESTATE'
  | 'CORPORATE_FINANCE'
  | 'LIVING_ECONOMY';

// IN_PROGRESS: 원 풀이 중 / ORIGINAL_COMPLETED: 5문제 완료, 재풀이 대기
// COMPLETED: 재풀이까지 끝남 / EXPIRED: 당일 23:59:59 지나 만료
export type QuizSessionStatus =
  'IN_PROGRESS' | 'ORIGINAL_COMPLETED' | 'COMPLETED' | 'EXPIRED';

// ORIGINAL: 처음 풀이(주가 반영) / RETRY: 오답 재풀이(주가 미반영)
export type AttemptType = 'ORIGINAL' | 'RETRY';

export interface QuizOption {
  optionId: number;
  optionNumber: number;
  content: string;
}

export interface QuizQuestion {
  sessionQuestionId: number;
  questionId: number;
  questionType: string;
  content: string;
  originalAnswered: boolean;
  originalCorrect: boolean;
  retryAnswered: boolean;
  options: QuizOption[];
}

// 세션 공통 정보 (생성, 진행 중 세션 조회 응답)
export interface QuizSessionSummary {
  sessionId: number;
  category: QuizCategory;
  status: QuizSessionStatus;
  startedAt: string;
  expiresAt: string;
  passApplied: boolean;
}

export interface ActiveQuizSession extends QuizSessionSummary {
  answeredCount: number;
  totalQuestionCount: number;
}

export interface QuizSessionDetail extends ActiveQuizSession {
  questions: QuizQuestion[];
}

export interface CreateSessionRequest {
  category: QuizCategory;
}

export interface SubmitAnswerRequest {
  selectedOptionId: number;
  attemptType: AttemptType;
}

interface AnswerResultBase {
  sessionQuestionId: number;
  selectedOptionId: number;
  correct: boolean;
  correctOptionId: number;
  explanation: string;
  sessionStatus: QuizSessionStatus;
}

// 처음 풀이 제출 결과
export interface OriginalAnswerResult extends AnswerResultBase {
  stockIncreasePercent: number;
  currentStock: number;
  answeredCount: number;
  totalQuestionCount: number;
}

// 오답 재풀이 제출 결과
export interface RetryAnswerResult extends AnswerResultBase {
  retryCompletedCount: number;
  retryRequiredCount: number;
}

export interface QuizResultQuestion {
  sessionQuestionId: number;
  questionId: number;
  content: string;
  selectedOptionId: number;
  correctOptionId: number;
  correctOptionContent: string;
  correct: boolean;
  explanation: string;
  retryAnswered: boolean;
  retryCorrect: boolean;
  stockIncreasePercent: number;
  stockAfter: number;
}

export interface QuizResult {
  sessionId: number;
  category: QuizCategory;
  status: QuizSessionStatus;
  correctCount: number;
  incorrectCount: number;
  retryCompletedCount: number;
  startStock: number;
  endStock: number;
  totalProfit: number;
  totalReturnPercent: number;
  currentStreak: number;
  questions: QuizResultQuestion[];
}
