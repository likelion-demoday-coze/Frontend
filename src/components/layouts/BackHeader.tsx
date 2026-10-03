import { useNavigate } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/arrow.svg?react';

interface BackHeaderProps {
  title: string;
  backTo: string;
}

//뒤로가기 헤더
const BackHeader = ({ title, backTo }: BackHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 bg-white px-4 lg:h-15 lg:gap-5.5 lg:px-33.5">
      <button
        type="button"
        onClick={() => navigate(backTo)}
        aria-label="뒤로 가기"
        className="flex cursor-pointer items-center text-black"
      >
        <ArrowIcon aria-hidden="true" className="h-8 w-4 rotate-180" />
      </button>
      <h1 className="text-lg leading-9 font-bold text-black lg:text-xl">
        {title}
      </h1>
    </header>
  );
};

export default BackHeader;
