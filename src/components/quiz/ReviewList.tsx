import { useState } from 'react';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import AnswerMark from './AnswerMark';

export interface ReviewItem {
  id: number;
  number: number;
  content: string;
  correct: boolean;
  correctOptionContent: string;
  explanation: string;
}

interface ReviewListProps {
  items: ReviewItem[];
}

//총정리 문제 목록 (누르면 해설이 펼쳐짐)
const ReviewList = ({ items }: ReviewListProps) => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `review-${item.id}`;
        return (
          <li
            key={item.id}
            className={`rounded-[20px] border-t border-gray-20 ${isOpen ? 'border-b bg-gray-05' : 'bg-white'}`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full cursor-pointer items-start gap-3 px-2.5 py-5 text-left lg:items-center lg:gap-9"
            >
              <span className="flex shrink-0 items-center gap-3">
                <span className="w-7 text-center text-base font-semibold text-blue-60">
                  {item.number}
                </span>
                <AnswerMark isCorrect={item.correct} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-9">
                <span
                  className={`min-w-0 flex-1 text-base leading-6.5 font-semibold ${isOpen ? 'text-gray-80' : 'truncate text-gray-60'}`}
                >
                  Q. {item.content}
                </span>
                <span className="flex shrink-0 items-center gap-4 lg:w-52">
                  <span className="shrink-0 text-sm font-medium text-gray-60">
                    정답
                  </span>
                  <span className="text-base font-semibold break-keep text-green-80">
                    {item.correctOptionContent}
                  </span>
                </span>
              </span>
              <ArrowIcon
                aria-hidden="true"
                className={`h-4 w-2 shrink-0 self-center text-gray-40 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            {isOpen && (
              <div id={panelId} className="px-2.5 pb-5 lg:pl-26">
                <p className="max-w-150 rounded-[20px] border border-gray-20 bg-white px-8 py-5 text-sm leading-5 font-medium break-keep text-gray-60">
                  {item.explanation}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ReviewList;
