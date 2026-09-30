import { Outlet } from 'react-router-dom';
import LeftNavbar from './LeftNavbar';

const Layout = () => {
  return (
    <div className="flex">
      <LeftNavbar />
      <Outlet />
    </div>
  );
};
export default Layout;
