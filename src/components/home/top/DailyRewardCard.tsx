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

const DailyRewordCard = ({}) => {
  const navigate = useNavigate();
  //오늘의 보상 수령 상태 (조회 전에는 로딩중)
  const [status, setStatus] = useState<AttendanceStatus | 'loading'>('loading');
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    getAttendanceToday()
      .then((res) => setStatus(res.status))
      .catch(() => setStatus('AVAILABLE')); // 조회 실패 시 임시로 받기 가능 처리
  }, []);

  const handleClaim = async () => {
    if (isloading) return;

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
        onClick={canClaim ? handleClaim : () => navigate(ROUTES.QUIZ)}
        className={`flex h-25 items-center justify-center rounded-4xl text-[22px] font-semibold py-4 px-6 cursor-pointer ${canClaim ? 'bg-blue-60 text-white shadow-[0_0_4px_0_#276AD8]' : 'border-2 border-green-40 bg-white text-blue-60 shadow-[0_0_4px_0_#276AD8]'}`}
      >
        {status === 'loading'
          ? ''
          : canClaim
            ? '🐟 오늘의 FISH 받기'
            : '문제 풀러 가기'}
      </button>
    </div>
  );
};

export default DailyRewordCard;
