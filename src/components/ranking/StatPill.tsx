interface StatPillProps {
  label: string;
  value: string;
}

const StatPill = ({ label, value }: StatPillProps) => (
  <li className="flex items-center rounded-2xl gap-3 border border-blue-60 px-5 py-2 h-14">
    <div className="h-8 w-8 rounded-full bg-gray-20" />
    <span className="flex-1 font-semibold text-[16px] text-gray-60">
      {label}
    </span>
    <span className=" text-blue-60">{value}</span>
  </li>
);

export default StatPill;
