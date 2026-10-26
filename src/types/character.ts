// 내 캐릭터 상태 조회 응답
export interface MyCharacter {
  date: string;
  currentStock: number;
  stage: string;
  stageName: string;
  nextStage: string | null;
  nextStageStock: number | null;
  stockToNextStage: number | null;
  currentStreak: number;
  effects: string[];
  nextEffect: string | null;
  daysToNextEffect: number | null;
}
