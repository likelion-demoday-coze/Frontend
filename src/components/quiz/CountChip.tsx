import CorrectIcon from '../../assets/quiz/correct.svg?react';
import WrongIcon from '../../assets/quiz/wrong.svg?react';
import ComboIcon from '../../assets/quiz/combo.svg?react';

export type CountChipType = 'correct' | 'wrong' | 'combo';

interface CountChipProps {
  type: CountChipType;
  count: number;
}

const chipStyles: Record<CountChipType, string> = {
  correct: 'border-blue-60 bg-blue-05 text-blue-60',
  wrong: 'border-red-55 bg-red-02 text-red-r',
  combo: 'border-red-55 bg-yellow-05 text-red-55',
};

const labels: Record<CountChipType, string> = {
  correct: '정답',
  wrong: '오답',
  combo: '콤보',
};

//정답 / 오답 / 콤보(연속 정답) 개수 칩
const CountChip = ({ type, count }: CountChipProps) => {
  return (
    <span
      className={`inline-flex h-9 min-w-15 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-base font-medium lg:h-11 lg:min-w-19 lg:gap-2.5 lg:px-3 lg:text-xl ${chipStyles[type]}`}
    >
      {type === 'correct' && (
        <CorrectIcon aria-hidden="true" className="size-4 text-green-65" />
      )}
      {type === 'wrong' && (
        <WrongIcon aria-hidden="true" className="size-4 lg:size-5" />
      )}
      {type === 'combo' && (
        <ComboIcon aria-hidden="true" className="h-4 w-3.5 text-red-r" />
      )}
      <span aria-hidden="true">{String(count).padStart(2, '0')}</span>
      <span className="sr-only">{`${labels[type]} ${count}개`}</span>
    </span>
  );
};

export default CountChip;
