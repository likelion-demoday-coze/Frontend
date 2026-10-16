import CorrectIcon from '../../assets/quiz/correct.svg?react';
import WrongIcon from '../../assets/quiz/wrong.svg?react';

export type OptionStatus = 'default' | 'selected' | 'correct' | 'wrong';

interface OptionButtonProps {
  number: number;
  label: string;
  status?: OptionStatus;
  disabled?: boolean;
  onClick?: () => void;
}

const containerStyles: Record<OptionStatus, string> = {
  default: 'border-gray-20 bg-gray-05 font-medium text-gray-60',
  selected:
    'border-blue-50 bg-white font-bold text-blue-45 shadow-[0_0_2px_var(--color-blue-50)]',
  correct: 'border-green-65 bg-green-15 font-bold text-green-80',
  wrong: 'border-red-55 bg-red-05 font-bold text-red-55',
};

const badgeStyles: Record<OptionStatus, string> = {
  default: 'border border-gray-20 bg-white text-gray-60',
  selected: 'border border-gray-20 bg-white text-gray-60',
  correct: 'bg-green-65 text-white',
  wrong: 'bg-red-r text-white',
};

//4지선다 보기 버튼 (기본 / 선택 / 정답 / 오답)
const OptionButton = ({
  number,
  label,
  status = 'default',
  disabled = false,
  onClick,
}: OptionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={status === 'selected'}
      className={`flex min-h-14 w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-base transition-colors lg:min-h-20.5 lg:gap-5 lg:px-6 lg:text-xl ${containerStyles[status]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-base font-bold lg:size-8 lg:text-xl ${badgeStyles[status]}`}
      >
        {status === 'correct' && (
          <CorrectIcon aria-hidden="true" className="size-4" />
        )}
        {status === 'wrong' && (
          <WrongIcon aria-hidden="true" className="size-5 lg:size-6" />
        )}
        {(status === 'default' || status === 'selected') && number}
      </span>
      {/*아이콘만 보이는 채점 결과를 스크린리더에 전달*/}
      {status === 'correct' && <span className="sr-only">정답:</span>}
      {status === 'wrong' && <span className="sr-only">오답:</span>}
      <span className="leading-snug">{label}</span>
    </button>
  );
};

export default OptionButton;
