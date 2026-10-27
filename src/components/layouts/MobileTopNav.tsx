import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const items = [
  { to: ROUTES.HOME, label: '홈' },
  { to: ROUTES.QUIZ, label: '문제풀이' },
  { to: ROUTES.RANKING, label: '랭킹' },
  { to: ROUTES.MYPAGE, label: '마이페이지' },
  { to: ROUTES.SHOP, label: '상점' },
];

const MobileTopNav = ({ topOffset = 0 }: { topOffset?: number }) => (
  <nav
    aria-label="주 메뉴"
    style={{ top: topOffset }}
    className="sticky z-40 grid grid-cols-5 border-b border-gray-20 bg-white px-3 lg:hidden"
  >
    {items.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        end={to === ROUTES.HOME}
        onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
        className={({ isActive }) =>
          `flex h-14 min-w-0 items-center justify-center border-b-2 px-1 text-[14px] whitespace-nowrap sm:text-[14px] ${isActive ? 'border-black font-bold text-black' : 'border-transparent text-gray-60'}`
        }
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default MobileTopNav;
