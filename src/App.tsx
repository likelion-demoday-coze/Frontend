import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/guards/ProtectedRoute';

import LoginPage from './pages/LoginPage';

import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        {/*로그인 안하면 로그인 페이지로 쫓겨나는 가드*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<MyPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
