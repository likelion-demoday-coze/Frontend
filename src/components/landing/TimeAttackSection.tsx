import quizPreview from '../../assets/onboarding/page_3/3_time_attack_on.svg';
import timeAttackCard from '../../assets/onboarding/page_3/3_after_hours_trading.svg';

const TimeAttackSection = () => {
  return (
    <section
      aria-labelledby="time-attack-title"
      className="flex min-h-dvh flex-col overflow-x-clip bg-white px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-min w-full max-w-300 flex-1 flex-col">
        <div className="grid shrink-0 gap-4 md:grid-cols-[minmax(0,667fr)_minmax(0,387fr)] md:gap-x-[clamp(24px,4vw,64px)]">
          <h2
            id="time-attack-title"
            className="text-[26px] leading-relaxed font-light md:order-2 lg:text-[clamp(22px,min(2.2vw,4dvh),32px)]"
          >
            짜릿하게 <strong className="font-semibold">시간외거래</strong>
          </h2>
          <p className="text-[15px] leading-relaxed text-gray-60 md:order-1 md:justify-self-end lg:text-[clamp(13px,min(1.3vw,2.3dvh),18px)]">
            1분 동안 최대한 많이 맞히는 스피드 퀴즈.
            <br />
            하루 3번 도전하고, 오늘의 랭킹을 뒤집어 보세요.
          </p>
        </div>

        <div className="mt-[clamp(16px,4dvh,40px)] grid min-h-min flex-1 items-center gap-4 md:grid-cols-[minmax(0,667fr)_minmax(0,387fr)] md:gap-x-[clamp(24px,4vw,64px)]">
          <img
            src={quizPreview}
            alt="시간외거래 퀴즈 화면: 제한 시간 안에 정답을 고르고 오늘의 랭킹에 도전해요."
            loading="lazy"
            className="mx-auto h-auto max-h-[30dvh] w-[667px] max-w-full object-contain md:max-h-[calc(100dvh-240px)]"
          />
          <img
            src={timeAttackCard}
            alt="시간외거래: 1분 스피드 퀴즈, 하루 3번 도전. 1분 동안 문제를 최대한 많이 맞히는 경쟁 모드입니다. 랭킹에 도전하세요."
            loading="lazy"
            className="mx-auto h-[min(30dvh,540px)] w-auto max-w-full object-contain md:h-[540px] md:max-h-[calc(100dvh-240px)]"
          />
        </div>
      </div>
    </section>
  );
};

export default TimeAttackSection;
