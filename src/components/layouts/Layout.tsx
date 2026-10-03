import { Outlet, useLocation } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import TopBar from './Topbar/Topbar';

// 홈에서만 윗부분에 하늘색 배경을 깔 높이 (시안 기준 하늘색 영역 높이)
const HERO_BG_HEIGHT = 'h-[600px]';

const Layout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      {/* 사이드바 옆 전체 영역: 배경은 여기 기준으로 풀 폭 */}
      <div className="relative flex-1 overflow-x-hidden">
        {/* 홈 전용 하늘색 배경: 틀 바깥, 맨 뒤에 깔림 */}
        {isHome && (
          <div
            className={`absolute inset-x-0 top-0 -z-0 bg-blue-05 ${HERO_BG_HEIGHT}`}
            aria-hidden
          />
        )}

        {/* 본문 틀: 폭 제한 + 가운데 + 공통 패딩 (배경 위에 올라옴) */}
        <div className="relative mx-auto w-full max-w-360 px-6 pt-16 pb-10">
          <div className="absolute top-16 right-0">
            <TopBar
              streakDays={4}
              passOrCash={{ hasPass: true, remainingDays: 9 }}
            />
          </div>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
