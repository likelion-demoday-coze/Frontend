import type { ReactNode } from 'react';

interface ProgressBarProps {
  percent: number;
  children?: ReactNode;
  className?: string;
}
export const ProgressBar = ({
  percent,
  children,
  className = '',
}: ProgressBarProps) => {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div className={`relative h-px bg-gray-20 ${className}`}>
      {/* 채워진 부분: 왼쪽 끝 ~ 내 위치 */}
      <div
        className="absolute top-0 left-0 h-px bg-blue-60"
        style={{ width: `${value}%` }}
      />
      {/* 끝점 동그라미 */}
      <span className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-20" />

      {/* 내 위치 마커 */}
      <div
        className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
        //왼쪽 끝에서 떨어져 있는 정도
        style={{ left: `${value}%` }}
      >
        <span className="h-2 w-2 -translate-y-1/2 rounded-full bg-blue-60" />
        {children}
      </div>
    </div>
  );
};
