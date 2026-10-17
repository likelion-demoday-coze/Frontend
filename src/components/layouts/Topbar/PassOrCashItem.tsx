import StatItem from './StatItem';
import type { PassOrCash } from '../../../types/PassOrCash';
import pass_icon from '../../../assets/navbar/pass_icon.svg';

const PassOrCashItem = (props: PassOrCash) => {
  return (
    <StatItem
      icon={<img src={pass_icon} />}
      label={
        props.hasPass
          ? `${props.remainingDays}일 남음`
          : props.cash.toLocaleString()
      }
    />
  );
};

export default PassOrCashItem;
