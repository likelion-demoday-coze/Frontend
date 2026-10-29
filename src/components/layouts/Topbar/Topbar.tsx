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
    <header className="flex shrink-0 flex-nowrap items-center gap-1.5 text-xs sm:gap-3 sm:text-sm lg:gap-4 lg:text-base">
      <StatItem
        icon={<img src={streak_icon} alt="연속학습" className="size-5 shrink-0 object-contain sm:size-6 lg:size-9" />}
        label={streakDays === null ? '-' : `${streakDays}일`}
      ></StatItem>
      <StatItem
        icon={<img src={fishIcon} alt="FISH" className="size-5 shrink-0 object-contain sm:size-6 lg:size-9" />}
        label={fishBalance === null ? '-' : fishBalance.toLocaleString()}
      />
      <PassOrCashItem {...passOrCash} />
    </header>
  );
};

export default TopBar;
