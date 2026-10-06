import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import TutorialPreview from './TutorialPreview';
import type { PreviewType } from './TutorialPreview';

import catImage from '../../assets/character/basic_pose_cat.svg';

interface TutorialStep {
  label: string;
  title: ReactNode;
  preview: PreviewType;
  descriptions: ReactNode[];
  message: string;
}

interface TutorialModalProps {
  //esc를 닫았을 때 실행
  onClose: () => void;
  //마지막 단계에서 시작하기 누르면 실행
  onComplete: () => void;
}

// 반복되는 문장은 데이터로 관리
// 새로운 단계를 추가하면 진행 표시와 마지막 단계 판단도 자동으로 바뀜
const TUTORIAL_STEPS: TutorialStep[] = [
  {
    label: 'WELCOME',
    title: (
      <>
        하루 5분, <strong>경제 지식</strong>이
        <br />
        <strong>내 주가</strong>가 되는 곳
      </>
    ),
    preview: 'welcome',
    descriptions: [
      <>
        경제 퀴즈를 풀수록 <strong>내 주가가 올라가요.</strong>
      </>,
      <>어렵게 공부하지 말고, 투자하듯 가볍게 시작해보세요.</>,
    ],
    message: '반가워 냥! 지금부터 COZ:E 이용법을 알려줄게 냥',
  },
  {
    label: '내 주가',
    title: (
      <>
        나의 <strong>지식</strong>이 곧 나의 <strong>주가</strong>로
      </>
    ),
    preview: 'stock',
    descriptions: [
      <>
        모두 <strong>100냥불</strong>에서 시작, 정답마다 <strong>1~10%</strong>{' '}
        상승해요. 틀려도 떨어지지 않아요.
      </>,
      <>
        주가가 오르면 냥이가 <strong>초보냥 → 큰손냥 → 귀족냥</strong>으로
        진화해요.
      </>,
      <>
        주가 반영은 <strong>하루 정규장 2회</strong>까지예요. (패스 회원 3회)
      </>,
    ],
    message: '나를 귀족냥으로 만들어 달라 냥!',
  },
  {
    label: '정규장 · 데일리 퀴즈',
    title: (
      <>
        <strong>매일 5문제</strong>로 주가 올리기
      </>
    ),
    preview: 'regular',
    descriptions: [
      <>
        8개 카테고리 중 <strong>하나를 골라</strong> 5문제를 풀어요.
      </>,
      <>문제마다 바로 정답과 해설을 보여줘요.</>,
    ],
    message: '주가를 올리는 가장 기본적인 방법이다 냥',
  },
  {
    label: '시간외거래 · 랭킹',
    title: (
      <>
        <strong>1분 스피드 퀴즈</strong>로 랭킹 도전
      </>
    ),
    preview: 'afterhours',
    descriptions: [
      <>
        1분 동안 최대한 많이 맞혀요.{' '}
        <strong>오답 페널티·건너뛰기는 없어요.</strong>
      </>,
      <>
        입장 <strong>생선 100개, 하루 3번까지.</strong> 점수는 랭킹에만
        반영돼요.
      </>,
      <>
        주가 랭킹 · 시간외거래 랭킹 <strong>매일 1~3위는 생선 100개!</strong>
      </>,
    ],
    message: '손이 빠른 냥이는 1등을 노려보라 냥',
  },
  {
    label: '연속 학습',
    title: (
      <>
        <strong>연속학습이 이어지면</strong> 냥이한테 효과가?!
      </>
    ),
    preview: 'streak',
    descriptions: [
      <>
        <strong>정규장 5문제를 끝까지</strong> 풀어야 그날 학습 완료예요.
        (시간외거래는 연속학습에서 제외)
      </>,
      <>
        하루 쉬면 <strong>주가 20% 폭락</strong>, 효과도 사라지고 진화 단계가
        내려갈 수 있어요.
      </>,
      <>
        당일 안에 <strong>하락 방지권(생선 200개)</strong>을 쓰면 모두 복구돼요.
      </>,
    ],
    message: '매일매일 와야 반짝반짝해진다 냥',
  },
  {
    label: 'START',
    title: (
      <>
        이제 <strong>첫 투자</strong>를 시작해볼까요?
      </>
    ),
    preview: 'start',
    descriptions: [
      <>
        생선은 매일 <strong>출석 보상</strong>으로 받고, 퀴즈에{' '}
        <strong>입장할 때</strong> 써요.
      </>,
      <>
        출석 보상 100개를 받으면 <strong>바로 정규장에 입장</strong>할 수
        있어요.
      </>,
    ],
    message: '오늘의 생선부터 받고 가자 냥',
  },
];

export default function TutorialModal({
  onClose,
  onComplete,
}: TutorialModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const step = TUTORIAL_STEPS[stepIndex];
  const totalSteps = TUTORIAL_STEPS.length;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();

    //모달이 열려있는 동안 스크롤을 막음
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStepIndex((previous) => previous + 1);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Esc로 닫을 때 부모의 상태도 함께 변경
        event.preventDefault();
        onClose();
      }}
      className="m-auto h-170 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-140 overflow-y-auto rounded-2xl border-0 bg-white p-0 text-gray-60 backdrop:bg-black/45"
    >
      <div className="flex min-h-full flex-col px-8 py-8">
        {/* 진행 표시 */}
        <div className="mb-6 flex items-center gap-6">
          <div className="relative h-0.5 flex-1 bg-gray-20" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 bg-blue-60"
              style={{
                width: `${((stepIndex + 1) / totalSteps) * 100}%`,
              }}
            />

            {TUTORIAL_STEPS.map((item, index) => (
              <span
                key={item.preview}
                className={`absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  index <= stepIndex ? 'bg-blue-60' : 'bg-gray-20'
                }`}
                style={{
                  left: `${((index + 1) / totalSteps) * 100}%`,
                }}
              />
            ))}
          </div>

          <span
            aria-live="polite"
            aria-atomic="true"
            className="shrink-0 text-base font-semibold"
          >
            <span className="sr-only">튜토리얼 단계 </span>
            {stepIndex + 1}/{totalSteps}
          </span>
        </div>

        <p className="mb-6 text-[16px] font-semibold text-blue-60">
          {step.label}
        </p>

        <h2
          id={titleId}
          className="mb-3 text-2xl leading-9 font-normal text-black"
        >
          {step.title}
        </h2>

        <TutorialPreview type={step.preview} />

        <ul className="mt-4 list-disc space-y-1.5 pl-7 text-sm leading-5 font-medium [&_strong]:font-semibold [&_strong]:text-blue-60">
          {step.descriptions.map((description, index) => (
            <li key={index}>{description}</li>
          ))}
        </ul>

        <div className="mt-auto pt-5.25">
          <div className="flex items-center gap-3.5">
            <div className="h-17 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-15">
              <img
                src={catImage}
                alt=""
                className="h-full w-full scale-125 object-cover"
              />
            </div>

            <p className="rounded-2xl bg-blue-50 px-3 py-2 text-sm leading-5 font-bold text-blue-05">
              {step.message}
            </p>
          </div>

          <div className="mt-7 flex gap-3">
            {!isFirstStep && (
              <button
                type="button"
                onClick={() => setStepIndex((previous) => previous - 1)}
                className="h-16 flex-[1] rounded-xl border border-gray-20 bg-white font-semibold text-gray-60 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60"
              >
                이전
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="h-16 flex-[1.8] rounded-xl bg-blue-60 font-semibold text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60"
            >
              {isLastStep ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
