import kakaoLogo from '../../assets/landing/kakao_login_logo.svg';

const LandingSocialLinks = () => {
  const kakaoUrl = 'https://pf.kakao.com/_ngMWX';
  const instagramUrl = 'https://www.instagram.com/cozeconomy/?hl=ko';

  return (
    <nav aria-label="COZ:E 소셜 채널" className="flex items-center gap-3">
      <a
        href={kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오 채널 새 창에서 열기"
        title="카카오 채널"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FEE500] hover:brightness-95"
      >
        <img src={kakaoLogo} alt="" aria-hidden className="size-6" />
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="인스타그램 새 창에서 열기"
        title="인스타그램"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-white hover:brightness-95"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="size-7"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </nav>
  );
};

export default LandingSocialLinks;
