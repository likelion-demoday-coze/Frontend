//이펙트 한 단계의 활성/잠금/일시정지 표시
import type { StreakEffectData } from '../../../types/streak';
import qmark from '../../../assets/streak/question_mark.svg';

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
  const isLocked = effect.status === 'locked';
  const isPaused = effect.status === 'paused';

  return (
    <li
      className={`relative flex h-20 w-17 min-w-0 flex-col items-center justify-end rounded-lg border px-4 py-1 text-center ${STATUS_CLASSES[effect.status]}`}
    >
      {/* 잠긴 단계만 물음표 표시 */}
      {isLocked && (
        <span
          aria-hidden="true"
          className="absolute top-2 text-xl font-semibold text-gray-40"
        >
          <img src={qmark} alt="?" className="size-6" />
        </span>
      )}

      <span className="text-[12px] leading-4 text-gray-40">
        {isPaused ? '일시정지' : `${effect.requiredDays}일`}
      </span>

      {/* 잠금/일시정지의 경우 -> 시크릿 */}
      <span className="text-[12px] leading-4 text-gray-80">
        {isLocked || isPaused ? '시크릿' : effect.name}
      </span>
    </li>
  );
};

export default StreakEffectItem;
