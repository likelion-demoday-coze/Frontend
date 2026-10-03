export interface QuizAttempt {
  used: number;
  limit: number;
}

export interface QuizEntryStatus {
  fishBalance: number;
  isPass: boolean;
  dailyAttempt: QuizAttempt;
  timeAttackAttempt: QuizAttempt;
}

//TODO: API 연동 전 임시값
const MOCK_STATUS: QuizEntryStatus = {
  fishBalance: 300,
  isPass: false,
  dailyAttempt: { used: 0, limit: 2 },
  timeAttackAttempt: { used: 0, limit: 3 },
};

const useQuizEntryStatus = (): QuizEntryStatus => {
  return MOCK_STATUS;
};

export default useQuizEntryStatus;
