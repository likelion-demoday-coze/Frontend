import type { ReactNode } from 'react';

interface StatItemProps {
  icon: ReactNode;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => {
  return (
    <div className="flex gap-2 items-center">
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default StatItem;
