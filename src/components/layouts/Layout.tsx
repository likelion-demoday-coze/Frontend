import { Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import TopBar from './Topbar/Topbar';

//임시값 넣어둠
const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      <div className="flex-1 overflow-x-hidden">
        {/* 본문 틀: 폭 제한 + 가운데 + 공통 패딩 */}
        <div className="relative mx-auto w-full max-w-360 px-6 pt-16 pb-10">
          <div className="absolute top-16 right-33.25">
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
