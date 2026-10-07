import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string; //여백, 크기 등 카드마다 다른 것만 바깥에서 추가 가능
  onClick?: () => void;
}
export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-gray-20 ${className}`}
    >
      {children}
    </div>
  );
};
