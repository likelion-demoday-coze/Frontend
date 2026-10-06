import type { TrendItem } from '../../../types/trend';
import { Card } from '../../common/Card';

type TrendCardProps = Omit<TrendItem, 'id'>;

const MAX_TITLE_LENGTH = 35;

const TrendCard = ({ category, title }: TrendCardProps) => {
  const shortTitle =
    title.length > MAX_TITLE_LENGTH
      ? `${title.slice(0, MAX_TITLE_LENGTH)}…`
      : title;

  return (
    <Card className="flex flex-col justify-end bg-gray-05  px-4 h-55.75 py-12.5">
      <div className="text-[16px] text-gray-60">{category}</div>
      <div className="text-[16px] text-black font-semibold">{shortTitle}</div>
    </Card>
  );
};

export default TrendCard;
