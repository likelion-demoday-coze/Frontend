import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import comingSoonBackground from '../assets/onboarding/commingsoon/comming_bg.svg';
import logo from '../assets/logos/coze_text_logo_black.svg';
import kakaoLogo from '../assets/landing/kakao_login_logo.svg';
import instagramLogo from '../assets/landing/instagram.svg';
import StockGrowthSection from '../components/landing/StockGrowthSection';
import DailyQuizSection from '../components/landing/DailyQuizSection';
import TimeAttackSection from '../components/landing/TimeAttackSection';
import GrowthRewardSection from '../components/landing/GrowthRewardSection';
import EconomicRoutineSection from '../components/landing/EconomicRoutineSection';
import FaqSection from '../components/landing/FaqSection';
import StartInvestingSection from '../components/landing/StartInvestingSection';
import LandingFooter from '../components/landing/LandingFooter';

const OPEN_AT = new Date('2026-10-31T00:00:00+09:00').getTime();

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
      <main className="relative isolate min-h-dvh w-full overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${comingSoonBackground})`,
            backgroundPosition: 'center clamp(100px, 14dvh, 160px)',
          }}
        />
        <header className="mx-auto flex w-full max-w-320 flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <img src={logo} alt="COZ:E" className="h-6 w-auto" />
            <p className="flex items-center gap-1 text-[11px] text-gray-40">
              <Info aria-hidden="true" className="size-3.5 shrink-0" />
              COZ:E는 실제 투자 서비스가 아닌, 경제 지식을 쌓는 학습 서비스예요.
            </p>
          </div>
          <p className="text-sm font-semibold text-blue-60">
            2026. 10. 31 (토) 오픈
          </p>
          <nav aria-label="COZ:E 소셜 채널" className="flex gap-3">
            <a
              href="https://pf.kakao.com/_ngMWX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#FEE500] px-5 text-sm font-semibold text-black hover:brightness-95"
            >
              <img src={kakaoLogo} alt="" className="size-5" />
              채널 추가
            </a>
            <a
              href="https://www.instagram.com/cozeconomy/?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-20 bg-white px-4 text-sm font-semibold text-black hover:bg-gray-05"
            >
              <img src={instagramLogo} alt="" className="size-6" />
              인스타그램
            </a>
          </nav>
        </header>

        <div className="mx-auto flex min-h-[calc(100dvh-88px)] w-full max-w-250 flex-col px-6 pt-[clamp(48px,9dvh,110px)] pb-[clamp(64px,12dvh,160px)]">
          <h1
            className="flex justify-between text-sm font-medium text-gray-40 md:text-xl"
            aria-label="COMING SOON"
          >
            {'COMINGSOON'.split('').map((letter, index) => (
              <span key={index} aria-hidden="true">
                {letter}
              </span>
            ))}
          </h1>
          <div
            role="timer"
            aria-label="서비스 오픈까지 남은 시간"
            className="mt-5 grid grid-cols-4 gap-2 md:gap-8"
          >
            {countdown.map(({ value, unit }) => (
              <div
                key={unit}
                className="flex items-baseline justify-center gap-1 md:gap-3"
              >
                <span className="text-[clamp(44px,8vw,112px)] leading-none font-light tabular-nums text-blue-60">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-60 md:text-base">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto grid gap-5 pt-[clamp(240px,30dvh,380px)] md:grid-cols-[1fr_1.2fr] md:items-end">
            <h2 className="text-[clamp(26px,3vw,42px)] leading-relaxed font-light text-black">
              하루 5분,
              <br />
              경제 지식이
              <br />내 주가가 되는 곳
            </h2>
            <p className="text-sm leading-relaxed text-gray-60 md:pb-2 md:text-base">
              경제 퀴즈를 맞힐수록 내 주가가 올라가요.
              <br />
              매일 5문제로 지식 수익률을 쌓고, 랭킹에서 겨뤄보세요.
            </p>
          </div>
        </div>
      </main>
      <StockGrowthSection />
      <DailyQuizSection />
      <TimeAttackSection />
      <GrowthRewardSection />
      <EconomicRoutineSection />
      <FaqSection />
      <div className="flex min-h-dvh flex-col overflow-x-clip">
        <StartInvestingSection />
        <LandingFooter />
      </div>
    </div>
  );
};

export default CommingSoonPage;
