interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

const PageTitleSection = ({
  title,
  description,
  className = '',
}: PageTitleProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-[28px] font-semibold">{title}</h1>
      {description && <p className="text-[18px] text-gray-60">{description}</p>}
    </div>
  );
};

export default PageTitleSection;
