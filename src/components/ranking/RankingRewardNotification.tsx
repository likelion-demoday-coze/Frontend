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

  useEffect(() => {
    if (memberId === undefined) return;
    let active = true;
    getUnreadRankingRewards()
      .then(async (unread) => {
        if (!active) return;
        setRewards(
          unread.filter(
            (reward) =>
              (reward.rankingType === 'STOCK' ||
                reward.rankingType === 'TIME_ATTACK') &&
              [1, 2, 3].includes(reward.rankingPosition)
          )
        );
        if (unread.length === 0) return;
        const balance = await getFishBalance();
        if (active) onBalanceChange(balance);
      })
      .catch((error) => {
        console.error('미확인 랭킹 보상 조회 실패', error);
      });
    return () => {
      active = false;
    };
  }, [memberId, onBalanceChange]);

  const reward = rewards[0];
  if (!reward || !canShowReward) return null;
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
