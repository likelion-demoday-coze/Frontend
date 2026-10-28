// 타임어택(시간외거래) 도메인 타입 - 백엔드 Swagger 스키마 기준
import type { QuizOption } from './quiz';

export interface TimeAttackToday {
  dailyAttemptLimit: number;
  usedAttemptCount: number;
  remainingAttemptCount: number;
}

export interface TimeAttackSession {
  sessionId: number;
  status: string;
  startedAt: string;
  endsAt: string;
  passApplied: boolean;
}

export interface TimeAttackQuestion {
  sessionId: number;
  endsAt: string;
  correctCount: number;
  consecutiveCorrectCount: number;
  question: {
    questionId: number;
    questionType: string;
    content: string;
    options: QuizOption[];
  };
}

export interface TimeAttackAnswerResult {
  questionId: number;
  selectedOptionId: number;
  correctOptionId: number;
  correct: boolean;
  correctCount: number;
  consecutiveCorrectCount: number;
}

export interface TimeAttackComplete {
  sessionId: number;
  status: string;
  totalAnsweredCount: number;
  correctCount: number;
  incorrectCount: number;
  maxConsecutiveCorrectCount: number;
}

export interface TimeAttackResultQuestion {
  questionId: number;
  content: string;
  selectedOptionId: number;
  selectedOptionContent: string;
  correctOptionId: number;
  correctOptionContent: string;
  correct: boolean;
  explanation: string;
}

export interface TimeAttackResult extends TimeAttackComplete {
  attemptDate: string;
  startedAt: string;
  endsAt: string;
  questions: TimeAttackResultQuestion[];
}
