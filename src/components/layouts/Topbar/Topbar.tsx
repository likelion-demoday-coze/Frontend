import StatItem from './StatItem';
import PassOrCashItem from './PassOrCashItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import streak_icon from '../../../assets/navbar/streak_icon.svg';
import fishIcon from '../../../assets/store/Fish_a.svg';
import { ROUTES } from '../../../constants/routes';

interface TopBarProps {
  streakDays: number | null;
  fishBalance: number | null;
  passOrCash: PassOrCash;
}

const TopBar = ({ streakDays, fishBalance, passOrCash }: TopBarProps) => {
  return (
    <header className="flex min-w-0 shrink flex-nowrap items-center gap-2.5 text-sm sm:gap-4 sm:text-[15px] lg:shrink-0 lg:gap-4 lg:text-base">
      <StatItem
        to={ROUTES.MYPAGE}
        icon={<img src={streak_icon} alt="연속학습" className="mr-1 size-7 min-w-4 shrink object-contain sm:size-8 sm:shrink-0 lg:mr-0 lg:size-9" />}
        label={streakDays === null ? '-' : `${streakDays}일`}
      ></StatItem>
      <StatItem
        to={ROUTES.SHOP}
        icon={<img src={fishIcon} alt="FISH" className="-mr-0.5 size-8 min-w-4 shrink object-contain sm:-mr-1 sm:size-9 sm:shrink-0 lg:mr-0 lg:size-9" />}
        label={fishBalance === null ? '-' : fishBalance.toLocaleString()}
      />
      <PassOrCashItem {...passOrCash} />
    </header>
  );
};

export default TopBar;
