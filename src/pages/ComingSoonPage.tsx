import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import comingSoonBackground from '../assets/onboarding/commingsoon/comming_bg.svg';
import comingSoonMobileBackground from '../assets/onboarding/commingsoon/coming_bg_mobild.svg';
import logo from '../assets/logos/coze_text_logo_black.svg';
import kakaoLogo from '../assets/landing/kakao_login_logo.svg';
import instagramLogo from '../assets/landing/instagram.svg';
import StockGrowthSection from '../components/landing/StockGrowthSection';
import DailyQuizSection from '../components/landing/DailyQuizSection';
import TimeAttackSection from '../components/landing/TimeAttackSection';
import GrowthRewardSection from '../components/landing/GrowthRewardSection';
import EconomicRoutineSection from '../components/landing/EconomicRoutineSection';
import FaqSection from '../components/landing/FaqSection';
import ComingSoonClosingSection from '../components/landing/ComingSoonClosingSection';
import LandingFooter from '../components/landing/LandingFooter';
import { OPEN_AT } from '../constants/launch';

const CommingSoonPage = () => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((OPEN_AT - Date.now()) / 1000))
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((OPEN_AT - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = [
    { value: Math.floor(remaining / 86400), unit: '일' },
    { value: Math.floor((remaining % 86400) / 3600), unit: '시간' },
    { value: Math.floor((remaining % 3600) / 60), unit: '분' },
    { value: remaining % 60, unit: '초' },
  ];

  return (
    <div className="bg-white">
      <main className="relative isolate flex min-h-[max(100svh,760px)] w-full flex-col overflow-hidden bg-white sm:block sm:min-h-dvh">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-no-repeat sm:block"
          style={{
            backgroundImage: `url(${comingSoonBackground})`,
            backgroundPosition: 'center clamp(100px, 14dvh, 160px)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-bottom bg-no-repeat sm:hidden"
          style={{ backgroundImage: `url(${comingSoonMobileBackground})` }}
        />
        <header className="mx-auto grid w-full max-w-320 shrink-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-4 sm:flex sm:flex-nowrap sm:justify-between sm:gap-x-6 sm:gap-y-4 sm:px-6 sm:py-6 lg:px-10">
          <div className="contents sm:flex sm:min-w-0 sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
            <img src={logo} alt="COZ:E" className="h-5 w-auto shrink-0 sm:h-6" />
            <p className="order-3 col-span-2 flex items-center gap-1 text-[10px] text-gray-40 sm:order-none sm:text-[11px]">
              <Info aria-hidden="true" className="size-3.5 shrink-0" />
              COZ:E는 실제 투자 서비스가 아닌, 경제 지식을 쌓는 학습 서비스예요.
            </p>
          </div>

          <nav aria-label="COZ:E 소셜 채널" className="order-2 flex shrink-0 flex-nowrap justify-self-end gap-2 whitespace-nowrap sm:order-none sm:gap-3">
            <a
              href="https://pf.kakao.com/_ngMWX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md bg-[#FEE500] px-2 text-[11px] font-semibold text-black hover:brightness-95 sm:h-10 sm:gap-2 sm:px-5 sm:text-sm"
            >
              <img src={kakaoLogo} alt="" className="size-4 shrink-0 sm:size-5" />
              채널 추가
            </a>
            <a
              href="https://www.instagram.com/cozeconomy/?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-gray-20 bg-white px-2 text-[11px] font-semibold text-black hover:bg-gray-05 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <img src={instagramLogo} alt="" className="size-5 shrink-0 sm:size-6" />
              인스타그램
            </a>
          </nav>
        </header>

        <div className="mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-250 flex-1 flex-col px-6 pt-6 pb-[clamp(64px,12svh,160px)] sm:min-h-[calc(100dvh-88px)] sm:pt-[clamp(48px,9dvh,110px)] sm:pb-[clamp(64px,12dvh,160px)]">
          <h1
            className="flex justify-between text-xs font-medium text-gray-40 sm:text-sm md:text-xl"
            aria-label="COMING SOON"
          >
            {'COMINGSOON'.split('').map((letter, index) => (
              <span key={index} aria-hidden="true">
                {letter}
              </span>
            ))}
          </h1>
          <div className="flex flex-col items-center justify-center">
            <div
              role="timer"
              aria-label="서비스 오픈까지 남은 시간"
              className="mt-5 grid w-full grid-cols-4 gap-2 sm:w-auto md:gap-8"
            >
              {countdown.map(({ value, unit }) => (
                <div
                  key={unit}
                  className="flex items-baseline justify-center gap-1 md:gap-3"
                >
                  <span className="text-[clamp(32px,9vw,44px)] leading-none font-light tabular-nums text-blue-60 sm:text-[clamp(44px,8vw,112px)]">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-60 sm:text-xs md:text-base">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 hidden text-center text-[24px] font-semibold text-blue-50 sm:block">
              2026. 10. 31 (토) 오픈
            </p>
          </div>

          <div className="mt-8 sm:mt-auto sm:pt-[clamp(240px,30dvh,380px)]">
            <div className="mx-auto grid w-full max-w-55 gap-3 sm:max-w-200 sm:gap-5 sm:rounded-2xl sm:bg-white/65 sm:p-5 md:grid-cols-[max-content_minmax(0,1fr)] md:items-end md:gap-x-8 md:p-6">
              <h2 className="text-left text-[clamp(26px,3vw,42px)] leading-relaxed font-light text-black">
                하루 5분,
                <br />
                경제 지식이
                <br />내 주가가 되는 곳
              </h2>
              <p className="max-w-48 text-left text-xs leading-relaxed text-gray-60 sm:max-w-none sm:text-sm md:justify-self-end md:pb-2 md:text-right md:text-base">
                경제 퀴즈를 맞힐수록 내 주가가 올라가요.{' '}
                <br className="hidden sm:block" />
                매일 5문제로 지식 수익률을 쌓고, 랭킹에서 겨뤄보세요.
              </p>
            </div>
          </div>
          <p className="mt-auto pt-8 text-center text-lg font-semibold text-blue-50 sm:hidden">
            2026년 10월 31일 오픈
          </p>
        </div>
      </main>
      <StockGrowthSection comingSoonMobile />
      <DailyQuizSection comingSoonMobile />
      <TimeAttackSection comingSoonMobile />
      <GrowthRewardSection />
      <EconomicRoutineSection comingSoonMobile />
      <FaqSection />
      <ComingSoonClosingSection countdown={countdown} />
      <LandingFooter />
    </div>
  );
};

export default CommingSoonPage;
