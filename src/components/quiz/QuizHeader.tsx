import type { ReactNode } from 'react';
import dailyQuizTitle from '../../assets/quiz/title_daily_quiz.svg';
import timeAttackTitle from '../../assets/quiz/title_time_attack.svg';

type QuizMode = 'daily' | 'timeAttack';

interface QuizHeaderProps {
  mode: QuizMode;
  subtitle?: string;
  right?: ReactNode;
}

const titles: Record<QuizMode, { src: string; alt: string }> = {
  daily: { src: dailyQuizTitle, alt: 'Daily Quiz' },
  timeAttack: { src: timeAttackTitle, alt: 'Time Attack' },
};

//퀴즈 상단 헤더 (영문 제목 이미지 + 부제, 오른쪽에 진행 칩·카운트 칩)
const QuizHeader = ({ mode, subtitle, right }: QuizHeaderProps) => {
  const { src, alt } = titles[mode];
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 lg:gap-5">
        <h1>
          <img src={src} alt={alt} className="h-5 w-auto lg:h-auto" />
        </h1>
        {subtitle && (
          <span className="text-base font-medium text-gray-60 lg:text-xl">
            {subtitle}
          </span>
        )}
      </div>
      {right && <div className="flex items-center gap-3 lg:gap-5">{right}</div>}
    </header>
  );
};

export default QuizHeader;
