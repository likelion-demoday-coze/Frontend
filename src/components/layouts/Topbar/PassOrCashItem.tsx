import StatItem from './StatItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import pass_icon from '../../../assets/navbar/pass_icon.svg';

const PassOrCashItem = (props: PassOrCash) => {
  if (!props.hasPass) return null;
  return (
    <StatItem
      icon={
        <img
          src={pass_icon}
          alt="패스"
          className="mr-1 size-7 min-w-4 shrink object-contain sm:size-8 sm:shrink-0 lg:mr-0 lg:size-9 font-bold"
        />
      }
      label={`${props.remainingDays}일 남음`}
    />
  );
};

export default PassOrCashItem;
