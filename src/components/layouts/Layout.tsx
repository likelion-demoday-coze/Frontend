import { Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <LeftNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
