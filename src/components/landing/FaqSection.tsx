const FAQ_ITEMS = [
  {
    question: '서비스 내에서 실제로 현금이 오가나요?',
    answer:
      '아니요. 주가와 FISH는 서비스 안에서만 쓰는 학습용 포인트예요.',
  },
  {
    question: '유료 기능이 있나요?',
    answer:
      '기본 기능은 모두 무료예요. 원하시면 7일 패스(1,900원)로 FISH 차감 없이 입장하고, 하루 주가 반영 횟수를 2회에서 3회로 늘릴 수 있어요. 패스는 11월 14일까지 판매해요.',
  },
  {
    question: '학습을 하루 빠지면 어떻게 돼요?',
    answer: '주가가 20% 내려가지만, 다음 날 23:59까지 복구할 수 있어요.',
  },
  {
    question: '경제를 하나도 몰라도 되나요?',
    answer: '문제마다 해설이 있어서 처음이어도 괜찮아요.',
  },
];

const FaqSection = () => {
  return (
    <section
      aria-labelledby="faq-title"
      className="flex min-h-dvh flex-col overflow-x-clip bg-gray-05 px-[clamp(24px,11.11vw,160px)] pt-[clamp(24px,11.11dvh,100px)] pb-[clamp(24px,4dvh,40px)]"
    >
      <div className="mx-auto flex min-h-min w-full max-w-300 flex-1 flex-col">
        <h2
          id="faq-title"
          className="shrink-0 text-center text-[26px] leading-relaxed font-light lg:text-[clamp(22px,min(2.2vw,4dvh),32px)]"
        >
          자주 묻는 <strong className="font-semibold">질문</strong>
        </h2>
        <dl className="my-auto flex flex-col gap-[clamp(8px,1.5dvh,12px)] py-[clamp(16px,4dvh,48px)]">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div
              key={question}
              className="rounded-[20px] bg-white px-[clamp(20px,4vw,56px)] py-[clamp(12px,2.5dvh,24px)]"
            >
              <dt className="text-sm leading-relaxed font-semibold text-gray-80 md:text-base">
                Q. {question}
              </dt>
              <dd className="mt-2 text-xs leading-relaxed text-gray-60 md:text-[13px]">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FaqSection;
