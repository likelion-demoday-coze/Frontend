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

import Layout from './components/layouts/Layout';
import RankingPage from './pages/RankingPage';
import ShopPage from './pages/ShopPage';
import FullScreenLayout from './components/layouts/FullScreenLayout';

import { ROUTES } from './constants/routes';
import TermsPage from './pages/Onboarding/TermsPage';
import NicknamePage from './pages/Onboarding/NicknamePage';
import TutorialPage from './pages/Onboarding/TutorialPage';
import TryQuizPage from './pages/Try/TryQuizPage';
import QuizModePage from './pages/Quiz/QuizModePage';
import DailyCategoryPage from './pages/Quiz/Daily/DailyCategoryPage';
import DailyQuizPlayPage from './pages/Quiz/Daily/DailyQuizPlayPage';
import DailyQuizReviewPage from './pages/Quiz/Daily/DailyQuizReviewPage';
import DailyQuizResultPage from './pages/Quiz/Daily/DailyQuizResultPage';
import TimeAttackEntryPage from './pages/Quiz/TimeAttack/TimeAttackEntryPage';
import TimeAttackPlayPage from './pages/Quiz/TimeAttack/TimeAttackPlayPage';
import TimeAttackResultPage from './pages/Quiz/TimeAttack/TimeAttackResultPage';

function App() {
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
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        {/*온보딩: 가입 완료 전이라 member가 없으므로 가드 밖에 둠*/}
        <Route path={ROUTES.ONBOARDING_TERMS} element={<TermsPage />} />
        <Route path={ROUTES.ONBOARDING_NICKNAME} element={<NicknamePage />} />
        <Route path={ROUTES.ONBOARDING_TUTORIAL} element={<TutorialPage />} />
        {/*맛보기 퀴즈: 비로그인 공개*/}
        <Route path={ROUTES.TRY} element={<TryQuizPage />} />
        {/*로그인 안하면 로그인 페이지로 쫓겨나는 가드*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />}></Route>

            <Route path="/mypage" element={<MyPage />}></Route>
            <Route path="/ranking" element={<RankingPage />}></Route>
            <Route path="/shop" element={<ShopPage />}></Route>

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
