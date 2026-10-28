import smallBell from '../../../assets/icons/small_bell.svg';
import greenCircle from '../../../assets/stock/green_circle.svg';

interface ScoreBadgeProps {
  value: string | number;
  isStock?: boolean;
}

const ScoreBadge = ({ value, isStock = false }: ScoreBadgeProps) => {
  return (
    <div className="flex items-center justify-center gap-2 border border-gray-20 bg-gray-05 px-3 py-2 rounded-lg w-30 ">
      {!isStock && (
        <img src={greenCircle} alt="" className="size-3 object-contain" />
      )}
      {value}
      {isStock && (
        <img src={smallBell} alt="방울" className="size-6 object-contain" />
      )}
    </div>
  );
};

export default ScoreBadge;
