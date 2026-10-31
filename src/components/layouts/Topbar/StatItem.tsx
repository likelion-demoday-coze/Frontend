import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StatItemProps {
  icon: ReactNode;
  label: string;
  to: string;
}

const StatItem = ({ icon, label, to }: StatItemProps) => {
  return (
    <Link to={to} className="flex min-w-0 shrink items-center gap-0.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60 sm:gap-1 lg:shrink-0 lg:gap-2">
      {icon}
      <span className="shrink-0 font-bold">{label}</span>
    </Link>
  );
};

export default StatItem;
