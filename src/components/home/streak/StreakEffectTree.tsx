//이펙트 트리, 진행바
import type { StreakData } from '../../../types/streak';
import StreakEffectItem from './StreakEffectItem';
import { ProgressBar } from '../../common/ProgressBar';
import right from '../../../assets/streak/right.svg';

interface StreakEffectTreeProps {
  data: StreakData;
  mobileExpanded?: boolean;
}

const StreakEffectTree = ({
  data,
  mobileExpanded = true,
}: StreakEffectTreeProps) => {
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
      <h3 className="mb-4 hidden text-[13px] font-semibold text-gray-40 lg:block">
        이펙트 트리
      </h3>
      <div
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none lg:visible lg:grid-rows-[1fr] ${mobileExpanded ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-4 lg:pt-0">
            <div className="relative">
              {/* 화면이 좁아져도 4개씩 두 줄로 배치 */}
              <ul className="grid grid-cols-4 gap-x-3 gap-y-6">
                {effects.map((effect) => (
                  <StreakEffectItem key={effect.id} effect={effect} />
                ))}
              </ul>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-x-3 gap-y-6"
              >
                {effects.map((effect, index) => (
                  <div key={effect.id} className="relative">
                    {index < effects.length - 1 && (index + 1) % 4 !== 0 && (
                      <span className="absolute top-1/2 -right-3 flex w-3 -translate-y-1/2 justify-center">
                        <img
                          src={right}
                          alt=""
                          className="h-[clamp(9px,2.6cqi,16px)] w-auto"
                        />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

          <div className="mt-3 flex items-center justify-between gap-2 text-[14px]">
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
