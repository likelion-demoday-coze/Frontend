import QuizDialog from './QuizDialog';
import catSad from '../../assets/character/quiz_cat_sad.png';

export interface LeaveInfoRow {
  label: string;
  value: string;
  tone?: 'blue' | 'red' | 'gray';
}

interface QuizLeaveModalProps {
  title: string;
  description: string;
  rows: LeaveInfoRow[];
  stayLabel: string;
  onLeave: () => void;
  onStay: () => void;
}

const toneStyles = {
  blue: 'text-blue-50',
  red: 'text-red-55',
  gray: 'text-gray-60',
};

//퀴즈 도중 나가려고 할 때 뜨는 중도퇴장 팝업
const QuizLeaveModal = ({
  title,
  description,
  rows,
  stayLabel,
  onLeave,
  onStay,
}: QuizLeaveModalProps) => {
  return (
    <QuizDialog
      icon={catSad}
      title={title}
      description={description}
      secondary={{ label: '나가기', onClick: onLeave }}
      primary={{ label: stayLabel, onClick: onStay }}
      onClose={onStay}
    >
      <dl className="flex w-full flex-col gap-2 rounded-lg bg-gray-05 px-5 py-2.25 text-sm leading-4.5 font-bold">
        {rows.map(({ label, value, tone = 'gray' }, index) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-2 ${index < rows.length - 1 ? 'border-b border-gray-20 pb-3' : ''}`}
          >
            <dt className="text-gray-60">{label}</dt>
            <dd className={`text-right ${toneStyles[tone]}`}>{value}</dd>
          </div>
        ))}
      </dl>
    </QuizDialog>
  );
};

export default QuizLeaveModal;
