export const RECOVERY_STATUS_CHANGED = 'streak-recovery-status-changed';

interface RecoverySnapshot {
  stockBefore: number;
  requestedBeforeLearning: boolean;
}

const key = (memberId: number, eventId: number) =>
  `streak-recovery:${memberId}:${eventId}`;

const seenCompletions = new Set<string>();

export const rememberRecoverySnapshot = (
  memberId: number,
  eventId: number,
  snapshot: RecoverySnapshot
) => {
  try {
    sessionStorage.setItem(
      `${key(memberId, eventId)}:snapshot`,
      JSON.stringify(snapshot)
    );
  } catch {
    /* 저장 불가 시 복구 전 주가는 생략 */
  }
};

export const readRecoverySnapshot = (
  memberId: number,
  eventId: number
): RecoverySnapshot | null => {
  try {
    const raw = sessionStorage.getItem(`${key(memberId, eventId)}:snapshot`);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return Number.isFinite(value.stockBefore) &&
      typeof value.requestedBeforeLearning === 'boolean'
      ? value
      : null;
  } catch {
    return null;
  }
};

export const isRecoveryCompletionSeen = (memberId: number, eventId: number) => {
  const storageKey = `${key(memberId, eventId)}:seen`;
  if (seenCompletions.has(storageKey)) return true;
  let stored = false;
  try {
    stored = localStorage.getItem(storageKey) === 'true';
  } catch {
    /* 영구 저장소 사용 불가 시 기존 탭 기록 확인 */
  }
  if (!stored) {
    try {
      stored = sessionStorage.getItem(storageKey) === 'true';
    } catch {
      /* 저장소 사용 불가 시 메모리 기록만 사용 */
    }
  }
  // 기존 탭에 남은 확인 기록도 영구 저장소로 이전
  if (stored) markRecoveryCompletionSeen(memberId, eventId);
  return stored;
};

export const markRecoveryCompletionSeen = (
  memberId: number,
  eventId: number
) => {
  const storageKey = `${key(memberId, eventId)}:seen`;
  seenCompletions.add(storageKey);
  try {
    localStorage.setItem(storageKey, 'true');
  } catch {
    /* 영구 저장소 사용 불가 시 탭 기록으로 유지 */
  }
  try {
    sessionStorage.setItem(storageKey, 'true');
  } catch {
    /* 메모리에서도 확인 여부를 유지 */
  }
};
