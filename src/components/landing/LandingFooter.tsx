import textLogo from '../../assets/logos/coze_text_logo_black.svg';

const LandingFooter = () => {
  return (
    <footer className="shrink-0 bg-gray-05 px-[clamp(24px,5vw,80px)] py-3 text-[10px] leading-relaxed text-gray-40 md:py-4 md:text-[11px]">
      <div className="mx-auto max-w-7xl">
        <img
          src={textLogo}
          alt="COZ:E"
          loading="lazy"
          className="mb-2 h-5 w-auto"
        />
        <p className="font-medium text-gray-60">
          이용약관 | 개인정보처리방침 | 환불정책 | 카카오 채널 문의
        </p>
        <p className="mt-1">
          상호 COZ:E(팀 홍데프) · 대표 박성찬 · 주소 경기도 과천시 별양로 · 전화
          010-7473-5230 · 카카오 채널 @COZE · 문의 시간 평일 10:00~18:00
        </p>
        <p className="mt-1">
          사업자등록번호 없음(개인) · 통신판매업 신고 면제 · 결제대행
          페이앱(주식회사 유디아이디)
        </p>
        <p className="mt-3">
          COZ:E는 실제 투자 서비스가 아닌 경제 학습 서비스입니다. 주가와 FISH는
          현금 가치가 없습니다. 패스 판매는 2026년 11월 14일, 서비스는 2026년
          11월 21일에 종료됩니다.
        </p>
        <p className="mt-1">© 2026 COZ:E</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
