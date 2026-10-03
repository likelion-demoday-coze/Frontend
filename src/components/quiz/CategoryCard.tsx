interface CategoryCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

//카테고리 카드
const CategoryCard = ({
  label,
  description,
  selected,
  onSelect,
}: CategoryCardProps) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex h-full w-full cursor-pointer flex-col items-center gap-3 rounded-[20px] border bg-white px-3 py-4 lg:px-5 ${selected ? 'border-blue-50 shadow-[0_0_4px_var(--color-blue-50)]' : 'border-gray-20'}`}
    >
      {/*TODO: 카테고리 아이콘 디자인 나오면 교체*/}
      <span
        aria-hidden="true"
        className="size-16 rounded-[20px] bg-gray-10 lg:size-20"
      />
      <strong
        className={`text-xl leading-9 lg:text-2xl ${selected ? 'font-bold text-blue-60' : 'font-semibold text-black'}`}
      >
        {label}
      </strong>
      <span className="max-w-42.25 text-sm leading-6 font-medium break-keep text-gray-60 lg:text-base">
        {description}
      </span>
    </button>
  );
};

export default CategoryCard;
