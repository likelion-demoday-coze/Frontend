import CorrectIcon from '../../assets/quiz/correct.svg?react';
import WrongIcon from '../../assets/quiz/wrong.svg?react';

interface AnswerMarkProps {
  isCorrect: boolean;
}

//문제별 정답·오답 표시 (마감 팝업, 총정리)
const AnswerMark = ({ isCorrect }: AnswerMarkProps) => {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-lg border ${isCorrect ? 'border-green-65 bg-white text-green-65' : 'border-red-r bg-red-02 text-red-r'}`}
    >
      {isCorrect ? (
        <CorrectIcon aria-hidden="true" className="size-4" />
      ) : (
        <WrongIcon aria-hidden="true" className="size-5" />
      )}
      <span className="sr-only">{isCorrect ? '정답' : '오답'}</span>
    </span>
  );
};

export default AnswerMark;
