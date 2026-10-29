import correctCat from '../../assets/character/stand_pose.svg';
import quizResult from '../../assets/onboarding/page_1/1_today_stock.svg';
import quizResultBottom from '../../assets/onboarding/page_1/1_today_stock_bottom.svg';
import stockChange3 from '../../assets/onboarding/page_1/1_stock_fluctations3.svg';
import stockChange2 from '../../assets/onboarding/page_1/1_stock_fluctations2.svg';
import stockChange1 from '../../assets/onboarding/page_1/1_stock_fluctations1.svg';

const StockGrowthSection = () => {
  return (
    <section
      aria-labelledby="stock-growth-title"
      className="flex min-h-dvh flex-col overflow-x-clip bg-white px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-min w-full max-w-300 flex-1 flex-col">
        <div className="grid items-start gap-6 lg:grid-cols-[40%_1fr]">
          <div>
            <h2
              id="stock-growth-title"
              className="text-[26px] leading-noraml font-light lg:text-[clamp(22px,min(2.45vw,4dvh),36px)]"
            >
              퀴즈를 <strong className="font-semibold">맞히면</strong>
              <br />내 주가가 <strong className="font-semibold">
                1~10%
              </strong>{' '}
              올라요.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-60 lg:text-[clamp(13px,min(1.36vw,2.3dvh),20px)]">
              주가는 모두 100.00에서 시작해요.
              <br />
              문제를 틀려도 주가가 떨어지지 않아요.
            </p>
          </div>
          <div className="flex items-start gap-[2.3%]">
            {[stockChange1, stockChange2, stockChange3].map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`퀴즈 정답에 따른 주가 상승 예시 ${index + 1}`}
                className="h-auto w-60 shrink-0 object-contain object-top-left"
              />
            ))}
          </div>
        </div>
        <div className="mt-[clamp(16px,4dvh,40px)] flex min-h-min flex-1 items-center justify-center">
          <div className="relative isolate aspect-1270/640 w-full max-w-[min(100%,max(240px,calc((100dvh-320px)*2)))]">
            <div className="absolute top-[-10%] right-0 z-10 aspect-[699/561] w-[65%] overflow-hidden">
              <img
                src={correctCat}
                alt="손을 든 고양이"
                className="absolute top-[14%] left-0 h-auto w-full"
              />
              <div className="absolute top-[6%] left-1/2 -translate-x-1/2 rounded-full bg-green-80 px-[clamp(10px,1.5vw,24px)] py-[clamp(6px,1vw,16px)] text-[clamp(10px,1.8vw,28px)] font-semibold whitespace-nowrap text-white">
                정답이다 냥!
              </div>
            </div>
            <div className="absolute top-[3.2%] left-0 w-[60%]">
              <img
                src={quizResult}
                alt="5문제 중 3문제 정답으로 오늘의 총 수익 +27.15, 최종 주가 142.15"
                className="relative z-0 block h-auto w-full"
              />
              <img
                src={quizResultBottom}
                alt="시작 주가와 Q1부터 Q5까지 문제별 정답 여부 및 주가"
                className="absolute bottom-[7.8%] left-[5.2%] z-20 h-auto w-[89.45%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StockGrowthSection;
