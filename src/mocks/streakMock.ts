import type {
  StreakData,
  StreakDayStatus,
  StreakEffectData,
  StreakView,
} from '../types/streak';

// 미리보기 선택창에 표시할 6가지 상황
export const STREAK_SCENARIOS: {
  value: StreakView;
  label: string;
}[] = [
  { value: 'learning', label: '오늘 학습 전' },
  { value: 'broken', label: '끊김 · 복구 가능' },
  { value: 'restorePending', label: '복구 대기' },
  { value: 'completed', label: '정규장 완료' },
  { value: 'restarted', label: '새로 시작 · 복구 가능' },
  { value: 'expired', label: '복구 대기 기한 만료' },
];

const LABELS = ['월', '화', '수', '목', '금', '토', '일'];

//헤더 숫자 확인용
const CURRENT_DAYS: Record<StreakView, number> = {
  learning: 7,
  broken: 0,
  recoveryUnavailable: 0,
  restorePending: 7,
  completed: 8,
  restarted: 1,
  expired: 0,
};

// 디자인 확인을 위해 금요일을 오늘로 가정한 주간 기록
// 배열 순서: 월, 화, 수, 목, 금, 토, 일
//
// 실제 서비스에서는 날짜별 서버 기록으로 교체해야 해.
// currentStreak만으로 아래 기록을 정확히 만들 수는 없어.
const WEEK_STATUSES: Record<StreakView, StreakDayStatus[]> = {
  learning: [
    'completed',
    'completed',
    'completed',
    'completed',
    'todayIncomplete',
    'incomplete',
    'incomplete',
  ],

  broken: [
    'completed',
    'completed',
    'completed',
    'pending',
    'todayIncomplete',
    'incomplete',
    'incomplete',
  ],

  recoveryUnavailable: [
    'completed',
    'completed',
    'completed',
    'pending',
    'todayIncomplete',
    'incomplete',
    'incomplete',
  ],

  restorePending: [
    'completed',
    'completed',
    'completed',
    'pending',
    'todayIncomplete',
    'incomplete',
    'incomplete',
  ],

  completed: [
    'completed',
    'completed',
    'completed',
    'restored',
    'todayCompleted',
    'incomplete',
    'incomplete',
  ],

  restarted: [
    'completed',
    'completed',
    'completed',
    'pending',
    'todayCompleted',
    'incomplete',
    'incomplete',
  ],

  expired: [
    'completed',
    'completed',
    'incomplete',
    'incomplete',
    'todayIncomplete',
    'incomplete',
    'incomplete',
  ],
};

// 이펙트 기준과 이름은 디자인 확인용 예시
// 실제 기준은 기획 또는 서버 명세 확인 후 교체해야 해.
const EFFECT_STEPS = [
  { id: 'effect-3', requiredDays: 3, name: '동전' },
  { id: 'effect-7', requiredDays: 7, name: '은화' },
  { id: 'effect-14', requiredDays: 14, name: '금화' },
  { id: 'effect-21', requiredDays: 21, name: '시크릿' },
];

// 선택한 화면 상태에 맞는 mock 데이터를 만들어 반환해.
// 서버 요청을 하거나 사용자 정보를 저장하지 않아.
export const getMockStreak = (view: StreakView): StreakData => {
  const currentDays = CURRENT_DAYS[view];

  // 디자인상 기존 이펙트가 일시정지되는 상황
  const paused =
    view === 'broken' || view === 'recoveryUnavailable' || view === 'restorePending' || view === 'restarted';

  // 일시정지 화면에서는 끊기기 전 기록을 7일로 가정해.
  // 실제 서비스에서 이 값을 7로 고정하면 안 돼.
  const effectDays = paused ? 7 : currentDays;

  // 아직 달성하지 않은 첫 번째 단계 = 다음 목표
  const nextStep = EFFECT_STEPS.find((step) => step.requiredDays > effectDays);

  // 달성한 단계 중 가장 높은 단계 = 진행 구간 시작
  // 원본 배열을 바꾸지 않도록 복사 후 reverse를 사용해.
  const previousStep = [...EFFECT_STEPS]
    .reverse()
    .find((step) => step.requiredDays <= effectDays);

  // 각 단계의 표시 상태 계산
  const effects: StreakEffectData[] = EFFECT_STEPS.map((step) => {
    if (step.requiredDays <= effectDays) {
      // 달성한 단계는 적용 중 또는 일시정지로 표시
      return {
        ...step,
        status: paused ? 'paused' : 'active',
      };
    }

    // 미달성 단계 중 다음 목표만 주황 점선으로 표시하고,
    // 그 이후 단계들은 잠금 상태로 표시해.
    return {
      ...step,
      status: step.id === nextStep?.id ? 'upcoming' : 'locked',
    };
  });

  return {
    view,
    currentDays,

    // 디자인 확인용 최고 기록
    // 실제 값을 모르면 null로 전달해야 해.
    bestDays: 12,

    // 요일 이름과 표시 상태를 합쳐 StreakWeek에 전달할 배열 생성
    days: WEEK_STATUSES[view].map((status, index) => ({
      id: `preview-day-${index}`,
      label: LABELS[index],
      status,
    })),

    effects,

    progress: {
      // 첫 단계도 달성하지 않았다면 0일부터 시작
      from: previousStep?.requiredDays ?? 0,

      // 모든 단계를 달성했다면 마지막 기준값 사용
      to: nextStep?.requiredDays ?? 21,

      current: effectDays,
      nextName: nextStep?.name ?? '',
    },

    // 다음 목표가 없다면 남은 일수는 0
    remainingDays: nextStep ? nextStep.requiredDays - effectDays : 0,
  };
};
