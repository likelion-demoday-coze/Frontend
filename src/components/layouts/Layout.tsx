import { Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';
import TopBar from './Topbar/Topbar';

//임시값 넣어둠
const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      <div className="flex flex-1 flex-col">
        <TopBar
          streakDays={4}
          passOrCash={{ hasPass: true, remainingDays: 9 }}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
