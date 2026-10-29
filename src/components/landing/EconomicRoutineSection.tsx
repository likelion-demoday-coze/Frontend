import trendPreview from '../../assets/onboarding/page_5/5_trend.svg';
import trendMobilePreview from '../../assets/onboarding/page_5/5_trend_mobile.svg';
import routinePreview from '../../assets/onboarding/page_5/5_routine.svg';

const EconomicRoutineSection = ({
  comingSoonMobile = false,
}: {
  comingSoonMobile?: boolean;
}) => {
  return (
    <section
      aria-labelledby="economic-routine-title"
      className="flex min-h-dvh flex-col overflow-clip bg-white px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div
        className={`mx-auto grid min-h-min w-full max-w-300 flex-1 ${comingSoonMobile ? 'grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : 'grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'} grid-rows-[auto_minmax(0,1fr)] gap-x-[clamp(16px,5vw,80px)] gap-y-[clamp(20px,5dvh,64px)]`}
      >
        <div
          className={
            comingSoonMobile ? 'col-span-1' : 'col-span-2 md:col-span-1'
          }
        >
          <h2
            id="economic-routine-title"
            className="text-[26px] leading-relaxed font-light lg:text-[clamp(22px,min(2.2vw,4dvh),32px)]"
          >
            <strong className="font-semibold">퀴즈 밖</strong>에서도,
            <br />
            경제는 계속돼요
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-60 lg:text-[clamp(13px,min(1.3vw,2.3dvh),18px)]">
            매일 아침, 오늘의 경제 뉴스 3개를 쉽게 요약하고<span> </span>
            <br
              className={`hidden ${comingSoonMobile ? 'sm:block' : 'md:block'}`}
            />
            꼭 알아야 할 경제 용어까지 함께 정리해 드려요.
          </p>
        </div>

        {comingSoonMobile && (
          <div
            role="region"
            aria-label="경제 트렌드 미리보기 가로 스크롤"
            tabIndex={0}
            className="col-start-1 row-start-2 w-full min-w-0 self-center overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden"
          >
            <img
              src={trendMobilePreview}
              alt="모바일 경제 트렌드 미리보기: 경제 뉴스 카드와 핵심 요약"
              loading="lazy"
              className="block h-auto w-[623px] max-w-none"
            />
          </div>
        )}
        <img
          src={trendPreview}
          alt="오늘의 경제 트렌드 미리보기: 경제 뉴스 3개와 핵심 요약, 필수 경제 용어를 함께 확인해요."
          loading="lazy"
          className={`${comingSoonMobile ? 'hidden sm:block' : ''} col-start-1 row-start-2 h-full min-h-min w-full translate-y-[calc(clamp(24px,4dvh,40px)+20px)] object-contain object-left-bottom`}
        />

        <figure
          className={`${comingSoonMobile ? 'hidden sm:flex' : 'flex'} col-start-2 row-start-2 min-h-min flex-col items-center gap-4 ${comingSoonMobile ? 'sm:row-span-2 sm:row-start-1' : 'md:row-span-2 md:row-start-1'}`}
        >
          <figcaption className="shrink-0 text-center text-xs leading-relaxed text-gray-60 md:text-base">
            매일 COZ:E를 즐기는 5분 루틴
          </figcaption>
          <img
            src={routinePreview}
            alt="5분 루틴: 첫째, 출석하고 FISH 100개 받기. 둘째, 정규장 5문제 풀기. 셋째, 오늘의 경제 트렌드 읽기."
            loading="lazy"
            className="min-h-min w-full min-w-0 flex-1 object-contain object-top"
          />
        </figure>
      </div>
    </section>
  );
};

export default EconomicRoutineSection;
