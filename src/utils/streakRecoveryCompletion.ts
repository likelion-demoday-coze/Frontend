export const RECOVERY_STATUS_CHANGED = 'streak-recovery-status-changed';

interface RecoverySnapshot {
  stockBefore: number;
  requestedBeforeLearning: boolean;
}

const key = (memberId: number, eventId: number) =>
  `streak-recovery:${memberId}:${eventId}`;

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
  try {
    return sessionStorage.getItem(`${key(memberId, eventId)}:seen`) === 'true';
  } catch {
    return false;
  }
};

export const markRecoveryCompletionSeen = (
  memberId: number,
  eventId: number
) => {
  try {
    sessionStorage.setItem(`${key(memberId, eventId)}:seen`, 'true');
  } catch {
    /* 메모리에서도 확인 여부를 유지 */
  }
};
