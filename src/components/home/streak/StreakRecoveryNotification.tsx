import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFishBalance } from '../../../api/fish';
import { getAttendanceToday } from '../../../api/attendance';
import { getOwnedItems, getStoreItems } from '../../../api/store';
import {
  acknowledgeStreakPenaltyNotification,
  getMyStreak,
  getStreakPenaltyNotification,
  getStreakRecovery,
} from '../../../api/streak';
import { ROUTES } from '../../../constants/routes';
import basicCat from '../../../assets/character/basic_1.svg';
import bigHandCat from '../../../assets/character/basic_2.svg';
import nobleCat from '../../../assets/character/basic_3.svg';
import type { StreakDayStatus } from '../../../types/streak';
import StreakRecoveryModal from './StreakRecoveryModal';
import { useStreakRecoveryAction } from '../../../hooks/useStreakRecoveryAction';

// 백엔드와 공통인 상품 코드로 복구권을 구분
const RECOVERY_CODE = 'STREAK_RECOVERY';
const loadNotification = async () => {
  const notification = await getStreakPenaltyNotification();
  if (!notification) return null;
  const [recovery, streak, fishBalance, owned, items, attendance] =
    await Promise.all([
      getStreakRecovery(),
      getMyStreak(),
      getFishBalance(),
      getOwnedItems(),
      getStoreItems(),
      getAttendanceToday(),
    ]);
  // 조회 사이 새로운 하락이 발생했다면 서로 다른 이벤트를 섞지 않음
  if (!recovery || recovery.eventId !== notification.eventId)
    throw new Error('복구 정보가 변경됐어요. 새로고침 후 다시 확인해 주세요.');
  if (recovery.status === 'RECOVERED') return null;
  const item = items.find((entry) => entry.itemCode === RECOVERY_CODE);
  const ownedCount =
    owned.find((entry) => entry.itemCode === RECOVERY_CODE)?.quantity ?? 0;
  const hasPass = attendance.status === 'PASS_ACTIVE';
  if (
    !item &&
    recovery.status === 'AVAILABLE' &&
    !hasPass &&
    ownedCount === 0
  ) {
    throw new Error('판매 중인 복구권 정보를 찾지 못했어요.');
  }
  return {
    notification,
    recovery,
    streak,
    fishBalance,
    item,
    ownedCount,
    hasPass,
  };
};

const getStage = (stock: number) =>
  stock >= 10000
    ? { image: nobleCat, name: '귀족냥', threshold: 10000 }
    : stock >= 1000
      ? { image: bigHandCat, name: '큰손냥', threshold: 1000 }
      : { image: basicCat, name: '초보냥', threshold: 0 };

const StreakRecoveryNotification = () => {
  const navigate = useNavigate();
  const [state, setState] =
    useState<Awaited<ReturnType<typeof loadNotification>>>(null);
  const [error, setError] = useState('');
  const recoveryAction = useStreakRecoveryAction(() => setState(null));
  const acknowledged = useRef(new Set<number>());

  useEffect(() => {
    let active = true;
    loadNotification()
      .then((result) => {
        if (active) setState(result);
      })
      .catch((error: unknown) => {
        if (active)
          setError(
            error instanceof Error
              ? error.message
              : '복구 알림을 불러오지 못했어요.'
          );
      });
    return () => {
      active = false;
    };
  }, []);

  const onShown = () => {
    if (!state || acknowledged.current.has(state.notification.eventId)) return;
    const eventId = state.notification.eventId;
    acknowledged.current.add(eventId);
    acknowledgeStreakPenaltyNotification(eventId).catch(() => {
      acknowledged.current.delete(eventId);
      setError(
        '하락 알림 확인 처리에 실패했어요. 다음 접속 때 다시 표시될 수 있어요.'
      );
    });
  };

  if (recoveryAction.modal) return recoveryAction.modal;

  if (!state)
    return error ? (
      <p role="alert" className="mt-3 text-sm text-red-55">
        {error}
      </p>
    ) : null;
  const before = getStage(state.notification.stockBeforePenalty);
  const after = getStage(state.notification.stockAfterPenalty);
  return (
    <StreakRecoveryModal
      data={{
        stockBefore: state.notification.stockBeforePenalty,
        stockAfter: state.notification.stockAfterPenalty,
        expired: state.recovery.status === 'EXPIRED',
        recoveryStatus: state.recovery.status,
        hasPass: state.hasPass,
        ownedTickets: state.ownedCount,
        fishBalance: state.fishBalance,
        ticketPrice: state.item?.fishPrice ?? 0,
        deadlineLabel: state.recovery.expiresAt
          ? `${new Date(state.recovery.expiresAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}까지`
          : '-',
        days: state.streak.days.map((day) => {
          let status: StreakDayStatus = day.today
            ? day.status === 'COMPLETED'
              ? 'todayCompleted'
              : 'todayIncomplete'
            : !day.future && day.status === 'COMPLETED'
              ? 'completed'
              : 'incomplete';
          if (day.date === state.recovery.missedDate && !day.today) {
            if (state.recovery.status === 'RECOVERED') status = 'restored';
            else if (state.recovery.status !== 'EXPIRED') status = 'pending';
          }
          return {
            id: day.date,
            label: ['일', '월', '화', '수', '목', '금', '토'][
              new Date(`${day.date}T00:00:00Z`).getUTCDay()
            ],
            status,
          };
        }),
        stageDrop:
          before.threshold > after.threshold
            ? {
                beforeImage: before.image,
                beforeName: before.name,
                afterImage: after.image,
                afterName: after.name,
                description: `주가가 ${before.threshold.toLocaleString()} 아래로 떨어졌어요.${state.recovery.status === 'EXPIRED' ? '' : ` 복구하면 ${before.name}으로 돌아와요.`}`,
              }
            : undefined,
      }}
      onShown={onShown}
      errorMessage={error}
      isSubmitting={recoveryAction.isSubmitting}
      onClose={() => setState(null)}
      onRestore={() => {
        void recoveryAction.start(state.notification.eventId);
      }}
      onShop={() => navigate(ROUTES.SHOP)}
      onQuiz={() => navigate(ROUTES.QUIZ)}
    />
  );
};

export default StreakRecoveryNotification;
