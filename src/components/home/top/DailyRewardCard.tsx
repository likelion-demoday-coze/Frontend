import { Card } from '../../common/Card';
import catImage from '../../../assets/character/basic_pose_cat.svg';

interface DailyRewardCardProps {
  claimed?: boolean;
  onClaim?: () => void;
}
const DailyRewordCard = ({
  claimed = false,
  onClaim,
}: DailyRewardCardProps) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <Card className="relative overflow-hidden min-h-55.5 flex-1 border-blue-15 bg-white">
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
        onClick={onClaim}
        className={`flex h-25 items-center justify-center rounded-4xl text-[22px] font-semibold py-4 px-6 cursor-pointer ${claimed ? 'bg-blue-60 text-white shadow-[0_0_4px_0_#276AD8]' : 'border-2 border-green-40 bg-white text-blue-60 shadow-[0_0_4px_0_#276AD8]'}`}
      >
        {claimed ? '문제 풀러 가기' : '🐟 오늘의 FISH 받기'}
      </button>
    </div>
  );
};

export default DailyRewordCard;
