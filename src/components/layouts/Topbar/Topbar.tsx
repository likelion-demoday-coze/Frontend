import StatItem from './StatItem';
import PassOrCashItem from './PassOrCashItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import streak_icon from '../../../assets/navbar/streak_icon.svg';

interface TopBarProps {
  streakDays: number;
  passOrCash: PassOrCash;
}

const TopBar = ({ streakDays, passOrCash }: TopBarProps) => {
  return (
    <header className="flex gap-4">
      <StatItem
        icon={<img src={streak_icon} />}
        label={`${streakDays}일`}
      ></StatItem>
      <PassOrCashItem {...passOrCash} />
    </header>
  );
};

export default TopBar;
