import { useNavigate } from 'react-router-dom';
import textlogo from '../../assets/logos/coze_text_logo_black.svg';
import catImage from '../../assets/character/stand_pose.svg';
import chartCard from '../../assets/landing/landing_chart.svg';
import { startKaKaoLogin } from '../../api/auth';
import { ROUTES } from '../../constants/routes';
import kakaologo from '../../assets/landing/kakao_login_logo.svg';

const QUESTION =
  '기업의 주된 영업활동에서 발생한 수익에서 매출원가와 판매관리비를 뺀 순수한 이익을 뜻하는 용어는?';

// 말풍선 5개/위치/크기 설정
const BUBBLES = [
  { pos: 'top-20 left-0', large: false },
  { pos: 'top-56 -right-30 z-10', large: true },
  { pos: 'top-80 left-5 ', large: false },
  { pos: 'bottom-20 left-8 z-10', large: false },
  { pos: 'right-0 bottom-12 ', large: false },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <header className="max-w-300 px-15 pt-6">
        <img src={textlogo} alt="COZ:E" className="h-8" />
      </header>

      <div className="mx-auto flex max-w-300 flex-col items-center gap-16 px-6 lg:flex-row lg:justify-between">
        <section className="w-full max-w-120 pt-16 lg:pt-0">
          <h1 className="text-[56px] leading-tight font-light">
            하루 5분,
            <br />
            <strong className="font-medium">경제 지식</strong>이
            <br />
            <strong className="font-medium">내 주가</strong>가 되는 곳
          </h1>
          <p className="mt-6 text-[20px] leading-relaxed text-gray-60">
            경제 퀴즈를 맞힐수록 내 주가가 올라가요.
            <br />
            매일 5문제로 지식 수익률을 쌓고, 랭킹에서 겨뤄보세요.
          </p>

          <div className="mt-28 flex w-full items-start gap-4">
            {/* 두 칸이 폭을 똑같이 나눔 */}
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(ROUTES.TRY)}
                className="h-12 w-full cursor-pointer rounded-md bg-blue-60 text-[18px] font-semibold text-white hover:brightness-95"
              >
                맛보기 투자 해보기
              </button>
              <p className="text-center text-[10px] text-gray-50">
                로그인 없이 3문제 · 약 1분
              </p>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <button
                type="button"
                onClick={startKaKaoLogin}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FEE500] text-[18px] font-semibold text-black hover:brightness-95"
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
          className="relative hidden h-170 w-140 shrink-0 lg:block"
        >
          <img
            src={chartCard}
            alt=""
            className="absolute top-6 -right-20 w-150"
          />

          {BUBBLES.map(({ pos, large }) => (
            <p
              key={pos}
              className={`absolute rounded-2xl bg-white leading-relaxed font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${pos} ${
                large
                  ? 'w-90 px-5 py-4 text-[14px]'
                  : 'w-70 px-4 py-3 text-[11px]'
              }`}
            >
              {QUESTION}
            </p>
          ))}

          <img
            src={catImage}
            alt=""
            className="absolute -bottom-90 left-1/2 w-250 max-w-none -translate-x-1/2"
          />
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
