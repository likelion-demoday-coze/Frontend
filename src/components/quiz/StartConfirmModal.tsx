import QuizDialog from './QuizDialog';
import timeAttackIcon from '../../assets/quiz/mode_time_attack.png';
import { QUIZ_CATEGORY_INFO } from '../../constants/quizCategory';
import type { FishShortAction } from '../../hooks/useFishShortAction';
import type { QuizAttempt } from '../../hooks/useQuizEntryStatus';
import type { QuizCategory } from '../../types/quiz';

type QuizMode = 'daily' | 'timeAttack';

interface StartConfirmModalProps {
  mode: QuizMode;
  category?: QuizCategory;
  fishCost: number;
  fishBalance: number;
  isPass: boolean;
  attempt: QuizAttempt;
  onClose: () => void;
  onStart: () => void;
  fishShortAction: FishShortAction;
}

//정규장·시간외거래 시작 팝업
const StartConfirmModal = ({
  mode,
  category,
  fishCost,
  fishBalance,
  isPass,
  attempt,
  onClose,
  onStart,
  fishShortAction,
}: StartConfirmModalProps) => {
  const isDaily = mode === 'daily';
  const categoryInfo = category && QUIZ_CATEGORY_INFO[category];
  const isExhausted = attempt.used >= attempt.limit;
  const isFishShort = !isPass && fishBalance < fishCost;

  const fishValue = isPass ? (
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

  //정규장은 반영 횟수를 다 써도 학습만 가능
  const notice =
    isDaily && isExhausted
      ? {
          tone: 'warning',
          text: '⚠ 이번 풀이는 주가에 반영되지 않아요. 학습만 할 수 있어요.',
        }
      : !isDaily && isPass
        ? {
            tone: 'info',
            text: '패스 유저도 시간외거래는 하루 3회차까지만 가능해요.',
          }
        : null;

  return (
    <QuizDialog
      icon={categoryInfo?.icon ?? timeAttackIcon}
      title={
        isDaily ? (
          <>
            <strong className="font-semibold">{categoryInfo?.label}</strong>{' '}
            카테고리로 시작할까요?
          </>
        ) : (
          '시간외거래를 시작할까요?'
        )
      }
      description={
        isDaily
          ? '오늘의 정규장 5문제가 출제돼요.'
          : '1분 동안 최대한 많이 맞혀 보세요.'
      }
      secondary={{
        label: isDaily ? '다시 고르기' : '돌아가기',
        onClick: onClose,
      }}
      primary={
        isFishShort
          ? fishShortAction
          : {
              label: isDaily ? '정규장 시작' : '시간외거래 시작',
              onClick: onStart,
            }
      }
      onClose={onClose}
    >
      <div className="flex w-full flex-col gap-3">
        <dl className="flex w-full flex-col gap-2 rounded-lg bg-blue-05 px-5 py-2.25 text-sm leading-4.5">
          <div className="flex items-center justify-between gap-2 border-b border-gray-20 pb-2">
            <dt className="flex items-center gap-6 font-bold text-blue-60">
              FISH
              {isPass && (
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

        {notice && (
          <p
            role={notice.tone === 'warning' ? 'alert' : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-center text-xs leading-4.5 font-semibold break-keep ${notice.tone === 'warning' ? 'border-yellow-45 text-red-55' : 'border-blue-60 text-blue-60'}`}
          >
            {notice.text}
          </p>
        )}
      </div>
    </QuizDialog>
  );
};

export default StartConfirmModal;
