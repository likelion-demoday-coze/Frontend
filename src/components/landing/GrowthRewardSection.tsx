import learningReward from '../../assets/onboarding/page_4/4_learning_reward.svg';
import { CHARACTER_STAGES } from '../../constants/character';
import { getStandingCharacterImage } from '../../utils/character';

const GrowthRewardSection = () => {
  return (
    <section
      aria-labelledby="growth-reward-title"
      className="flex min-h-dvh flex-col overflow-x-clip bg-gray-05 px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-min w-full max-w-300 flex-1 flex-col">
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

        <div className="mt-[clamp(16px,6dvh,64px)] grid min-h-min flex-1 items-center justify-items-center gap-4 md:grid-cols-2 md:gap-8">
          <div className="w-full max-w-[544px] rounded-2xl bg-white px-4 py-6 text-center">
            <h3 className="text-xl font-bold text-black">캐릭터 진화</h3>
            <p className="mt-2 text-xs text-gray-60">
              주가가 오르면 냥이가 진화해요
            </p>
            <ol className="mt-6 grid grid-cols-4 gap-2">
              {CHARACTER_STAGES.map((stage) => (
                <li key={stage.stage} className="min-w-0">
                  <p className="text-[11px] text-gray-60">
                    {stage.stage === 'BABY'
                      ? '시작'
                      : `주가 ${stage.stock.toLocaleString('ko-KR')}`}
                  </p>
                  <strong className="mt-1 block text-sm text-blue-60">
                    {stage.name}
                  </strong>
                  <img
                    src={getStandingCharacterImage(stage.stage)}
                    alt={stage.name}
                    loading="lazy"
                    className="mt-3 h-[clamp(64px,12vw,128px)] w-full object-contain"
                  />
                </li>
              ))}
            </ol>
          </div>
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
