import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isPreview =
    import.meta.env.DEV && searchParams.get('recoveryComplete') === '1';
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [completion, setCompletion] = useState<{
    recovery: StreakRecovery;
    streak: MyStreak;
  } | null>(null);
  const seen = useRef(new Set<string>());
  const acknowledged = useRef(new Set<string>());
  const checkKey = `${memberId}:${pathname}:${isPreview}`;
  const [checkedKey, setCheckedKey] = useState<string | null>(null);
  useBlockRankingReward(
    isPreview ||
      completion !== null ||
      (memberId !== undefined && checkedKey !== checkKey)
  );

  useEffect(() => {
    if (memberId === undefined || isPreview) return;
    let active = true;
    let running = false;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      if (!active || running) return;
      running = true;
      clearTimeout(timer);
      let retryDelay: number | null = null;
      try {
        const recovery = await getStreakRecovery();
        if (!active || !recovery) return;
        if (recovery.status === 'PENDING') {
          retryDelay = 10000;
          return;
        }
        const key = `${memberId}:${recovery.eventId}`;
        if (
          recovery.status !== 'RECOVERED' ||
          seen.current.has(key) ||
          isRecoveryCompletionSeen(memberId, recovery.eventId)
        )
          return;
        const streak = await getMyStreak();
        if (active && streak) setCompletion({ recovery, streak });
      } catch {
        retryDelay = 30000;
      } finally {
        running = false;
        if (active) {
          if (retryDelay !== null) {
            // 복구 대기·오류 재시도가 남아 있으면 랭킹 보상은 계속 대기
            setCheckedKey(null);
            timer = setTimeout(check, retryDelay);
          } else {
            setCheckedKey(checkKey);
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
  }, [pathname, memberId, isPreview, checkKey]);

  if (isPreview) {
    const statuses: StreakDayStatus[] = [
      'completed',
      'restored',
      'todayCompleted',
      'incomplete',
      'incomplete',
      'incomplete',
      'incomplete',
    ];
    return (
      <StreakRecoveryCompleteModal
        streakDays={8}
        days={['월', '화', '수', '목', '금', '토', '일'].map(
          (label, index) => ({
            id: `example-${index}`,
            label,
            status: statuses[index],
          })
        )}
        restoredDate="2026-10-27"
        stockBefore={115}
        stockAfter={142.15}
        requestedBeforeLearning={false}
        onShown={() => {}}
        onClose={() =>
          setSearchParams(
            (previous) => {
              const next = new URLSearchParams(previous);
              next.delete('recoveryComplete');
              return next;
            },
            { replace: true }
          )
        }
      />
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
