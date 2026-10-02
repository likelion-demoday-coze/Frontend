import { Link } from 'react-router-dom';

interface SectionTitleProps {
  title: string;
  subtitle?: string; // 제목 옆 작은 글씨
  linkTo?: string; // 있으면 오른쪽에 링크표시(주소)
  linkLabel?: string;
}

const SectionTitle = ({
  title,
  subtitle,
  linkTo,
  linkLabel = '전체 보기',
}: SectionTitleProps) => (
  <div className="flex items-baseline justify-between">
    <div className="flex items-baseline gap-3">
      <h2 className="text-[20px] font-semibold">{title}</h2>
      {subtitle && <span className="text-[14px] text-gray-60">{subtitle}</span>}
    </div>
    {linkTo && (
      <Link to={linkTo} className="text-[14px] font-semibold text-blue-60">
        {linkLabel} ›
      </Link>
    )}
  </div>
);

export default SectionTitle;
