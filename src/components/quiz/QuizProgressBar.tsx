interface QuizProgressBarProps {
  current: number;
  total: number;
}

//문제 수만큼 구간이 나뉜 진행 바 (지나온 구간은 파랑, 남은 구간은 회색)
const QuizProgressBar = ({ current, total }: QuizProgressBarProps) => {
  return (
    <div
      role="progressbar"
      aria-label="퀴즈 진행률"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      className="flex w-full items-center"
    >
      {Array.from({ length: total }, (_, index) => {
        const color = index < current ? 'bg-blue-60' : 'bg-gray-20';
        return (
          <div key={index} className="flex flex-1 items-center">
            <span className={`h-px flex-1 ${color}`} />
            <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
          </div>
        );
      })}
    </div>
  );
};

export default QuizProgressBar;
