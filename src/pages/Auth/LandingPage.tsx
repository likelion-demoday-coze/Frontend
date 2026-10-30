import LandingSocialLinks from '../../components/landing/LandingSocialLinks';
import StartInvestingSection from '../../components/landing/StartInvestingSection';
import LandingFooter from '../../components/landing/LandingFooter';
import FaqSection from '../../components/landing/FaqSection';
import EconomicRoutineSection from '../../components/landing/EconomicRoutineSection';
import GrowthRewardSection from '../../components/landing/GrowthRewardSection';
import TimeAttackSection from '../../components/landing/TimeAttackSection';
import DailyQuizSection from '../../components/landing/DailyQuizSection';
import StockGrowthSection from '../../components/landing/StockGrowthSection';
import { useNavigate } from 'react-router-dom';
import textlogo from '../../assets/logos/coze_text_logo_black.svg';
import catImage from '../../assets/character/stand_pose.svg';
import chartCard from '../../assets/landing/landing_chart.svg';
import { startKaKaoLogin } from '../../api/auth';
import { ROUTES } from '../../constants/routes';
import kakaologo from '../../assets/landing/kakao_login_logo.svg';

const BUBBLES = [
  {
    pos: 'top-20 left-0',
    large: false,
    question: '기준금리가 오르면 이미 발행된 채권의 가격은 보통 어떻게 될까요?',
  },
  {
    pos: 'top-[20%] -right-4 z-10',
    large: true,
    question: '물가가 전반적으로 지속해서 오르는 현상을 무엇이라고 할까요?',
  },
  {
    pos: 'top-[50%] left-5',
    large: false,
    question:
      '월급에서 세금과 4대 보험료를 빼고 실제로 받는 금액을 무엇이라고 할까요?',
  },
  {
    pos: 'bottom-20 left-7 z-10',
    large: false,
    question:
      '기업의 매출액에서 매출원가와 판매관리비를 뺀 이익을 무엇이라고 할까요?',
  },
  {
    pos: 'right-0 bottom-12',
    large: false,
    question: '원·달러 환율이 오르면 미국 여행에 필요한 원화는 더 많아질까요?',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-white">
        <header className="relative z-20 mx-auto flex w-full max-w-300 shrink-0 items-center justify-between px-5 pt-6 lg:px-6">
          <div className="order-2 lg:order-1">
            <img src={textlogo} alt="COZ:E" className="h-8" />
          </div>
          <div className="order-1 lg:order-2">
            <LandingSocialLinks />
          </div>
        </header>

        <div className="mx-auto flex min-h-min w-full max-w-300 flex-1 flex-col items-center gap-6 px-5 lg:flex-row lg:justify-between lg:gap-8 lg:px-6">
          <section className="flex min-h-min w-full flex-1 flex-col pt-4 pb-6 lg:block lg:flex-1 lg:max-w-120 lg:pb-0 lg:pt-0">
            <h1 className="shrink-0 text-[30px] leading-tight font-light lg:text-[clamp(40px,4vw,56px)]">
              하루 5분,
              <br />
              <strong className="font-medium">경제 지식</strong>이
              <br />
              <strong className="font-medium">내 주가</strong>가 되는 곳
            </h1>
            <p className="relative z-10 mt-4 max-w-55 shrink-0 text-[13px] leading-relaxed text-gray-60 lg:mt-6 lg:max-w-none lg:text-[clamp(16px,1.5vw,20px)]">
              경제 퀴즈를 맞힐수록 내 주가가 올라가요.
              <br />
              매일 5문제로 지식 수익률을 쌓고, 랭킹에서 겨뤄보세요.
            </p>

            {/* 모바일: 차트 위로 캐릭터와 질문 말풍선을 겹쳐 배치 */}
            <div aria-hidden className="relative mt-6 min-h-40 flex-1 lg:hidden">
              <img
                src={chartCard}
                alt=""
                className="absolute top-3 left-0 w-[85%]"
              />
              <p className="absolute bottom-12 left-30  w-52 rounded-xl bg-white px-3 py-3 text-[10px] leading-relaxed font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:hidden">
                {BUBBLES[3].question}
              </p>
              <img
                src={catImage}
                alt=""
                className="pointer-events-none absolute right-0 bottom-7.5 w-[138%] max-w-179 translate-x-[30%] translate-y-[15%]"
              />
              <p className="absolute -top-4 -right-8 w-40 rounded-xl bg-white px-3 py-3 text-[9px] leading-relaxed font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                {BUBBLES[2].question}
              </p>
            </div>

            <div className="relative z-10 flex w-full shrink-0 flex-col items-stretch gap-3 lg:mt-14 lg:flex-row lg:items-start lg:gap-4">
              {/* 두 칸이 폭을 똑같이 나눔 */}
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.TRY)}
                  className="h-13 w-full cursor-pointer rounded-md bg-blue-60 text-[16px] font-semibold text-white hover:brightness-95 lg:h-12 lg:text-[18px]"
                >
                  맛보기 투자 해보기
                </button>
                <p className="hidden text-center text-[10px] text-gray-50 lg:block">
                  로그인 없이 3문제 · 약 1분
                </p>
              </div>

              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={startKaKaoLogin}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FEE500] text-[16px] font-semibold text-black hover:brightness-95 lg:text-[18px]"
                >
                  <img src={kakaologo} alt="" aria-hidden />
                  카카오로 시작하기
                </button>
                <p className="text-center text-[10px] text-gray-50">
                  이미 계정이 있다면 같은 버튼으로 로그인돼요
                </p>
              </div>
            </div>
          </section>

          <section
            aria-hidden
            className="relative hidden h-[min(680px,calc(100dvh-56px))] min-h-90 min-w-0 lg:block lg:flex-1"
          >
            <img
              src={chartCard}
              alt=""
              className="absolute top-[-5%] right-[-8%] w-full"
            />

            {BUBBLES.map(({ pos, large, question }) => (
              <p
                key={pos}
                className={`absolute rounded-2xl bg-white leading-relaxed font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${pos} ${
                  large
                    ? 'w-[75%] max-w-90 px-5 py-4 text-[14px]'
                    : 'w-[60%] max-w-70 px-4 py-3 text-[11px]'
                }`}
              >
                {question}
              </p>
            ))}

            <img
              src={catImage}
              alt=""
              className="absolute bottom-[-35%] left-1/2 w-[130%] max-w-none -translate-x-1/2"
            />
          </section>
        </div>
      </main>

      <StockGrowthSection comingSoonMobile />
      <DailyQuizSection comingSoonMobile />
      <TimeAttackSection comingSoonMobile />
      <GrowthRewardSection />
      <EconomicRoutineSection comingSoonMobile />
      <FaqSection />
      <div className="flex min-h-dvh flex-col overflow-x-clip">
        <StartInvestingSection />
        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
