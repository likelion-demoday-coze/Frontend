import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { getMe } from './api/auth';
import useAuthstore from './stores/useAuthStore';
import { fetchCsrfToken } from './api/axiosInstance';

import ProtectedRoute from './components/guards/ProtectedRoute';

import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';

function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await fetchCsrfToken();
        const me = await getMe();
        useAuthstore.getState().setMember(me);
      } catch {
        useAuthstore.getState().clearAuth();
      } finally {
        useAuthstore.getState().setInitialized();
      }
    };
    init();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        {/*로그인 안하면 로그인 페이지로 쫓겨나는 가드*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<MyPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
