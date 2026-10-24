import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import fishImage from '../../assets/store/Fish_a.svg';

const getRemainingTime = () => {
  const dayMs = 24 * 60 * 60 * 1000;
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const seconds = Math.ceil((dayMs - ((Date.now() + kstOffsetMs) % dayMs)) / 1000);
  return [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ].map((value) => String(value).padStart(2, '0')).join(':');
};

const RankingRewardBanner = () => {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-05 px-4 py-3">
      <div className="flex items-center gap-4">
        <img src={fishImage} alt="" className="size-11 object-contain" />
        <div>
          <p className="text-sm font-semibold text-gray-80">
            매일 <span className="text-blue-60">1~3위</span>에게{' '}
            <span className="text-blue-60">FISH 100개!</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-60">
            ※ 패스 이용 중에는 생선이 지급되지 않아요
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-blue-60 bg-white px-3 py-2 text-xs font-semibold text-blue-60">
        <Timer aria-hidden="true" className="size-4" />
        <span className="tabular-nums">마감까지 {remainingTime}</span>
      </div>
    </div>
  );
};

export default RankingRewardBanner;
