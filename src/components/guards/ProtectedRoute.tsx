import { Navigate, Outlet } from 'react-router-dom';
import useAuthstore from '../../stores/useAuthStore';

//토큰 없는 상태에선 로그인 페이지로 리다이랙트

function ProtectedRoute() {
  const accessToken = useAuthstore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  //있으면 그대로 렌더링
  return <Outlet />;
}

export default ProtectedRoute;
