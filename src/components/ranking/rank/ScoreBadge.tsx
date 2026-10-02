interface ScoreBadgeProps {
  value: string | number;
}

const ScoreBadge = ({ value }: ScoreBadgeProps) => {
  return (
    <div className="flex items-center gap-2 border border-blue-60 bg-blue-05 px-3 py-2 rounded-lg">
      <span className="h-3 w-3 rounded-full bg-gray-20" />
      {value}
    </div>
  );
};

export default ScoreBadge;
