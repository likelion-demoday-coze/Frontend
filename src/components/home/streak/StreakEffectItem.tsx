//이펙트 한 단계의 활성/잠금/일시정지 표시
import type { StreakEffectData } from '../../../types/streak';
import qmark from '../../../assets/streak/question_mark.svg';
import { STREAK_EFFECT_IMAGES } from '../../../constants/streakEffects';

interface StreakEffectItemProps {
  // 이펙트 한 단계의 데이터
  effect: StreakEffectData;
}

// 상태별 카드 스타일
const STATUS_CLASSES = {
  active: 'border-transparent bg-gray-05',
  upcoming: 'border-dashed border-yellow-45 bg-white',
  locked: 'border-transparent bg-transparent',
  paused: 'border-transparent bg-gray-05',
};

const StreakEffectItem = ({ effect }: StreakEffectItemProps) => {
  const isPaused = effect.status === 'paused';
  const textClass =
    effect.status === 'upcoming'
      ? 'text-yellow-45'
      : effect.status === 'active' || isPaused
        ? 'text-gray-40'
        : 'text-gray-60';
  const image =
    effect.requiredDays === 21
      ? effect.status === 'active' || isPaused
        ? STREAK_EFFECT_IMAGES[21]
        : undefined
      : STREAK_EFFECT_IMAGES[effect.requiredDays];

  return (
    <li
      aria-current={effect.status === 'upcoming' ? 'step' : undefined}
      className={`flex h-[clamp(88px,27cqi,160px)] w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 text-center ${STATUS_CLASSES[effect.status]}`}
    >
      <div className="flex size-[clamp(40px,14cqi,80px)] shrink-0 items-center justify-center">
        {image ? (
          <img src={image} alt="" className="size-full object-contain" />
        ) : (
          <img src={qmark} alt="" className="size-[clamp(18px,6cqi,32px)]" />
        )}
      </div>

      <span
        className={`text-[clamp(11px,3.4cqi,22px)] leading-tight ${textClass}`}
      >
        {isPaused ? '일시정지' : `${effect.requiredDays}일`}
      </span>

      <span
        className={`text-[clamp(11px,3.4cqi,22px)] leading-tight font-semibold whitespace-nowrap ${effect.status === 'locked' ? 'text-gray-80' : textClass}`}
      >
        {effect.name}
      </span>
    </li>
  );
};

export default StreakEffectItem;
