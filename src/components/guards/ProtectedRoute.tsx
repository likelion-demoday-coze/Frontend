import { Navigate, Outlet } from 'react-router-dom';
import useAuthstore from '../../stores/useAuthStore';

//토큰 없는 상태에선 로그인 페이지로 리다이랙트

function ProtectedRoute() {
  const member = useAuthstore((state) => state.member);
  const isInitialized = useAuthstore((state) => state.isInitialized);

  //앱 시작 시 서버에 세션 확인 중에는 판단 보류
  if (!isInitialized) {
    return null;
  }

  if (!member) {
    return <Navigate to="/" replace />;
  }

  //로그인 상태면 그대로
  return <Outlet />;
}

export default ProtectedRoute;
