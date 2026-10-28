import dailyQuizCard from '../../assets/onboarding/page_2/정규장 2.svg';
import categorySet from '../../assets/home/category_log_set.svg';

const DailyQuizSection = () => {
  return (
    <section
      aria-labelledby="daily-quiz-title"
      className="flex h-dvh flex-col overflow-hidden bg-gray-05 px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col">
        <div className="grid shrink-0 gap-4 md:grid-cols-[28%_1fr] md:gap-8">
          <h2
            id="daily-quiz-title"
            className="text-[26px] leading-relaxed font-light lg:text-[clamp(22px,min(2.2vw,4dvh),32px)]"
          >
            차근차근 <strong className="font-semibold">정규장</strong>
          </h2>
          <p className="text-[15px] leading-relaxed text-gray-60 lg:text-[clamp(13px,min(1.3vw,2.3dvh),18px)]">
            8개 카테고리 중 하나를 골라 매일 5문제.
            <br />
            틀린 문제는 한 번 더 풀어보고, 해설로 확실히 이해해요.
          </p>
        </div>

        <div className="mt-[clamp(16px,4dvh,40px)] grid min-h-0 flex-1 items-center gap-4 md:grid-cols-[28%_1fr] md:gap-[11%]">
          <img
            src={dailyQuizCard}
            alt="정규장: 하루 5문제, 정답과 해설 바로 확인. 8개 카테고리 중 하나를 골라 풀고, 정답마다 주가가 1~10% 상승합니다."
            loading="lazy"
            className="mx-auto h-auto max-h-[32dvh] w-auto max-w-full object-contain md:max-h-[min(60dvh,calc(100dvh-240px))]"
          />
          <figure className="min-w-0">
            <img
              src={categorySet}
              alt="거시경제, 금융시장, 주식·투자, 금리·채권, 환율·국제경제, 부동산, 기업·재무, 생활경제의 8개 카테고리"
              loading="lazy"
              className="mx-auto h-auto max-h-[25dvh] w-[732px] max-w-full object-contain md:max-h-none"
            />
            <figcaption className="mt-3 text-center text-[10px] leading-relaxed text-gray-40 lg:text-xs">
              거시경제 · 금융시장 · 주식·투자 · 금리·채권 · 환율·국제경제 ·
              부동산 · 기업·재무 · 생활경제
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default DailyQuizSection;
