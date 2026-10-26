import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimAttendanceReword } from '../api/attendance';
import { PASS_SALES_END_AT } from '../constants/pass';
import { ROUTES } from '../constants/routes';

export interface FishShortAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface UseFishShortActionParams {
  canClaimAttendance: boolean;
  onClaimed: (balance: number) => void;
}

//생선이 부족할 때 출석 보상 → 패스 구매 → 비활성 순으로 안내
const useFishShortAction = ({
  canClaimAttendance,
  onClaimed,
}: UseFishShortActionParams) => {
  const navigate = useNavigate();
  const [isPassOnSale] = useState(
    () => Date.now() < PASS_SALES_END_AT.getTime()
  );
  const [isClaiming, setIsClaiming] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | null>(null);

  const claim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      const result = await claimAttendanceReword();
      onClaimed(result.balance);
      if (result.newlyClaimed) setRewardAmount(result.grantedAmount);
    } catch (error) {
      console.error('출석 보상 수령 실패', error);
      alert('FISH를 받지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsClaiming(false);
    }
  };

  const action: FishShortAction = canClaimAttendance
    ? { label: '출석 FISH 받기', onClick: claim, disabled: isClaiming }
    : isPassOnSale
      ? {
          label: '패스 보러가기',
          onClick: () => navigate(ROUTES.SHOP),
          disabled: false,
        }
      : { label: '투자 시작하기', onClick: () => {}, disabled: true };

  return {
    action,
    rewardAmount,
    closeReward: () => setRewardAmount(null),
  };
};

export default useFishShortAction;
