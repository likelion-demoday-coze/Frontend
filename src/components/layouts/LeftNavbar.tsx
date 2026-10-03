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
    <aside className="sticky top-0 flex w-49.5 shrink-0 flex-col border-r border-gray-20 h-screen px-4.5 py-8 gap-6.5">
      <Link to="/home">
        <img src={textlogo} alt="COZ:E" />
      </Link>
      <nav className="flex flex-col gap-5">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
              `flex items-center gap-3 text-[18px] ${isActive ? 'font-bold text-blue-60' : 'text-gray-60'}`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            <div>{label}</div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
export default LeftNavbar;
