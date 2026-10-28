import characterEvolution from '../../assets/onboarding/page_4/4_character_evolution.svg';
import learningReward from '../../assets/onboarding/page_4/4_learning_reward.svg';

const GrowthRewardSection = () => {
  return (
    <section
      aria-labelledby="growth-reward-title"
      className="flex h-dvh flex-col overflow-hidden bg-gray-05 px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col">
        <div className="shrink-0">
          <h2
            id="growth-reward-title"
            className="text-[26px] leading-relaxed font-light lg:text-[clamp(22px,min(2.2vw,4dvh),32px)]"
          >
            매일 올수록, <strong className="font-semibold">냥이가 성장</strong>
            해요
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-60 lg:text-[clamp(13px,min(1.3vw,2.3dvh),18px)]">
            주가가 오를수록 냥이가 진화하고, 매일 이어갈수록 특별한 효과가
            생겨요.
          </p>
        </div>

        <div className="mt-[clamp(16px,6dvh,64px)] grid min-h-0 flex-1 items-center justify-items-center gap-4 md:grid-cols-2 md:gap-8">
          <img
            src={characterEvolution}
            alt="캐릭터 진화: 시작은 초보냥, 주가 1,000에는 큰손냥, 주가 100,000에는 왕족냥으로 진화해요."
            loading="lazy"
            className="h-auto max-h-[28dvh] w-[544px] max-w-full object-contain md:max-h-[calc(100dvh-260px)]"
          />
          <img
            src={learningReward}
            alt="연속학습 보상: 3일 동전, 7일 은화, 14일 금화, 21일 시크릿. 연속학습 일수에 따라 캐릭터에게 특별한 효과가 생겨요."
            loading="lazy"
            className="h-auto max-h-[28dvh] w-[540px] max-w-full object-contain md:max-h-[calc(100dvh-260px)]"
          />
        </div>
      </div>
    </section>
  );
};

export default GrowthRewardSection;
