// 화면 상태 3가지 (시안: 오늘 학습 전 / 정규장 완료 후 / 복구 대기)
export type StreakViewState = 'before' | 'done' | 'recovery';

// 요일 동그라미 모양
// done: 채워진 발바닥 / today: 오늘(아직 안 함) / todayDone: 오늘 완료(테두리 강조)
// recovery: 복구 대기 중인 날(?) / empty: 아직 안 온 날
export type DayStatus = 'done' | 'today' | 'todayDone' | 'recovery' | 'empty';

export interface StreakDay {
  label: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  status: DayStatus;
}

// 효과 경로 카드 모양
// reached: 받음(✓) / paused: 일시 중지 / next: 다음 목표 / locked: 아직 잠김(?)
export type StageStatus = 'reached' | 'paused' | 'next' | 'locked';

export interface EffectStage {
  days: number; // 3, 7, 14, 21
  name: string; // 받침, 오라, 후광, 시크릿
  status: StageStatus;
}

export interface StreakSummary {
  state: StreakViewState;
  currentStreak: number; // 현재 연속 학습일
  bestStreak: number; // 최고 기록
  days: StreakDay[]; // 이번 주 7일
  stages: EffectStage[]; // 효과 경로 4단계
}
