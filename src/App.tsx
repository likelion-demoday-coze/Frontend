import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getMe } from './api/auth';
import useAuthstore from './stores/useAuthStore';
import { fetchCsrfToken } from './api/axiosInstance';

import ProtectedRoute from './components/guards/ProtectedRoute';
import GuestOnlyRoute from './components/guards/GuestOnlyRoute';
import useServiceOpen from './hooks/useServiceOpen';

import LandingPage from './pages/Auth/LandingPage';
import SignupPage from './pages/Auth/SignupPage';
import ComingSoonPage from './pages/ComingSoonPage';

import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';

import Layout from './components/layouts/Layout';
import RankingPage from './pages/RankingPage';
import ShopPage from './pages/ShopPage';
import FullScreenLayout from './components/layouts/FullScreenLayout';

import { ROUTES } from './constants/routes';
import TryQuizPage from './pages/Try/TryQuizPage';
import QuizModePage from './pages/Quiz/QuizModePage';
import DailyCategoryPage from './pages/Quiz/Daily/DailyCategoryPage';
import DailyQuizPlayPage from './pages/Quiz/Daily/DailyQuizPlayPage';
import DailyQuizReviewPage from './pages/Quiz/Daily/DailyQuizReviewPage';
import DailyQuizResultPage from './pages/Quiz/Daily/DailyQuizResultPage';
import TimeAttackEntryPage from './pages/Quiz/TimeAttack/TimeAttackEntryPage';
import TimeAttackPlayPage from './pages/Quiz/TimeAttack/TimeAttackPlayPage';
import TimeAttackResultPage from './pages/Quiz/TimeAttack/TimeAttackResultPage';
import PaymentResultPage from './pages/payment/PaymentResultPage';

function App() {
  const isOpen = useServiceOpen();
  //새로고침 시 로그인 상태인지 서버에 물어보고, 내정보 저장
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
        <Route element={<GuestOnlyRoute />}>
          <Route path={ROUTES.LANDING} element={<LandingPage />}></Route>
          {/* 오픈 전에는 가입 화면 대신 커밍순으로 이동 */}
          <Route
            path={ROUTES.SIGNUP}
            element={
              isOpen ? (
                <SignupPage />
              ) : (
                <Navigate to={ROUTES.COMINGSOON} replace />
              )
            }
          />
          <Route
            path={ROUTES.COMINGSOON}
            element={isOpen ? <LandingPage /> : <ComingSoonPage />}
          />
        </Route>

        {/*맛보기 퀴즈: 비로그인 공개*/}
        <Route path={ROUTES.TRY} element={<TryQuizPage />} />

        {/*로그인 안하면 로그인 페이지로 쫓겨나는 가드*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<HomePage />}></Route>

            <Route path={ROUTES.MYPAGE} element={<MyPage />}></Route>

            <Route path={ROUTES.RANKING} element={<RankingPage />}></Route>
            <Route path={ROUTES.SHOP} element={<ShopPage />}></Route>

            {/*문제풀이 (GNB 있는 화면)*/}
            <Route path={ROUTES.QUIZ} element={<QuizModePage />} />
            <Route
              path={ROUTES.DAILY_QUIZ_PLAY}
              element={<DailyQuizPlayPage />}
            />
            <Route
              path={ROUTES.TIME_ATTACK}
              element={<TimeAttackEntryPage />}
            />
            <Route
              path={ROUTES.TIME_ATTACK_PLAY}
              element={<TimeAttackPlayPage />}
            />
          </Route>

          {/*문제풀이 (로고만 있는 전체 화면)*/}
          <Route element={<FullScreenLayout />}>
            <Route
              path={ROUTES.PAYMENT_RESULT}
              element={<PaymentResultPage />}
            />
            <Route
              path={ROUTES.PAYMENT_SUCCESS}
              element={<PaymentResultPage />}
            />
            <Route path={ROUTES.PAYMENT_FAIL} element={<PaymentResultPage />} />
            <Route path={ROUTES.DAILY_QUIZ} element={<DailyCategoryPage />} />
            <Route
              path={ROUTES.DAILY_QUIZ_REVIEW}
              element={<DailyQuizReviewPage />}
            />
            <Route
              path={ROUTES.DAILY_QUIZ_RESULT}
              element={<DailyQuizResultPage />}
            />
            <Route
              path={ROUTES.TIME_ATTACK_RESULT}
              element={<TimeAttackResultPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
