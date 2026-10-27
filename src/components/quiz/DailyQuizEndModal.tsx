import QuizDialog from './QuizDialog';
import CorrectIcon from '../../assets/quiz/correct.svg?react';
import WrongIcon from '../../assets/quiz/wrong.svg?react';
import dailyIcon from '../../assets/quiz/mode_daily.png';

interface DailyQuizEndModalProps {
  results: boolean[];
  isLoading?: boolean;
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
}

const getDescription = (correctCount: number, total: number) => {
  if (correctCount === total)
    return `${total}문제 모두 맞혔어요!\n정산에서 오늘 오른 주가를 확인해 보세요.`;
  if (correctCount >= 3)
    return '아깝게 놓친 문제가 있어요.\n해설을 확인하고 정산해 보세요.';
  return '오늘은 쉽지 않았죠?\n해설을 보면 내일은 더 잘할 수 있어요.';
};

//정규장 5문제를 다 풀면 뜨는 마감 팝업
const DailyQuizEndModal = ({
  results,
  isLoading = false,
  onRetry,
  onNext,
  onClose,
}: DailyQuizEndModalProps) => {
  const total = results.length;
  const correctCount = results.filter(Boolean).length;
  const hasWrong = correctCount < total;

  return (
    <QuizDialog
      icon={dailyIcon}
      title="정규장 마감"
      description={getDescription(correctCount, total)}
      secondary={
        hasWrong ? { label: '오답 다시풀기', onClick: onRetry } : undefined
      }
      primary={{ label: 'NEXT', onClick: onNext, disabled: isLoading }}
      onClose={onClose}
    >
      <div className="flex w-full flex-col items-center gap-3 rounded-lg bg-blue-05 p-2.5">
        <p className="text-base leading-4.5 font-bold text-black">
          {total}문제 중{' '}
          <span className="text-blue-60">{correctCount}문제</span> 정답
        </p>
        <ol className="flex gap-4">
          {results.map((isCorrect, index) => (
            <li key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs leading-3.5 font-semibold text-blue-60">
                {index + 1}
              </span>
              <span
                className={`flex size-6 items-center justify-center rounded-lg border ${isCorrect ? 'border-green-65 bg-white text-green-65' : 'border-red-r bg-red-02 text-red-r'}`}
              >
                {isCorrect ? (
                  <CorrectIcon aria-hidden="true" className="size-4" />
                ) : (
                  <WrongIcon aria-hidden="true" className="size-5" />
                )}
                <span className="sr-only">{isCorrect ? '정답' : '오답'}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </QuizDialog>
  );
};

export default DailyQuizEndModal;
