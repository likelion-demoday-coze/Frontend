// 내 캐릭터 상태 조회 응답
export interface MyCharacter {
  date: string;
  currentStock: number;
  stage: CharacterStage;
  stageName: string;
  nextStage: CharacterStage | null;
  nextStageStock: number | null;
  stockToNextStage: number | null;
  currentStreak: number;
  effects: string[];
  nextEffect: string | null;
  daysToNextEffect: number | null;
  correctAnswersToNextStage: number | null;
  pendingEvolutionStage: CharacterStage | null;
}
import type { CharacterStage } from './member';
