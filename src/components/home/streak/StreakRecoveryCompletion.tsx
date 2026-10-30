import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  acknowledgeStreakPenaltyNotification,
  getMyStreak,
  getStreakRecovery,
} from '../../../api/streak';
import type { MyStreak, StreakRecovery } from '../../../api/streak';
import type { StreakDayStatus } from '../../../types/streak';
import useAuthstore from '../../../stores/useAuthStore';
import { useBlockRankingReward } from '../../../hooks/useRankingRewardGate';
import {
  RECOVERY_STATUS_CHANGED,
  isRecoveryCompletionSeen,
  markRecoveryCompletionSeen,
  readRecoverySnapshot,
} from '../../../utils/streakRecoveryCompletion';
import StreakRecoveryCompleteModal from './StreakRecoveryCompleteModal';

const StreakRecoveryCompletion = () => {
  const { pathname } = useLocation();
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [completion, setCompletion] = useState<{
    recovery: StreakRecovery;
    streak: MyStreak;
  } | null>(null);
  const seen = useRef(new Set<string>());
  const acknowledged = useRef(new Set<string>());
  const checkKey = `${memberId}:${pathname}`;
  const [checkedKey, setCheckedKey] = useState<string | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const [skippedKey, setSkippedKey] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  useBlockRankingReward(
    completion !== null ||
      (memberId !== undefined && checkedKey !== checkKey)
  );

  useEffect(() => {
    if (memberId === undefined || skippedKey === checkKey) return;
    let active = true;
    let running = false;
    let consecutiveErrors = 0;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      if (!active || running || consecutiveErrors >= 3) return;
      running = true;
      clearTimeout(timer);
      let retryDelay: number | null = null;
      try {
        const recovery = await getStreakRecovery();
        if (!active || !recovery) return;
        if (recovery.status === 'PENDING') {
          consecutiveErrors = 0;
          retryDelay = 10000;
          return;
        }
        const key = `${memberId}:${recovery.eventId}`;
        if (
          recovery.status !== 'RECOVERED' ||
          seen.current.has(key) ||
          isRecoveryCompletionSeen(memberId, recovery.eventId)
        ) {
          consecutiveErrors = 0;
          return;
        }
        const streak = await getMyStreak();
        consecutiveErrors = 0;
        if (active && streak) setCompletion({ recovery, streak });
      } catch {
        consecutiveErrors += 1;
        if (consecutiveErrors < 3) retryDelay = 30000;
        else if (active) setFailedKey(checkKey);
      } finally {
        running = false;
        if (active) {
          if (retryDelay !== null) {
            // 복구 대기·오류 재시도가 남아 있으면 랭킹 보상은 계속 대기
            setCheckedKey(null);
            timer = setTimeout(check, retryDelay);
          } else if (consecutiveErrors < 3) {
            setCheckedKey(checkKey);
          } else {
            setCheckedKey(null);
          }
        }
      }
    };
    const checkVisible = () => {
      if (document.visibilityState === 'visible') void check();
    };
    void check();
    window.addEventListener(RECOVERY_STATUS_CHANGED, checkVisible);
    window.addEventListener('focus', checkVisible);
    document.addEventListener('visibilitychange', checkVisible);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener(RECOVERY_STATUS_CHANGED, checkVisible);
      window.removeEventListener('focus', checkVisible);
      document.removeEventListener('visibilitychange', checkVisible);
    };
  }, [pathname, memberId, checkKey, skippedKey, retryCount]);

  if (failedKey === checkKey && skippedKey !== checkKey) {
    return (
      <div
        role="alert"
        className="m-6 rounded-xl border border-gray-20 bg-white p-4 text-sm text-gray-60"
      >
        <p>연속학습 복구 상태를 확인하지 못했어요.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            className="text-blue-60 underline"
            onClick={() => {
              setFailedKey(null);
              setRetryCount((count) => count + 1);
            }}
          >
            다시 확인
          </button>
          <button
            type="button"
            className="text-blue-60 underline"
            onClick={() => {
              // 현재 화면에서는 복구 조회를 멈춰 보상 팝업 이후의 끼어들기를 방지
              setSkippedKey(checkKey);
              setCheckedKey(checkKey);
            }}
          >
            보상 먼저 확인
          </button>
        </div>
        <p className="mt-2">
          보상을 먼저 확인하면 복구 상태는 다음 화면 이동 시 다시 확인해요.
        </p>
      </div>
    );
  }

  if (!completion || memberId === undefined) return null;
  const { recovery, streak } = completion;
  const key = `${memberId}:${recovery.eventId}`;
  const snapshot = readRecoverySnapshot(memberId, recovery.eventId);
  const days = streak.days.map((day) => {
    const status: StreakDayStatus =
      day.date === recovery.missedDate
        ? 'restored'
        : day.today
          ? day.status === 'COMPLETED'
            ? 'todayCompleted'
            : 'todayIncomplete'
          : !day.future && day.status === 'COMPLETED'
            ? 'completed'
            : 'incomplete';
    return {
      id: day.date,
      label: ['일', '월', '화', '수', '목', '금', '토'][
        new Date(`${day.date}T00:00:00Z`).getUTCDay()
      ],
      status,
    };
  });

  return (
    <StreakRecoveryCompleteModal
      key={key}
      streakDays={recovery.streakAfterRecovery ?? streak.currentStreak}
      days={days}
      restoredDate={recovery.missedDate}
      stockBefore={snapshot?.stockBefore ?? null}
      stockAfter={recovery.stockAfterRecovery}
      requestedBeforeLearning={snapshot?.requestedBeforeLearning ?? false}
      onShown={() => {
        if (acknowledged.current.has(key)) return;
        acknowledged.current.add(key);
        acknowledgeStreakPenaltyNotification(recovery.eventId).catch(() => {
          acknowledged.current.delete(key);
        });
      }}
      onClose={() => {
        seen.current.add(key);
        markRecoveryCompletionSeen(memberId, recovery.eventId);
        setCompletion(null);
        window.location.reload();
      }}
    />
  );
};

export default StreakRecoveryCompletion;
