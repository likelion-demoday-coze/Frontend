import { useEffect, useRef, useState } from 'react';
import CorrectIcon from '../../assets/quiz/correct.svg?react';
import WrongIcon from '../../assets/quiz/wrong.svg?react';

interface FeedbackBarProps {
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
  nextLabel?: string;
}

//채점 후 화면 하단에 뜨는 정답/오답 피드백 바 (해설 + 다음 버튼)
const FeedbackBar = ({
  isCorrect,
  explanation,
  onNext,
  nextLabel = 'NEXT',
}: FeedbackBarProps) => {
  const barRef = useRef<HTMLElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  //모바일에서는 하단에 고정되므로 바 높이만큼 자리를 비워 둠
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(() => {
      setBarHeight(bar.getBoundingClientRect().height);
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="lg:hidden"
        style={{ height: barHeight }}
      />
      <section
        ref={barRef}
        aria-live="polite"
        className="fixed inset-x-0 bottom-0 z-30 max-h-dvh w-full overflow-y-auto bg-gray-05 px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:static lg:max-h-none lg:overflow-visible lg:px-0 lg:py-7 lg:shadow-none"
      >
        <div className="mx-auto flex w-full max-w-251.5 flex-col gap-4 lg:flex-row lg:items-center lg:gap-15">
          <div className="flex flex-1 items-start gap-4 lg:items-center lg:gap-15">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-gray-20 bg-white lg:size-16">
              {isCorrect ? (
                <CorrectIcon className="size-8 text-green-65 lg:size-12" />
              ) : (
                <WrongIcon className="size-8 text-red-r lg:size-12" />
              )}
            </span>
            <div className="flex max-w-120.75 flex-col gap-1.5">
              <strong
                className={`text-base leading-5.5 font-bold ${isCorrect ? 'text-blue-70' : 'text-red-70'}`}
              >
                {isCorrect ? '정답입니다' : '오답입니다'}
              </strong>
              <p
                tabIndex={0}
                role="region"
                aria-label="해설"
                className="max-h-[30vh] overflow-y-auto text-sm leading-5.5 font-medium break-keep text-gray-60 lg:max-h-none lg:overflow-visible lg:text-base"
              >
                {explanation}
              </p>
            </div>
          </div>
          {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
          <button
            type="button"
            onClick={onNext}
            className="h-13 w-full shrink-0 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:h-16 lg:w-42"
          >
            {nextLabel}
          </button>
        </div>
      </section>
    </>
  );
};

export default FeedbackBar;
