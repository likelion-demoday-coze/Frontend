// 카드 전체의 화면 상태
export type StreakView =
  | 'learning' // 연속학습 유지 중, 오늘은 아직 학습 전
  | 'broken' // 연속학습 끊김, 복구 신청 가능
  | 'recoveryUnavailable' // 하락 기록은 있지만 현재 복구 신청 불가
  | 'restorePending' // 복구 신청 완료, 정규장 학습을 기다리는 중
  | 'completed' // 오늘 정규장 학습 완료
  | 'restarted' // 끊긴 뒤 오늘 학습부터 새로 시작, 이전 기록 복구 가능
  | 'expired'; // 복구 신청 후 학습 기한이 지난 상황

// 월~일 각각의 원 안에 어떤 표시를 할지 결정하는 상태
export type StreakDayStatus =
  | 'completed' // 지난 날짜의 학습 완료: 주황 배경 + 발바닥
  | 'incomplete' // 학습 미완료 또는 미래 날짜: 빈 원
  | 'todayCompleted' // 오늘 학습 완료: 연한 주황 배경 + 주황 발바닥
  | 'todayIncomplete' // 오늘 학습 전: 주황 점선 원
  | 'restored' // 복구한 날짜: 복구 아이콘
  | 'pending'; // 복구 필요 또는 복구 대기 날짜: 회색 점선 원

// 요일 하나를 표시하는 데 필요한 데이터
export interface StreakDayData {
  id: string; // React의 key로 사용할 고유 값
  label: string; // 화면에 표시할 요일
  status: StreakDayStatus; // 아이콘 결정
}

// 이펙트 단계 카드의 표시 상태
export type EffectStatus =
  | 'active' // 달성해서 적용 중
  | 'upcoming' // 다음에 달성할 단계
  | 'locked' // 아직 달성하지 못한 이후 단계
  | 'paused'; // 달성했지만 연속학습 중단으로 일시정지

// 이펙트 카드 한 칸에 필요한 데이터
export interface StreakEffectData {
  id: string;
  requiredDays: number; // 해당 단계를 달성하는 데 필요한 연속학습 일수
  name: string; // 이펙트 이름
  status: EffectStatus;
}

// StreakCard에 전달하는 전체 화면 데이터
// API 응답을 받으면 별도의 변환 과정으로 이 모양에 맞춰 전달하면 돼.
export interface StreakData {
  view: StreakView;
  currentDays: number; // 헤더에 표시할 현재 연속학습 일수
  bestDays: number | null; // 최고 기록, 알 수 없으면 null로 전달
  days: StreakDayData[]; // 월~일 표시용 데이터 7개
  effects: StreakEffectData[];

  // 진행 바는 직전 달성 단계부터 다음 단계까지의 구간을 표시해.
  // 예: 7일 단계 달성 → 14일 단계 목표 → 현재 8일
  progress: {
    from: number; // 구간 시작: 7
    to: number; // 구간 끝: 14
    current: number; // 현재 위치: 8
    nextName: string; // 다음 이펙트 이름
  };

  remainingDays: number; // 다음 이펙트까지 남은 학습 일수
}
