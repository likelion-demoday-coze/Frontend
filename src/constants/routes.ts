import type { RankingType } from '../types/ranking';

export const ROUTES = {
  LANDING: '/',
  HOME: '/home',
  SIGNUP: '/signup', //백엔드가 신규 회원을 보내는 경로

  //온보딩
  ONBOARDING_TERMS: '/onboarding/terms',
  ONBOARDING_NICKNAME: '/onboarding/nickname',
  ONBOARDING_TUTORIAL: '/onboarding/tutorial',

  //맛보기 퀴즈 (비로그인)
  TRY: '/try',

  //문제풀이
  QUIZ: '/quiz',
  DAILY_QUIZ: '/quiz/daily',
  DAILY_QUIZ_PLAY: '/quiz/daily/:sessionId',
  DAILY_QUIZ_REVIEW: '/quiz/daily/:sessionId/review',
  DAILY_QUIZ_RESULT: '/quiz/daily/:sessionId/result',
  TIME_ATTACK: '/quiz/time-attack',
  TIME_ATTACK_PLAY: '/quiz/time-attack/:sessionId',
  TIME_ATTACK_RESULT: '/quiz/time-attack/:sessionId/result',

  //랭킹 (?tab=regular | afterhours)
  RANKING: '/ranking',

  //마이페이지
  MYPAGE: '/mypage',
  MYPAGE_POLICY: '/mypage/policy',
  MYPAGE_SUPPORT: '/mypage/support',
  MYPAGE_WITHDRAW: '/mypage/withdraw',

  //상점
  SHOP: '/shop',
  PAYMENT_SUCCESS: '/shop/payment/success',
  PAYMENT_FAIL: '/shop/payment/fail',
} as const;

export const toDailyQuizPlay = (sessionId: number) =>
  `/quiz/daily/${sessionId}`;
export const toDailyQuizReview = (sessionId: number) =>
  `/quiz/daily/${sessionId}/review`;
export const toDailyQuizResult = (sessionId: number) =>
  `/quiz/daily/${sessionId}/result`;
export const toTimeAttackPlay = (sessionId: number) =>
  `/quiz/time-attack/${sessionId}`;
export const toTimeAttackResult = (sessionId: number) =>
  `/quiz/time-attack/${sessionId}/result`;
export const toRanking = (tab: RankingType) => `/ranking?tab=${tab}`;
