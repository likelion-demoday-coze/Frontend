import StatItem from './StatItem';
import type { PassOrCash } from '../../../types/PassOrCash';

const PassOrCashItem = (props: PassOrCash) => {
  return (
    <StatItem
      icon={<div className="h-8 w-8 rounded bg-gray-20" />}
      label={
        props.hasPass
          ? `${props.remainingDays}일 남음`
          : props.cash.toLocaleString()
      }
    />
  );
};

export default PassOrCashItem;
