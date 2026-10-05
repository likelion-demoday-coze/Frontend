import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../common/Card';
import catImage from '../../../assets/character/basic_pose_cat.svg';
import type { AttendanceStatus } from '../../../types/attendance';
import {
  claimAttendanceReword,
  getAttendanceToday,
} from '../../../api/attendance';
import { ROUTES } from '../../../constants/routes';

type ViewStatus = AttendanceStatus | 'loading' | 'error';

const DailyRewardCard = () => {
  const navigate = useNavigate();
  //오늘의 보상 수령 상태 (조회 전에는 로딩중)
  const [status, setStatus] = useState<ViewStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = () => {
    let ignore = false; // 화면을 떠난 뒤 늦게 온 응답 무시
    setStatus('loading');
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
  };

  useEffect(() => fetchStatus(), []);

  const handleClaim = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await claimAttendanceReword();
      setStatus('CLAIMED');
      if (res.newlyClaimed) alert(`FISH ${res.grantedAmount}개를 받았어요!`);
      if (res.newlyClaimed) {
        //topbar 갱신하기(흠)
      }
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
        return { label: '다시 시도', onClick: fetchStatus, disabled: false };
      case 'AVAILABLE':
        return {
          label: '🐟 오늘의 FISH 받기',
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
    <div className="flex flex-col gap-6 xl:h-full">
      <Card className="relative min-h-55.5 overflow-hidden border-blue-15 bg-white xl:flex-1">
        <img
          src={catImage}
          alt=""
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
        />
        <p className="absolute top-10 left-1/2 -translate-x-1/2 rounded-full bg-blue-50 px-3 py-2 text-[16px] font-semibold whitespace-nowrap text-white">
          오늘의 생선 받아가라 냥
        </p>
      </Card>

      <button
        type="button"
        onClick={button.onClick}
        disabled={button.disabled}
        className={`flex h-25 cursor-pointer items-center justify-center rounded-4xl px-6 py-4 text-[22px] font-semibold disabled:cursor-not-allowed disazbled:opacity-50 ${
          canClaim
            ? 'border-2 border-green-40 bg-white text-blue-60 shadow-[0_0_4px_0_#276AD8]'
            : 'bg-blue-60 text-white shadow-[0_0_4px_0_#276AD8]'
        }`}
      >
        {button.label}
      </button>
    </div>
  );
};

export default DailyRewardCard;
