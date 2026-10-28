import { useNavigate } from 'react-router-dom';
import { startKaKaoLogin } from '../../api/auth';
import { ROUTES } from '../../constants/routes';
import chartCard from '../../assets/landing/landing_chart.svg';
import basicCat from '../../assets/onboarding/page_7/7_basic_cat_rotate.svg';
import richCat from '../../assets/onboarding/page_7/7_pink_cat.svg';
import textLogo from '../../assets/logos/coze_text_logo_black.svg';
import kakaoLogo from '../../assets/landing/kakao_login_logo.svg';

const StartInvestingSection = () => {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="start-investing-title"
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-6 py-[clamp(12px,3dvh,28px)]"
    >
      <img
        src={basicCat}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute top-0 right-0 -z-5 w-200 select-none"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 w-150">
        <img
          src={richCat}
          alt=""
          aria-hidden
          loading="lazy"
          className="relative -z-10 w-full select-none"
        />
        <p className="absolute top-[18%] left-[52%] z-20 rounded-2xl rounded-bl-none bg-blue-50 px-3 py-2 text-xs whitespace-nowrap text-white md:text-sm">
          기다리고 있겠다 냥
        </p>
      </div>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col items-center">
        <h2
          id="start-investing-title"
          className="shrink-0 text-center text-[22px] leading-relaxed font-light lg:text-[clamp(22px,min(2vw,3.5dvh),28px)]"
        >
          내 주가는 <strong className="font-semibold">100.00</strong>에서
          시작해요
        </h2>
        <p className="mt-2 shrink-0 text-center text-[13px] leading-relaxed text-gray-60 md:text-base">
          오늘 5문제면 첫 상승을 볼 수 있어요.
          <br />
          가입은 카카오로 10초면 끝나요.
        </p>

        <div className="relative mt-3 flex min-h-0 w-180 max-w-150 flex-1 items-end justify-center">
          <img
            src={chartCard}
            alt="100.00에서 127.15까지 상승한 주가 그래프 예시"
            loading="lazy"
            className="max-h-full w-full object-contain"
          />
        </div>

        <div className="relative z-10 -mt-4 flex w-full max-w-150 shrink-0 gap-3 md:-mt-6 md:-translate-x-50 md:gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.TRY)}
            className="h-14 min-w-0 flex-1 cursor-pointer rounded-xl bg-blue-60 px-2 text-sm sm:px-5 sm:text-base font-semibold text-white hover:brightness-95 md:h-18 md:text-lg"
          >
            맛보기 투자 해보기
          </button>
          <button
            type="button"
            onClick={startKaKaoLogin}
            className="flex h-14 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-2 text-sm sm:px-5 sm:text-base font-semibold text-black hover:brightness-95 md:h-18 md:text-lg"
          >
            <img src={kakaoLogo} alt="" aria-hidden className="size-5" />
            카카오로 시작하기
          </button>
        </div>
        <img
          src={textLogo}
          alt="COZ:E"
          className="mt-3 h-14 w-auto shrink-0 self-end md:absolute md:right-0 md:bottom-0 md:mt-0 md:h-14"
        />
      </div>
    </section>
  );
};

export default StartInvestingSection;
