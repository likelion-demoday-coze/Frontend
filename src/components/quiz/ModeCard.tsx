import type { KeyboardEvent, ReactNode } from 'react';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import dailyIcon from '../../assets/quiz/mode_daily.png';
import timeAttackIcon from '../../assets/quiz/mode_time_attack.png';
import type { QuizAttempt } from '../../hooks/useQuizEntryStatus';

type QuizMode = 'daily' | 'timeAttack';

interface ModeCardProps {
  mode: QuizMode;
  fishCost: number;
  fishBalance: number;
  isPass: boolean;
  attempt: QuizAttempt;
  isInProgress?: boolean;
  selected: boolean;
  onSelect: () => void;
  onCharge: () => void;
}

const content: Record<
  QuizMode,
  {
    title: string;
    subtitle: string;
    description: string;
    attemptLabel: string;
    icon: string;
  }
> = {
  daily: {
    title: '정규장',
    subtitle: '매일 5문제 학습',
    description: '8개 섹터 중 하나를 선택해 주가를 올려보세요.',
    attemptLabel: '오늘 주가 반영',
    icon: dailyIcon,
  },
  timeAttack: {
    title: '시간외거래',
    subtitle: '1분 타임어택 단타',
    description: '1분 동안 최대한 많이 맞혀 오늘의 랭킹을 뒤집으세요.',
    attemptLabel: '오늘 도전',
    icon: timeAttackIcon,
  },
};

//모드 선택 카드
const ModeCard = ({
  mode,
  fishCost,
  fishBalance,
  isPass,
  attempt,
  isInProgress = false,
  selected,
  onSelect,
  onCharge,
}: ModeCardProps) => {
  const { title, subtitle, description, attemptLabel, icon } = content[mode];
  const isExhausted = attempt.used >= attempt.limit;
  //시간외거래는 횟수를 다 쓰면 선택 불가, 정규장은 학습만 가능
  const isDisabled = mode === 'timeAttack' && isExhausted;
  const isFishShort =
    !isPass && !isInProgress && !isDisabled && fishBalance < fishCost;

  const notice: { tone: 'info' | 'warning'; text: string } | null = isInProgress
    ? { tone: 'info', text: '▶ 진행 중인 학습이 있어요' }
    : isDisabled
      ? {
          tone: 'warning',
          text: `오늘 도전 ${attempt.limit}/${attempt.limit}회 · 내일 0시에 새로운 거래 시작`,
        }
      : isFishShort
        ? {
            tone: 'warning',
            text: `⚠ 생선이 ${fishCost - fishBalance}개 부족해요`,
          }
        : mode === 'daily' && isExhausted
          ? {
              tone: 'warning',
              text: `반영 ${attempt.limit}/${attempt.limit}회 완료 · 이제 학습만 가능`,
            }
          : null;

  const fishValue: ReactNode = isInProgress ? (
    <span className="font-bold text-blue-60">이미 차감됨 · 추가 차감 없음</span>
  ) : isPass ? (
    <span className="font-bold text-blue-60">차감없음</span>
  ) : (
    <>
      <span className="font-bold text-red-55">{fishCost} 필요</span>
      <span className="font-semibold text-gray-60"> · 보유 {fishBalance}</span>
    </>
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      onClick={isDisabled ? undefined : onSelect}
      onKeyDown={isDisabled ? undefined : handleKeyDown}
      className={`flex w-full flex-col justify-between gap-8 rounded-[20px] border bg-white px-6 py-5 lg:h-110 lg:w-79 lg:gap-0 lg:px-8 lg:py-6 ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${selected ? 'border-blue-50 shadow-[0_0_4px_var(--color-blue-50)]' : 'border-gray-20'}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <strong className="text-2xl leading-9 font-bold text-black">
                {title}
              </strong>
              <span className="text-base leading-6.5 font-semibold text-gray-60">
                {subtitle}
              </span>
            </div>
            <img src={icon} alt="" className="size-16 shrink-0 lg:size-20" />
          </div>
          <p className="max-w-58.5 text-base leading-6.5 font-medium break-keep text-gray-60">
            {description}
          </p>
        </div>
        {notice && (
          <p
            className={`rounded-lg border px-3 py-2 text-center text-xs leading-4.5 font-semibold break-keep ${notice.tone === 'info' ? 'border-blue-60 text-blue-60' : 'border-yellow-45 text-red-55'}`}
          >
            {notice.text}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 border-t border-gray-20 pt-3">
        <div className="flex w-full items-center justify-between gap-2">
          <span className="flex items-center gap-3 text-base leading-6.5 font-semibold text-blue-60">
            FISH
            {isPass && !isInProgress && (
              <span className="rounded-[20px] bg-blue-50 px-2 py-1 text-xs leading-5.5 font-bold text-blue-05">
                PASS
              </span>
            )}
          </span>
          <span className="text-right text-sm leading-4.5">{fishValue}</span>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base leading-6.5 font-semibold text-blue-60">
              {attemptLabel}
            </span>
            <span
              className={`text-sm leading-4.5 ${isExhausted ? 'font-bold text-red-55' : 'font-semibold text-gray-60'}`}
            >
              {attempt.used}/{attempt.limit}회 사용
            </span>
          </div>
          <div aria-hidden="true" className="flex gap-1">
            {Array.from({ length: attempt.limit }, (_, index) => (
              <span
                key={index}
                className={`h-2 w-4.5 rounded-sm ${index < attempt.used ? 'bg-blue-60' : 'bg-gray-10'}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onCharge();
          }}
          tabIndex={isFishShort ? 0 : -1}
          aria-hidden={!isFishShort}
          className={`flex cursor-pointer items-center text-sm leading-4.5 font-semibold text-blue-60 ${isFishShort ? '' : 'invisible'}`}
        >
          생선 충전하기
          <ArrowIcon aria-hidden="true" className="h-4 w-2" />
        </button>
      </div>
    </div>
  );
};

export default ModeCard;
