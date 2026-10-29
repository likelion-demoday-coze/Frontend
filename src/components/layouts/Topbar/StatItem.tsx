import type { ReactNode } from 'react';

interface StatItemProps {
  icon: ReactNode;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => {
  return (
    <div className="flex shrink-0 items-center gap-0.5 whitespace-nowrap sm:gap-1 lg:gap-2">
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default StatItem;
