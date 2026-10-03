import fishIcon from '../../assets/icons/fish.png';

interface Attempt {
  used: number;
  limit: number;
}

interface ModeCardProps {
  title: string;
  subtitle: string;
  description: string;
  fishCost: number;
  fishBalance: number;
  isPass: boolean;
  attempt?: Attempt;
  exhaustedMessage: string;
  selected: boolean;
  onSelect: () => void;
}

//모드 선택 카드
const ModeCard = ({
  title,
  subtitle,
  description,
  fishCost,
  fishBalance,
  isPass,
  attempt,
  exhaustedMessage,
  selected,
  onSelect,
}: ModeCardProps) => {
  const isFishShort = !isPass && fishBalance < fishCost;
  const isExhausted = !!attempt && attempt.used >= attempt.limit;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full cursor-pointer flex-col justify-between gap-8 rounded-[20px] border bg-white px-6 py-5 text-left lg:w-79 lg:gap-33.5 lg:px-8 lg:py-6 ${selected ? 'border-blue-50 shadow-[0_0_4px_var(--color-blue-50)]' : 'border-gray-20'}`}
    >
      <div className="flex flex-col gap-6 lg:gap-10.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <strong className="text-2xl leading-9 font-bold text-black lg:text-[28px]">
              {title}
            </strong>
            <span className="text-base leading-6.5 font-semibold text-gray-60 lg:text-lg">
              {subtitle}
            </span>
          </div>
          {/*TODO: 모드 아이콘 디자인 나오면 교체*/}
          <span
            aria-hidden="true"
            className="size-16 shrink-0 rounded-[20px] bg-gray-10 lg:size-20"
          />
        </div>
        <p className="text-base leading-6.5 font-medium break-keep text-gray-60 lg:text-lg">
          {description}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center text-base leading-6.5 font-semibold text-blue-70 lg:text-lg">
            <img src={fishIcon} alt="" className="size-9 object-contain" />
            {isPass ? '패스 사용 중' : `${fishCost}개 소모`}
          </span>
          {isFishShort && (
            <span className="text-sm leading-5 font-medium text-red-55">
              fish가 부족합니다
            </span>
          )}
        </div>
        {attempt && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-base leading-6.5 font-semibold text-blue-70 lg:text-lg">
              {/*TODO: 횟수 아이콘 디자인 나오면 교체*/}
              <span
                aria-hidden="true"
                className="size-9 rounded-sm bg-gray-10"
              />
              {attempt.used}/{attempt.limit}회
            </span>
            {isExhausted && (
              <span className="text-right text-sm leading-5 font-medium break-keep whitespace-pre-line text-red-55">
                {exhaustedMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default ModeCard;
