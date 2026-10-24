//이펙트 한 단계의 활성/잠금/일시정지 표시
import type { StreakEffectData } from '../../../types/streak';
import qmark from '../../../assets/streak/question_mark.svg';
import bronze from '../../../assets/home/streak/1st_bronze.svg';
import silver from '../../../assets/home/streak/2nd_Silver.svg';
import gold from '../../../assets/home/streak/3th_Gold.svg';
import treasure from '../../../assets/home/streak/4th_treasure.svg';

const EFFECT_IMAGES: Record<number, string> = {
  3: bronze,
  7: silver,
  14: gold,
};

interface StreakEffectItemProps {
  // 이펙트 한 단계의 데이터
  effect: StreakEffectData;
}

// 상태별 카드 스타일
const STATUS_CLASSES = {
  active: 'border-yellow-45 bg-yellow-05',
  upcoming: 'border-dashed border-yellow-45 bg-white',
  locked: 'border-gray-20 bg-gray-05',
  paused: 'border-dashed border-gray-20 bg-gray-05',
};

const StreakEffectItem = ({ effect }: StreakEffectItemProps) => {
  const isPaused = effect.status === 'paused';
  const image = effect.requiredDays === 21
    ? (effect.status === 'active' || isPaused ? treasure : undefined)
    : EFFECT_IMAGES[effect.requiredDays];

  return (
    <li
      className={`relative flex h-20 w-17 min-w-0 flex-col items-center justify-end rounded-lg border px-4 py-1 text-center ${STATUS_CLASSES[effect.status]}`}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute top-0 left-1/2 size-13 -translate-x-1/2 object-contain"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute top-2 text-xl font-semibold text-gray-40"
        >
          <img src={qmark} alt="?" className="size-6" />
        </span>
      )}

      <span className="relative text-[12px] leading-4 text-gray-40">
        {isPaused ? '일시정지' : `${effect.requiredDays}일`}
      </span>

      <span className="relative text-[12px] leading-4 text-gray-80">
        {effect.name}
      </span>
    </li>
  );
};

export default StreakEffectItem;
