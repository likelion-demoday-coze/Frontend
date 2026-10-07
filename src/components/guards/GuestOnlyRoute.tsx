import { Navigate, Outlet } from 'react-router-dom';
import useAuthstore from '../../stores/useAuthStore';
import { ROUTES } from '../../constants/routes';

const GuestOnlyRoute = () => {
  const member = useAuthstore((state) => state.member);
  const isInitialized = useAuthstore((state) => state.isInitialized);

  //새로고침 직후에는 서버의 로그인 확인이 끝날때까지 기다려야함
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        로그인 상태 확인 중...
      </div>
    );
  }

  // 로그인한 사용자는 홈으로 이동
  if (member) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 비로그인 사용자는 아래에 연결된 페이지 렌더링
  return <Outlet />;
};

export default GuestOnlyRoute;
