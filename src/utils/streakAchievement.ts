import type { MyStreak } from '../api/streak';
import type { MyCharacter } from '../types/character';

export const STREAK_EFFECT_STEPS = [
  { days: 3, name: '동전' },
  { days: 7, name: '은화' },
  { days: 14, name: '금화' },
  { days: 21, name: '금은보화' },
] as const;

export interface StreakAchievementStart {
  date: string;
  currentStreak: number;
  learnedToday: boolean;
  lastLearningDate: string | null;
  effects: string[] | null;
  recoveryPending: boolean;
}

export interface StreakAchievement {
  kind: 'completed' | 'restarted' | 'effect';
  streak: MyStreak;
  newEffect: (typeof STREAK_EFFECT_STEPS)[number] | null;
}

const starts = new Map<string, StreakAchievementStart>();
const shown = new Set<string>();
const startKey = (memberId: number, sessionId: number) =>
  `streak-achievement:start:${memberId}:${sessionId}`;

export const readStreakAchievementStart = (
  memberId: number,
  sessionId: number
) => {
  const key = startKey(memberId, sessionId);
  if (starts.has(key)) return starts.get(key)!;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const value: StreakAchievementStart = JSON.parse(raw);
    if (
      typeof value.date !== 'string' ||
      !Number.isFinite(value.currentStreak) ||
      typeof value.learnedToday !== 'boolean' ||
      !(
        value.lastLearningDate === null ||
        typeof value.lastLearningDate === 'string'
      ) ||
      !(
        value.effects === null ||
        (Array.isArray(value.effects) &&
          value.effects.every((effect) => typeof effect === 'string'))
      ) ||
      typeof value.recoveryPending !== 'boolean'
    )
      return null;
    starts.set(key, value);
    return value;
  } catch {
    return null;
  }
};

export const rememberStreakAchievementStart = (
  memberId: number,
  sessionId: number,
  snapshot: StreakAchievementStart
) => {
  // 이어 풀기·새로고침 후에도 최초 입장 시점의 상태를 유지
  if (readStreakAchievementStart(memberId, sessionId)) return;
  const key = startKey(memberId, sessionId);
  starts.set(key, snapshot);
  try {
    sessionStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // 저장할 수 없어도 같은 화면에서는 메모리로 유지
  }
};

// 늦게 도착한 캐릭터 정보는 입장 시점과 일치할 때 효과 목록만 보완
export const rememberStreakAchievementEffects = (
  memberId: number,
  sessionId: number,
  character: MyCharacter
) => {
  const before = readStreakAchievementStart(memberId, sessionId);
  if (
    !before ||
    before.effects !== null ||
    before.date !== character.date ||
    before.currentStreak !== character.currentStreak
  )
    return;
  const snapshot = { ...before, effects: character.effects };
  const key = startKey(memberId, sessionId);
  starts.set(key, snapshot);
  try {
    sessionStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // 저장할 수 없어도 현재 화면의 비교에는 메모리 사용
  }
};

export const getStreakAchievement = (
  before: StreakAchievementStart,
  after: MyStreak,
  character: MyCharacter | null
): StreakAchievement | null => {
  if (
    before.recoveryPending ||
    !after.learnedToday ||
    after.currentStreak < 1 ||
    (before.date === after.date && before.learnedToday) ||
    before.lastLearningDate === after.date
  )
    return null;

  const step = STREAK_EFFECT_STEPS.find(
    (effect) => effect.days === after.currentStreak
  );
  const hasNewEffect =
    before.effects !== null &&
    character !== null &&
    character.date === after.date &&
    character.currentStreak === after.currentStreak &&
    character.effects.some((effect) => !before.effects!.includes(effect));
  const newEffect =
    step && hasNewEffect && before.currentStreak < after.currentStreak
      ? step
      : null;
  const restarted =
    after.currentStreak === 1 && before.lastLearningDate !== null;
  return {
    kind: newEffect ? 'effect' : restarted ? 'restarted' : 'completed',
    streak: after,
    newEffect,
  };
};

export const claimStreakAchievement = (memberId: number, date: string) => {
  const key = `streak-achievement:shown:${memberId}:${date}`;
  if (shown.has(key)) return false;
  try {
    if (localStorage.getItem(key) === 'true') return false;
    localStorage.setItem(key, 'true');
  } catch {
    // 저장할 수 없어도 같은 탭에서는 중복 표시 방지
  }
  shown.add(key);
  return true;
};
