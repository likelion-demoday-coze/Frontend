import StatItem from './StatItem';
import PassOrCashItem from './PassOrCashItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import streak_icon from '../../../assets/navbar/streak_icon.svg';
import fishIcon from '../../../assets/store/Fish_a.svg';

interface TopBarProps {
  streakDays: number | null;
  fishBalance: number | null;
  passOrCash: PassOrCash;
}

const TopBar = ({ streakDays, fishBalance, passOrCash }: TopBarProps) => {
  return (
    <header className="flex gap-4">
      <StatItem
        icon={<img src={streak_icon} />}
        label={streakDays === null ? '-' : `${streakDays}일`}
      ></StatItem>
      <StatItem
        icon={<img src={fishIcon} alt="FISH" className="size-9 object-contain" />}
        label={fishBalance === null ? '-' : fishBalance.toLocaleString()}
      />
      <PassOrCashItem {...passOrCash} />
    </header>
  );
};

export default TopBar;
