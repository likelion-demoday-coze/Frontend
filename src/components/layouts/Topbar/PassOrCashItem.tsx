import StatItem from './StatItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import pass_icon from '../../../assets/navbar/pass_icon.svg';

const PassOrCashItem = (props: PassOrCash) => {
  if (!props.hasPass) return null;
  return (
    <StatItem
      icon={<img src={pass_icon} alt="패스" className="size-5 shrink-0 object-contain sm:size-6 lg:size-9" />}
      label={`${props.remainingDays}일 남음`}
    />
  );
};

export default PassOrCashItem;
