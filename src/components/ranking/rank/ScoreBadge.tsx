interface ScoreBadgeProps {
  value: string | number;
}

const ScoreBadge = ({ value }: ScoreBadgeProps) => {
  return (
    <div className="flex items-center gap-2 border border-blue-60 bg-blue-05">
      <span className="h-3 w-3 rounded-full" />
      {value}
    </div>
  );
};

export default ScoreBadge;
