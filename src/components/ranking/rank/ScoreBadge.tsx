import smallBell from '../../../assets/icons/small_bell.svg';

interface ScoreBadgeProps {
  value: string | number;
  isStock?: boolean;
}

const ScoreBadge = ({ value, isStock = false }: ScoreBadgeProps) => {
  return (
    <div className={`flex items-center gap-2 border px-3 py-2 rounded-lg ${isStock ? 'border-gray-20 bg-gray-05' : 'border-blue-60 bg-blue-05'}`}>
      {!isStock && <span className="h-3 w-3 rounded-full bg-gray-20" />}
      {value}
      {isStock && <img src={smallBell} alt="방울" className="size-4 object-contain" />}
    </div>
  );
};

export default ScoreBadge;
