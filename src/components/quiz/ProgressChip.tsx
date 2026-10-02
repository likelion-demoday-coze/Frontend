interface ProgressChipProps {
  current: number;
  total: number;
}

//현재 문제 번호 칩 (예: 1/5)
const ProgressChip = ({ current, total }: ProgressChipProps) => {
  return (
    <span
      aria-label={`${total}문제 중 ${current}번째`}
      className="inline-flex h-9 min-w-15 items-center justify-center rounded-lg border border-blue-60 bg-blue-05 px-2.5 text-base font-medium tracking-[0.16em] text-blue-60 lg:h-11 lg:min-w-19 lg:px-3 lg:text-xl"
    >
      {current}/{total}
    </span>
  );
};

export default ProgressChip;
