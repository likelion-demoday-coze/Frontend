import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../common/Card';
import { getCharacterStage } from '../../../constants/character';
import { getStandingCharacterImage } from '../../../utils/character';
import bronzeBackground from '../../../assets/character/background/bronze_bg.svg';
import silverBackground from '../../../assets/character/background/silver_bg.svg';
import goldBackground from '../../../assets/character/background/gold_bg.svg';
import diamondBackground from '../../../assets/character/background/diamond_bg.svg';
import { getMyCharacter } from '../../../api/character';
import type { MyCharacter } from '../../../types/character';
import type { AttendanceStatus } from '../../../types/attendance';
import {
  claimAttendanceReword,
  getAttendanceToday,
} from '../../../api/attendance';
import { ROUTES } from '../../../constants/routes';
import DailyRewardModal from './DailyRewardModal';
import fishImage from '../../../assets/store/Fish_a.svg';

type ViewStatus = AttendanceStatus | 'loading' | 'error';

const DailyRewardCard = ({
  onBalanceChange,
}: {
  onBalanceChange: (balance: number) => void;
}) => {
  const navigate = useNavigate();
  //오늘의 보상 수령 상태 (조회 전에는 로딩중)
  const [status, setStatus] = useState<ViewStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number | null>(null);

  const [retryCount, setRetryCount] = useState(0);
  const [character, setCharacter] = useState<MyCharacter | null>(null);
  const [characterError, setCharacterError] = useState(false);

  useEffect(() => {
    let ignore = false;
    getMyCharacter()
      .then((result) => {
        if (!ignore) setCharacter(result);
      })
      .catch(() => {
        if (!ignore) setCharacterError(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 주가 100인 시작 상태도 공통 단계 기준으로 아기냥 표시
  const currentStock = character?.currentStock ?? 0;
  const currentStage = getCharacterStage(currentStock);
  const catImage = getStandingCharacterImage(currentStage.stage);
  // 스트릭으로 달성한 가장 높은 단계의 배경 하나만 적용
  const streakDays = character?.currentStreak ?? 0;
  const backgroundImage =
    streakDays >= 21
      ? diamondBackground
      : streakDays >= 14
        ? goldBackground
        : streakDays >= 7
          ? silverBackground
          : streakDays >= 3
            ? bronzeBackground
            : undefined;

  useEffect(() => {
    let ignore = false;

    getAttendanceToday()
      .then((res) => {
        if (!ignore) setStatus(res.status);
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setStatus('loading');
    setRetryCount((previous) => previous + 1);
  };

  const handleClaim = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await claimAttendanceReword();
      onBalanceChange(res.balance);
      setStatus('CLAIMED');
      if (res.newlyClaimed) setRewardAmount(res.grantedAmount);
    } catch {
      alert('FISH를 받지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 상태별 버튼 문구와 동작
  const button = (() => {
    switch (status) {
      case 'loading':
        return { label: '', onClick: undefined, disabled: true };
      case 'error':
        return { label: '다시 시도', onClick: handleRetry, disabled: false };
      case 'AVAILABLE':
        return {
          label: '오늘의 FISH 받기',
          onClick: handleClaim,
          disabled: isLoading,
        };
      default: // CLAIMED, PASS_ACTIVE
        return {
          label: '문제 풀러 가기',
          onClick: () => navigate(ROUTES.QUIZ),
          disabled: false,
        };
    }
  })();

  const canClaim = status === 'AVAILABLE';

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 lg:gap-6">
      <Card className="relative min-h-0 flex-1 overflow-hidden border-blue-15 bg-white lg:min-h-55.5">
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {character ? (
          <div className="absolute bottom-0 left-1/2 h-full max-h-48 w-48 -translate-x-1/2 lg:h-48">
            <img
              src={catImage}
              alt={currentStage.name}
              className={`size-full object-contain ${currentStage.stage === 'BABY' ? 'origin-[50%_10%] scale-[1.9]' : 'origin-[50%_13.636%] scale-[1.785714]'}`}
            />
          </div>
        ) : (
          <p className="absolute bottom-6 w-full text-center text-sm text-gray-60">
            {characterError
              ? '캐릭터를 불러오지 못했어요.'
              : '캐릭터 불러오는 중...'}
          </p>
        )}
        <p className="absolute top-4 left-1/2 w-max max-w-[calc(100%-24px)] -translate-x-1/2 rounded-full bg-blue-50 px-3 py-2 text-center text-[14px] lg:top-5 xl:text-[16px] font-semibold break-keep text-white">
          {status === 'CLAIMED' || status === 'PASS_ACTIVE'
            ? '문제 풀러 가봐라 냥'
            : '오늘의 생선 받아가라 냥'}
        </p>
      </Card>

      <button
        type="button"
        onClick={button.onClick}
        disabled={button.disabled}
        className={`flex min-h-16 shrink-0 cursor-pointer items-center justify-center rounded-4xl px-3 py-4 text-[16px] lg:min-h-25 xl:px-6 xl:text-[22px] text-center break-keep font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
          canClaim
            ? 'border-2 border-green-40 bg-white text-blue-60 shadow-[0_0_4px_0_#276AD8]'
            : 'bg-blue-60 text-white shadow-[0_0_4px_0_#276AD8]'
        }`}
      >
        {canClaim && (
          <img
            src={fishImage}
            alt=""
            className="mr-2 size-7 shrink-0 object-contain"
          />
        )}
        {button.label}
      </button>
      {rewardAmount !== null && (
        <DailyRewardModal
          amount={rewardAmount}
          onClose={() => setRewardAmount(null)}
          onQuiz={() => {
            setRewardAmount(null);
            navigate(ROUTES.QUIZ);
          }}
        />
      )}
    </div>
  );
};

export default DailyRewardCard;
