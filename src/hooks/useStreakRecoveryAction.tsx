import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { getCurrentPass } from '../api/pass';
import { getMyCharacter } from '../api/character';
import { getFishBalance } from '../api/fish';
import { getOwnedItems, getStoreItems, purchaseItem } from '../api/store';
import {
  getMyStreak,
  getStreakRecovery,
  requestStreakRecovery,
} from '../api/streak';
import type { StreakRecovery } from '../api/streak';
import useAuthstore from '../stores/useAuthStore';
import { RECOVERY_STATUS_CHANGED, rememberRecoverySnapshot } from '../utils/streakRecoveryCompletion';
import { ROUTES } from '../constants/routes';
import StreakRecoveryActionModal from '../components/home/streak/StreakRecoveryActionModal';
import type { RecoveryActionData } from '../components/home/streak/StreakRecoveryActionModal';

interface RecoverySession {
  eventId: number;
  requestedBeforeLearning: boolean;
  itemId: number | null;
  purchased: boolean;
  requestId: string;
  data: RecoveryActionData;
}

type Phase = 'loading' | 'confirm' | 'started' | 'completed' | 'error';

export const useStreakRecoveryAction = (onDismiss?: () => void) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase | null>(null);
  const [data, setData] = useState<RecoveryActionData | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useRef<RecoverySession | null>(null);
  const eventIdRef = useRef<number | null>(null);
  const lock = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const showResult = (recovery: StreakRecovery) => {
    window.dispatchEvent(new Event(RECOVERY_STATUS_CHANGED));
    if (recovery.status === 'RECOVERED') {
      setPhase(null);
      onDismiss?.();
    } else setPhase('started');
  };

  const apply = async (current: RecoverySession) => {
    const latest = await getStreakRecovery();
    if (!mounted.current) return;
    if (
      !latest ||
      latest.eventId !== current.eventId ||
      latest.status === 'EXPIRED'
    ) {
      throw new Error(
        '복구 가능 상태가 변경됐어요. 새로고침 후 다시 확인해 주세요.'
      );
    }
    if (latest.status === 'PENDING' || latest.status === 'RECOVERED') {
      current.data = {
        ...current.data,
        ownedAfter: latest.quantityAfterRequest,
        deadline: latest.expiresAt,
      };
      setData(current.data);
      showResult(latest);
      return;
    }
    const character = await getMyCharacter().catch(() => null);
    if (!mounted.current) return;
    const memberId = useAuthstore.getState().member?.memberId;
    if (character && memberId !== undefined) {
      rememberRecoverySnapshot(memberId, current.eventId, {
        stockBefore: character.currentStock,
        requestedBeforeLearning: current.requestedBeforeLearning,
      });
    }
    if (current.data.method === 'fish' && !current.purchased) {
      if (current.itemId === null)
        throw new Error('판매 중인 복구권 정보를 찾지 못했어요.');
      const purchase = await purchaseItem(current.itemId, 1, current.requestId);
      if (!purchase || purchase.quantityAfter < 1)
        throw new Error('복구권 구매 결과를 확인하지 못했어요.');
      current.purchased = true;
      current.data = { ...current.data, fishAfter: purchase.balanceAfter };
      if (!mounted.current) return;
      setData(current.data);
    }
    if (!mounted.current) return;
    const result = await requestStreakRecovery(current.eventId);
    if (!mounted.current) return;
    current.data = {
      ...current.data,
      ownedAfter: result.quantityAfterRequest,
      deadline: result.expiresAt,
    };
    setData(current.data);
    if (result.status !== 'PENDING' && result.status !== 'RECOVERED')
      throw new Error('복구가 완료되지 않았어요. 복구 상태를 확인해 주세요.');
    showResult(result);
  };

  const fail = (error: unknown) => {
    if (!mounted.current) return;
    setError(
      isAxiosError(error)
        ? (error.response?.data?.message ?? '복구 처리에 실패했어요.')
        : error instanceof Error
          ? error.message
          : '복구 처리에 실패했어요.'
    );
    setPhase('error');
  };

  const start = async (eventId: number) => {
    if (lock.current) return;
    lock.current = true;
    eventIdRef.current = eventId;
    session.current = null;
    setData(null);
    setError('');
    setPhase('loading');
    setIsSubmitting(true);
    try {
      const [recovery, streak, pass, fish, owned, items] = await Promise.all([
        getStreakRecovery(),
        getMyStreak(),
        getCurrentPass(),
        getFishBalance(),
        getOwnedItems(),
        getStoreItems(),
      ]);
      if (!mounted.current) return;
      if (
        !recovery ||
        recovery.eventId !== eventId ||
        recovery.status !== 'AVAILABLE'
      )
        throw new Error(
          '복구 가능 상태가 변경됐어요. 새로고침 후 다시 확인해 주세요.'
        );
      const count =
        owned.find((item) => item.itemCode === 'STREAK_RECOVERY')?.quantity ??
        0;
      const item = items.find((item) => item.itemCode === 'STREAK_RECOVERY');
      const hasPass =
        pass.active &&
        pass.pass?.status === 'ACTIVE' &&
        Date.parse(pass.pass.expiresAt) > Date.now();
      const method = hasPass ? 'pass' : count > 0 ? 'ticket' : 'fish';
      if (method === 'fish' && !item)
        throw new Error('판매 중인 복구권 정보를 찾지 못했어요.');
      if (method === 'fish' && fish < item!.fishPrice)
        throw new Error('FISH가 부족해요. 상점에서 보유 수량을 확인해 주세요.');
      const current: RecoverySession = {
        eventId,
        requestedBeforeLearning: !streak.learnedToday,
        itemId: item?.itemId ?? null,
        purchased: false,
        requestId: crypto.randomUUID(),
        data: {
          method,
          learnedToday: streak.learnedToday,
          ownedBefore: count,
          ownedAfter: null,
          fishBefore: fish,
          fishAfter: null,
          price: item?.fishPrice ?? 0,
          deadline: recovery.expiresAt,
        },
      };
      session.current = current;
      setData(current.data);
      if (streak.learnedToday || method === 'fish' || method === 'ticket') setPhase('confirm');
      else await apply(current);
    } catch (error) {
      fail(error);
    } finally {
      lock.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  };

  const confirm = async () => {
    if (!session.current) {
      if (eventIdRef.current !== null) await start(eventIdRef.current);
      return;
    }
    if (lock.current) return;
    lock.current = true;
    setIsSubmitting(true);
    setError('');
    try {
      await apply(session.current);
    } catch (error) {
      fail(error);
    } finally {
      lock.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  };

  const close = () => {
    if (lock.current) return;
    if (phase === 'started' || phase === 'completed') window.location.reload();
    else {
      setPhase(null);
      onDismiss?.();
    }
  };

  const modal = phase ? (
    <StreakRecoveryActionModal
      phase={phase}
      data={data}
      error={error}
      isSubmitting={isSubmitting}
      onClose={close}
      onConfirm={confirm}
      onQuiz={() => navigate(ROUTES.QUIZ)}
    />
  ) : null;

  return { start, modal, isSubmitting };
};
