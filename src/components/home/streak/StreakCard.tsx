import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import streakIcon from '../../../assets/navbar/streak_icon.svg';
import type { StreakData } from '../../../types/streak';
import { Card } from '../../common/Card';
import StreakWeek from './StreakWeek';
import StreakNotice from './StreakNotice';
import StreakEffectTree from './StreakEffectTree';

interface StreakCardProps {
  // 카드에 표시할 전체 화면 데이터
  data: StreakData;

  // 복구하기 클릭 시 부모가 실행할 함수
  onRestore: () => void;

  // 퀴즈 풀러가기 클릭 시 부모가 실행할 함수
  onStartQuiz: () => void;

  // 실제 복구 요청 중일 때 버튼 중복 클릭을 막는 값
  isRestoring?: boolean;

  // 복구 신청 후 학습 기한 안내
  deadlineLabel?: string;
  showWeek?: boolean;
}

const StreakCard = ({
  data,
  onRestore,
  onStartQuiz,
  isRestoring = false,
  deadlineLabel,
  showWeek = true,
}: StreakCardProps) => {
  const [isEffectOpen, setIsEffectOpen] = useState(false);
  const effectPanelId = useId();
  const { view, currentDays, bestDays } = data;

  // 복구 전에는 오늘 학습 여부와 관계없이 복구 버튼을 표시할 수 있어.
  const canRestore = view === 'broken' || view === 'restarted';

  // 이미 복구를 신청했지만 정규장 완료가 필요한 상태
  const isPending = view === 'restorePending';

  // 끊김·만료 화면에서는 일수를 회색으로 표시해.
  const isBroken = view === 'broken' || view === 'expired';

  const countClass =
    isPending || isBroken || currentDays === 0
      ? 'text-gray-40'
      : 'text-yellow-45';
  const showBrokenLabel = view === 'broken';

  return (
    <Card className="lg:min-h-112.5 mt-4 flex w-full flex-col bg-white p-5">
      {/* 상단: 일수 + 설명 + 버튼 또는 최고 기록 */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <img
            src={streakIcon}
            alt=""
            className={`size-10 shrink-0 object-contain ${isBroken ? 'opacity-50' : ''}`}
          />
          <span
            className={`font-bold ${countClass} ${showBrokenLabel ? 'text-base leading-snug break-keep' : 'shrink-0 text-[28px] leading-none whitespace-nowrap'}`}
          >
            {showBrokenLabel ? '연속학습 끊김' : `${currentDays}일`}
          </span>
        </div>

        {canRestore ? (
          // 복구 가능한 상태: 복구하기 버튼
          <button
            type="button"
            onClick={onRestore}
            disabled={isRestoring}
            className="min-h-9 shrink-0 cursor-pointer rounded-full bg-blue-60 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRestoring ? '복구 중...' : '복구하기'}
          </button>
        ) : isPending ? (
          // 복구 신청 후 학습이 필요한 상태: 퀴즈 이동 버튼
          <button
            type="button"
            onClick={onStartQuiz}
            aria-label="복구 대기 중, 정규장 풀러 가기"
            className="min-h-9 shrink-0 cursor-pointer rounded-full bg-gray-40 px-3 py-2 text-xs font-semibold whitespace-nowrap text-white"
          >
            복구 대기중
          </button>
        ) : bestDays !== null ? (
          <span className="shrink-0 rounded-full bg-[#FFC66B] px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-white">
            최고기록 {bestDays}일
          </span>
        ) : null}
      </div>

      {/* 월~일 학습 기록 */}
      <div className="@container rounded-xl bg-white px-3 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
        {showWeek && <StreakWeek days={data.days} variant="card" />}
        <div className={showWeek ? 'mt-4' : ''}>
          <StreakNotice
            view={view}
            currentDays={currentDays}
            deadlineLabel={deadlineLabel}
          />
        </div>
      </div>

      {/* 이펙트 단계와 진행 상태 */}
      <div className="mt-5 border-t border-gray-10 pt-3 lg:mt-auto lg:border-0 lg:pt-10">
        <button
          type="button"
          aria-expanded={isEffectOpen}
          aria-controls={effectPanelId}
          onClick={() => setIsEffectOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md py-2 text-sm font-semibold text-gray-60 lg:hidden"
        >
          이펙트 트리
          <ChevronDown
            aria-hidden="true"
            className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${isEffectOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <div id={effectPanelId}>
          <StreakEffectTree data={data} mobileExpanded={isEffectOpen} />
        </div>
      </div>
    </Card>
  );
};

export default StreakCard;
