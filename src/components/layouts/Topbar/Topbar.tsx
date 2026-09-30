import StatItem from './StatItem';
import PassOrCashItem from './PassOrCashItem';
import type { PassOrCash } from '../../../types/PassOrCash';

interface TopBarProps {
  streakDays: number;
  passOrCash: PassOrCash;
}

const TopBar = ({ streakDays, passOrCash }: TopBarProps) => {
  return (
    <header className="flex justify-end gap-4 px-8 py-4">
      <StatItem
        icon={<div className="h-8 w-8 rounded bg-gray-20" />}
        label={`${streakDays}일`}
      ></StatItem>
      <PassOrCashItem {...passOrCash} />
    </header>
  );
};

export default TopBar;
