// 마이페이지 도메인 타입 - 백엔드 Swagger 스키마 기준

export type CharacterStage = 'BEGINNER' | 'BIG_HAND' | 'NOBLE';

export interface MyPage {
  profile: {
    memberId: number;
    nickname: string;
    joinedDays: number;
    characterStage: CharacterStage;
    passActive: boolean;
    passExpiresAt: string | null;
  };
  assets: {
    fishBalance: number;
    recoveryTicketCount: number;
    currentStock: number;
  };
  records: {
    currentStreak: number;
    highestStreak: number;
    highestStock: number;
    highestTimeAttackCorrectCount: number;
    totalAnsweredCount: number;
    totalCorrectCount: number;
    accuracyPercent: number;
  };
}
