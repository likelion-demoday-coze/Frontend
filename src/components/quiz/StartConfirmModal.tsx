import { useEffect, useId } from 'react';
import type { QuizAttempt } from '../../hooks/useQuizEntryStatus';

type QuizMode = 'daily' | 'timeAttack';

interface StartConfirmModalProps {
  mode: QuizMode;
  categoryLabel?: string;
  fishCost: number;
  fishBalance: number;
  isPass: boolean;
  attempt: QuizAttempt;
  onClose: () => void;
  onStart: () => void;
  onCharge: () => void;
  onRanking?: () => void;
}

//정규장·시간외거래 시작 팝업
const StartConfirmModal = ({
  mode,
  categoryLabel,
  fishCost,
  fishBalance,
  isPass,
  attempt,
  onClose,
  onStart,
  onCharge,
  onRanking,
}: StartConfirmModalProps) => {
  const titleId = useId();
  const isDaily = mode === 'daily';
  const isExhausted = attempt.used >= attempt.limit;
  //시간외거래는 횟수를 다 쓰면 입장 불가, 정규장은 학습만 가능
  const isBlocked = !isDaily && isExhausted;
  const isFishShort = !isPass && !isBlocked && fishBalance < fishCost;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const primary = isBlocked
    ? { label: '랭킹 보러 가기', onClick: onRanking ?? onClose }
    : isFishShort
      ? { label: 'FISH 충전하기', onClick: onCharge }
      : {
          label: isDaily ? '정규장 시작' : '시간외거래 시작',
          onClick: onStart,
        };

  const fishValue = isBlocked ? (
    <span className="font-semibold text-red-55">-</span>
  ) : isPass ? (
    <span className="font-bold text-blue-60">패스 이용 중 · 차감 없음</span>
  ) : isFishShort ? (
    <span className="font-semibold text-red-55">
      보유 {fishBalance} · {fishCost - fishBalance}개가 부족해요
    </span>
  ) : (
    <span className="font-semibold text-blue-60">
      <span className="font-bold text-red-55">{fishCost} 사용</span> · 보유{' '}
      {fishBalance}
    </span>
  );

  const attemptValue = isExhausted ? (
    <span className="font-semibold text-red-55">
      오늘 {attempt.limit}/{attempt.limit}회차 모두 사용
    </span>
  ) : (
    <span className="font-semibold text-blue-60">
      {isDaily && '반영됨 · '}
      {attempt.used + 1}/{attempt.limit}회차
    </span>
  );

  const notice = isExhausted
    ? {
        tone: 'warning',
        text: isDaily
          ? '⚠ 이번 풀이는 주가에 반영되지 않아요. 학습만 할 수 있어요.'
          : '⚠ 오늘 모든 도전 횟수를 사용했어요. 내일 0시에 다시 열려요.',
      }
    : !isDaily && isPass
      ? {
          tone: 'info',
          text: '패스 유저도 시간외거래는 하루 3회차까지만 가능해요.',
        }
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-108 flex-col items-center gap-9 rounded-[20px] bg-white p-6"
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
              {/*TODO: 아이콘 디자인 나오면 교체*/}
              <span
                aria-hidden="true"
                className="size-20 rounded-[20px] bg-gray-10"
              />
              <div className="flex flex-col items-center gap-1 text-center">
                <h2
                  id={titleId}
                  className="text-lg font-medium break-keep text-black lg:text-xl"
                >
                  {isDaily ? (
                    <>
                      <strong className="font-semibold">{categoryLabel}</strong>{' '}
                      카테고리로 시작할까요?
                    </>
                  ) : (
                    '시간외거래를 시작할까요?'
                  )}
                </h2>
                <p className="text-sm font-medium text-gray-60 lg:text-base">
                  {isDaily
                    ? '오늘의 정규장 5문제가 출제돼요.'
                    : '1분 동안 최대한 많이 맞혀 보세요.'}
                </p>
              </div>
            </div>

            <dl className="flex w-full flex-col gap-2 rounded-lg bg-blue-05 px-5 py-2.25 text-sm leading-4.5">
              <div className="flex items-center justify-between gap-2 border-b border-gray-20 pb-2">
                <dt className="flex items-center gap-6 font-bold text-blue-60">
                  FISH
                  {isPass && !isBlocked && (
                    <span className="rounded-[20px] bg-blue-50 px-2 py-1 text-xs leading-5.5 text-blue-05">
                      PASS
                    </span>
                  )}
                </dt>
                <dd className="text-right">{fishValue}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="font-bold text-blue-60">
                  {isDaily ? '주가 반영' : '오늘 도전'}
                </dt>
                <dd className="text-right">{attemptValue}</dd>
              </div>
            </dl>
          </div>

          {notice && (
            <p
              role={notice.tone === 'warning' ? 'alert' : undefined}
              className={`w-full rounded-lg border px-3 py-2 text-center text-xs leading-4.5 font-semibold break-keep ${notice.tone === 'warning' ? 'border-yellow-45 text-red-55' : 'border-blue-60 text-blue-60'}`}
            >
              {notice.text}
            </p>
          )}
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40 lg:h-16 lg:w-42 lg:flex-none"
          >
            {isDaily ? '다시 고르기' : '돌아가기'}
          </button>
          <button
            type="button"
            onClick={primary.onClick}
            autoFocus
            className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:h-16 lg:w-42 lg:flex-none"
          >
            {primary.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartConfirmModal;
