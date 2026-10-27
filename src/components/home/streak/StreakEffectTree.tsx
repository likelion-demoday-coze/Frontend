//이펙트 트리, 진행바
import type { StreakData } from '../../../types/streak';
import StreakEffectItem from './StreakEffectItem';
import { ProgressBar } from '../../common/ProgressBar';
import right from '../../../assets/streak/right.svg';

interface StreakEffectTreeProps {
  data: StreakData;
}

const StreakEffectTree = ({ data }: StreakEffectTreeProps) => {
  const { effects, progress, remainingDays } = data;

  //일시정지 상태일 때 ->
  const isPaused = effects.some((effect) => effect.status === 'paused');
  //진행 구간의 길이
  const range = progress.to - progress.from;

  const percentage =
    range > 0
      ? Math.min(
          100,
          Math.max(0, ((progress.current - progress.from) / range) * 100)
        )
      : 100;

  return (
    <div className="@container">
      <h3 className="mb-4 text-[13px] font-semibold text-gray-40">
        이펙트 트리
      </h3>
      <div className="relative">
        {/* 사용 가능한 너비가 300px 이상이면 한 줄로 배치 */}
        <ul className="grid grid-cols-2 gap-2 @[300px]:grid-cols-4">
          {effects.map((effect) => (
            <StreakEffectItem key={effect.id} effect={effect} />
          ))}
        </ul>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-2 @[300px]:grid-cols-4"
        >
          {effects.map((effect, index) => (
            <div key={effect.id} className="relative">
              {index < effects.length - 1 && (
                <span
                  className={`absolute -right-2 top-1/2 w-2 -translate-y-1/2 justify-center ${index % 2 === 0 ? 'flex' : 'hidden @[300px]:flex'}`}
                >
                  <img src={right} alt="" className="h-[9px] w-[5px]" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {isPaused ? (
        <p className="mt-3 rounded-xl bg-gray-05 px-3 py-3 text-center text-[11px] leading-4 text-gray-60">
          연속학습이 중단되어 이펙트가 일시정지됐어요.
          <br />
          정규장을 완료하면 효과가 다시 적용돼요.
        </p>
      ) : (
        // 일시정지 상태가 아니면 진행 바와 남은 일수 표시
        <div className="mt-5">
          <div
            role="progressbar"
            aria-label="다음 이펙트까지 학습 진행률"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percentage)}
          >
            <ProgressBar percent={percentage} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
            <span className="shrink-0 text-gray-40">{progress.from}일</span>

            <p className="text-center text-gray-60">
              {remainingDays > 0 ? (
                <>
                  {progress.nextName}까지{' '}
                  <strong className="font-bold text-blue-60">
                    {remainingDays}일
                  </strong>{' '}
                  남았어요
                </>
              ) : (
                '모든 이펙트를 달성했어요!'
              )}
            </p>

            <span className="shrink-0 text-gray-40">{progress.to}일</span>
          </div>
        </div>
      )}{' '}
    </div>
  );
};

export default StreakEffectTree;
