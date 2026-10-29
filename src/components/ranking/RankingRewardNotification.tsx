import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFishBalance } from '../../api/fish';
import {
  getUnreadRankingRewards,
  markRankingRewardRead,
} from '../../api/ranking';
import { ROUTES } from '../../constants/routes';
import { useCanShowRankingReward } from '../../hooks/useRankingRewardGate';
import useAuthstore from '../../stores/useAuthStore';
import type { RankingReward } from '../../types/ranking';
import RankingRewardModal from './RankingRewardModal';

interface RankingRewardNotificationProps {
  onBalanceChange: (balance: number) => void;
}

const RankingRewardNotification = ({
  onBalanceChange,
}: RankingRewardNotificationProps) => {
  const navigate = useNavigate();
  const canShowReward = useCanShowRankingReward();
  const memberId = useAuthstore((state) => state.member?.memberId);
  const [rewards, setRewards] = useState<RankingReward[]>([]);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const acknowledgingRef = useRef(false);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'error' | 'done'>(
    'loading'
  );
  const [retryCount, setRetryCount] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (memberId === undefined) return;
    let active = true;
    loadingRef.current = true;
    getUnreadRankingRewards()
      .then(async (unread) => {
        if (!active) return;
        setRewards(
          unread
            .filter(
              (reward) =>
                (reward.rankingType === 'STOCK' ||
                  reward.rankingType === 'TIME_ATTACK') &&
                [1, 2, 3].includes(reward.rankingPosition)
            )
            .sort((a, b) => {
              const dateOrder = a.rankingDate.localeCompare(b.rankingDate);
              if (dateOrder !== 0) return dateOrder;
              return (
                Number(a.rankingType === 'TIME_ATTACK') -
                Number(b.rankingType === 'TIME_ATTACK')
              );
            })
        );
        setLoadStatus('done');
        if (unread.length === 0) return;
        try {
          const balance = await getFishBalance();
          if (active) onBalanceChange(balance);
        } catch (error) {
          console.error('랭킹 보상 지급 후 잔액 조회 실패', error);
        }
      })
      .catch((error) => {
        console.error('미확인 랭킹 보상 조회 실패', error);
        if (active) setLoadStatus('error');
      })
      .finally(() => {
        if (active) loadingRef.current = false;
      });
    return () => {
      active = false;
    };
  }, [memberId, onBalanceChange, retryCount]);

  const reward = rewards[0];
  if (!canShowReward) return null;
  if (!reward) {
    if (loadStatus === 'done' || (loadStatus === 'loading' && retryCount === 0))
      return null;
    return (
      <div
        role={loadStatus === 'error' ? 'alert' : 'status'}
        className="mx-auto mt-4 flex w-full max-w-260 flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-20 bg-gray-05 px-4 py-3 text-sm text-gray-60"
      >
        <p>
          {loadStatus === 'error'
            ? '랭킹 보상을 불러오지 못했어요.'
            : '랭킹 보상을 다시 확인하고 있어요.'}
        </p>
        <button
          type="button"
          disabled={loadStatus === 'loading'}
          onClick={() => {
            if (loadingRef.current) return;
            loadingRef.current = true;
            setLoadStatus('loading');
            setRetryCount((value) => value + 1);
          }}
          className="cursor-pointer font-semibold text-blue-60 disabled:cursor-wait disabled:opacity-50"
        >
          {loadStatus === 'loading' ? '확인 중…' : '다시 확인'}
        </button>
      </div>
    );
  }
  const type = reward.rankingType === 'STOCK' ? 'regular' : 'afterhours';

  const acknowledge = async (viewRanking: boolean) => {
    if (acknowledgingRef.current) return;
    acknowledgingRef.current = true;
    setIsAcknowledging(true);
    setErrorMessage('');
    try {
      await markRankingRewardRead(reward.rankingRewardId);
      if (useAuthstore.getState().member?.memberId !== memberId) return;
      setRewards((previous) =>
        previous.filter(
          (item) => item.rankingRewardId !== reward.rankingRewardId
        )
      );
      if (viewRanking) navigate(`${ROUTES.RANKING}?tab=${type}`);
    } catch {
      setErrorMessage('보상 확인을 저장하지 못했어요. 다시 눌러 주세요.');
    } finally {
      acknowledgingRef.current = false;
      setIsAcknowledging(false);
    }
  };

  return (
    <RankingRewardModal
      key={reward.rankingRewardId}
      type={type}
      rank={reward.rankingPosition as 1 | 2 | 3}
      rankingDate={reward.rankingDate}
      grantedAmount={reward.rewardFishAmount}
      score={
        (type === 'regular'
          ? reward.stockClosingValue
          : reward.timeAttackCorrectCount) ?? 0
      }
      balanceBefore={reward.fishBalanceBefore}
      balanceAfter={reward.fishBalanceAfter}
      isAcknowledging={isAcknowledging}
      errorMessage={errorMessage}
      onClose={() => {
        void acknowledge(false);
      }}
      onViewRanking={() => {
        void acknowledge(true);
      }}
    />
  );
};

export default RankingRewardNotification;
