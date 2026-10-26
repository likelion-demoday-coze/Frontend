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

// 상태별 헤더 설명
const HEADER_MESSAGES = {
  learning: '연속 학습 중!',
  broken: '연속 학습 끊김',
  restorePending: '복구 대기중',
  completed: '연속 학습 중!',
  restarted: '새로 시작했어요',
  expired: '연속 학습 끊김',
};

const StreakCard = ({
  data,
  onRestore,
  onStartQuiz,
  isRestoring = false,
  deadlineLabel,
  showWeek = true,
}: StreakCardProps) => {
  const { view, currentDays, bestDays } = data;

  // 복구 전에는 오늘 학습 여부와 관계없이 복구 버튼을 표시할 수 있어.
  const canRestore = view === 'broken' || view === 'restarted';

  // 이미 복구를 신청했지만 정규장 완료가 필요한 상태
  const isPending = view === 'restorePending';

  // 끊김·만료 화면에서는 일수를 회색으로 표시해.
  const isBroken = view === 'broken' || view === 'expired';

  const countClass = isPending
    ? 'text-purple-45'
    : isBroken
      ? 'text-gray-40'
      : 'text-yellow-45';

  return (
    <Card className="min-h-[450px] mt-4 flex w-full flex-col bg-white p-5">
      {/* 상단: 일수 + 설명 + 버튼 또는 최고 기록 */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`shrink-0 text-[28px] leading-none font-bold ${countClass}`}
          >
            {currentDays}일
          </span>

          <span
            className={`text-[12px] font-semibold ${
              isPending ? 'text-purple-30' : 'text-gray-60'
            }`}
          >
            {HEADER_MESSAGES[view]}
          </span>
        </div>

        {canRestore ? (
          // 복구 가능한 상태: 복구하기 버튼
          <button
            type="button"
            onClick={onRestore}
            disabled={isRestoring}
            className="shrink-0 cursor-pointer rounded-lg bg-blue-60 px-3 py-1 h-11 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRestoring ? '복구 중...' : '복구하기'}
          </button>
        ) : isPending ? (
          // 복구 신청 후 학습이 필요한 상태: 퀴즈 이동 버튼
          <button
            type="button"
            onClick={onStartQuiz}
            className="shrink-0 cursor-pointer rounded-lg bg-blue-60 px-3 py-1 h-11 text-[12px] font-semibold text-white"
          >
            퀴즈 풀러가기
          </button>
        ) : bestDays !== null ? (
          //최고기록 보여줌 TODO : 최고기록 받아서 보여주기
          <span className="shrink-0 rounded-lg border border-yellow-45 px-2.5 py-2 text-[16px] font-semibold text-yellow-45">
            최고기록 {bestDays}일
          </span>
        ) : null}
      </div>

      {/* 월~일 학습 기록 */}
      {showWeek && <StreakWeek days={data.days} />}

      {/* 상태별 안내 문구 */}
      <div className="mt-5">
        <StreakNotice view={view} deadlineLabel={deadlineLabel} />
      </div>

      {/* 이펙트 단계와 진행 상태 */}
      <div className="mt-auto pt-10">
        <StreakEffectTree data={data} />
      </div>
    </Card>
  );
};

export default StreakCard;
