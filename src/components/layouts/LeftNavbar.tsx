import { NavLink, Link } from 'react-router-dom';

import UserIcon from '../../assets/navbar/user.svg?react';
import HomeIcon from '../../assets/navbar/home.svg?react';
import QuestionIcon from '../../assets/navbar/question.svg?react';
import StoreIcon from '../../assets/navbar/store.svg?react';
import ChartIcon from '../../assets/navbar/chart.svg?react';

import textlogo from '../../assets/logos/coze_text_logo_black.svg';

const menuItems = [
  { to: '/home', label: '홈', icon: HomeIcon },
  { to: '/quiz', label: '문제 풀이', icon: QuestionIcon },
  { to: '/ranking', label: '랭킹', icon: ChartIcon },
  { to: '/mypage', label: '마이페이지', icon: UserIcon },
  { to: '/shop', label: '상점', icon: StoreIcon },
];

const LeftNavbar = () => {
  return (
    <aside className="sticky top-0 hidden h-dvh w-49.5 shrink-0 flex-col gap-6.5 overflow-y-auto border-r border-gray-20 px-4.5 py-8 lg:flex">
      <Link to="/home">
        <img src={textlogo} alt="COZ:E" />
      </Link>

      <nav aria-label="주 메뉴" className="flex flex-col gap-5">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg py-2 text-[18px] ${isActive ? 'font-bold text-blue-60' : 'text-gray-60'}`
            }
          >
            <Icon aria-hidden="true" className="size-4.5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default LeftNavbar;
