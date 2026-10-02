//범용 토글

interface TapToggleProps<T extends string> {
  tabs: readonly { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}

const TapToggle = <T extends string>({
  tabs,
  value,
  onChange,
}: TapToggleProps<T>) => (
  <div className="flex w-fit rounded-full bg-gray-05">
    {tabs.map(({ key, label }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`rounded-full flex gap-2 px-6 py-2 text-[14px] font-bold cursor-pointer ${value === key ? 'bg-white border border-blue-60 text-blue-60' : 'text-gray-60'}`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default TapToggle;
