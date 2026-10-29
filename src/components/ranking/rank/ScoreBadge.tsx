import smallBell from '../../../assets/icons/small_bell.svg';
import greenCircle from '../../../assets/stock/green_circle.svg';

interface ScoreBadgeProps {
  value: string | number;
  isStock?: boolean;
}

const ScoreBadge = ({ value, isStock = false }: ScoreBadgeProps) => {
  return (
    <div className="flex h-9 w-26 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-gray-20 bg-gray-05 px-2 text-sm tabular-nums lg:h-10 lg:w-30 lg:text-base">
      {!isStock && (
        <img
          src={greenCircle}
          alt=""
          className="size-3 shrink-0 object-contain"
        />
      )}
      <span className="shrink-0">{value}</span>
      {isStock && (
        <img
          src={smallBell}
          alt="방울"
          className="size-4 shrink-0 object-contain lg:size-6"
        />
      )}
    </div>
  );
};

export default ScoreBadge;
