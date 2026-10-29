import type { ReactNode } from 'react';

interface StatItemProps {
  icon: ReactNode;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => {
  return (
    <div className="flex min-w-0 shrink items-center gap-0.5 whitespace-nowrap sm:gap-1 lg:shrink-0 lg:gap-2">
      {icon}
      <span className="shrink-0">{label}</span>
    </div>
  );
};

export default StatItem;
