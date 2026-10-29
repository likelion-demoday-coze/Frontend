import catImage from '../../assets/character/basic_pose_cat.svg';
import logo from '../../assets/logos/coze_text_logo_black.svg';
import kakaoLogo from '../../assets/landing/kakao_login_logo.svg';
import instagramLogo from '../../assets/landing/instagram.svg';

interface ComingSoonClosingSectionProps {
  countdown: { value: number; unit: string }[];
}

const ComingSoonClosingSection = ({
  countdown,
}: ComingSoonClosingSectionProps) => (
  <section
    aria-labelledby="coming-soon-closing-title"
    className="relative isolate flex min-h-130 flex-col overflow-hidden bg-white px-6 pt-12 pb-14 lg:min-h-190 lg:px-10 lg:pt-68 lg:pb-20"
  >
    <img
      src={catImage}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="pointer-events-none absolute -top-40 left-1/2 hidden w-200 max-w-none -translate-x-1/2 rotate-180 select-none lg:block"
    />
    <div className="relative mx-auto flex w-full max-w-250 flex-1 flex-col">
      <p
        className="flex justify-between text-sm font-medium text-gray-40 md:text-xl"
        aria-label="COMING SOON"
      >
        {'COMINGSOON'.split('').map((letter, index) => (
          <span key={index} aria-hidden="true">
            {letter}
          </span>
        ))}
      </p>
      <div
        role="timer"
        aria-label="서비스 오픈까지 남은 시간"
        className="mt-6 grid grid-cols-4 gap-2 md:gap-8"
      >
        {countdown.map(({ value, unit }) => (
          <div
            key={unit}
            className="flex items-baseline justify-center gap-1 md:gap-3"
          >
            <span className="text-[clamp(40px,8vw,112px)] leading-none font-light tabular-nums text-blue-60">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs font-semibold text-gray-60 md:text-base">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto grid items-end gap-10 pt-16 lg:grid-cols-[1fr_auto] lg:pt-28">
        <div className="text-center lg:w-fit">
          <h2
            id="coming-soon-closing-title"
            className="text-[clamp(24px,2.6vw,36px)] leading-relaxed font-light text-black"
          >
            <strong className="font-semibold">10월 31일,</strong> 첫 상장에
            함께해요
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-80">
            오픈하는 순간 카카오톡으로 알려드릴게요.
          </p>
          <nav
            aria-label="오픈 소식을 받을 소셜 채널"
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://pf.kakao.com/_ngMWX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-[#FEE500] px-6 text-sm font-semibold text-black hover:brightness-95 md:px-8 md:text-base"
            >
              <img src={kakaoLogo} alt="" className="size-5" />
              채널 추가
            </a>
            <a
              href="https://www.instagram.com/cozeconomy/?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-md border border-gray-20 bg-white px-5 text-sm font-semibold text-black hover:bg-gray-05 md:px-6 md:text-base"
            >
              <img src={instagramLogo} alt="" className="size-7" />
              인스타그램
            </a>
          </nav>
        </div>
        <img
          src={logo}
          alt="COZ:E"
          loading="lazy"
          className="h-12 w-auto justify-self-center lg:h-20 lg:justify-self-end"
        />
      </div>
    </div>
  </section>
);

export default ComingSoonClosingSection;
