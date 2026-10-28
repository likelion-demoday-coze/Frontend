import CountChip from './CountChip';
import type { CountChipType } from './CountChip';
import QuizDialog from './QuizDialog';
import timeAttackIcon from '../../assets/quiz/mode_time_attack.png';

interface TimeAttackEndModalProps {
  maxCombo: number;
  correctCount: number;
  incorrectCount: number;
  onRetry: () => void;
  onNext: () => void;
}

//시간외거래 1분이 끝나면 뜨는 마감 팝업
const TimeAttackEndModal = ({
  maxCombo,
  correctCount,
  incorrectCount,
  onRetry,
  onNext,
}: TimeAttackEndModalProps) => {
  const stats: { label: string; type: CountChipType; count: number }[] = [
    { label: '콤보', type: 'combo', count: maxCombo },
    { label: '맞힌 문제', type: 'correct', count: correctCount },
    { label: '오답', type: 'wrong', count: incorrectCount },
  ];

  return (
    <QuizDialog
      icon={timeAttackIcon}
      title="시간외거래 마감"
      description={
        '숨 가빴던 1분이 모두 지나갔어요.\n틀린 문제를 확인하고 다시 도전해 보세요.'
      }
      secondary={{ label: '다시 도전하기', onClick: onRetry }}
      primary={{ label: 'NEXT', onClick: onNext }}
      onClose={() => {}}
    >
      <dl className="flex w-full justify-center gap-6 rounded-lg bg-blue-05 p-2.5">
        {stats.map(({ label, type, count }) => (
          <div key={label} className="flex w-19 flex-col items-center gap-2">
            <dt className="text-base leading-5.5 font-bold text-gray-60">
              {label}
            </dt>
            <dd>
              <CountChip type={type} count={count} />
            </dd>
          </div>
        ))}
      </dl>
    </QuizDialog>
  );
};

export default TimeAttackEndModal;
