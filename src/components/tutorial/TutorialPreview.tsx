import completeImage from '../../assets/streak/complete.svg';
import incompleteImage from '../../assets/streak/incomplete.svg';

import basic_1 from '../../assets/character/basic_1.svg';
import { CHARACTER_STAGES } from '../../constants/character';
import { getCharacterImage } from '../../utils/character';
import completetoday from '../../assets/streak/complete_today.svg';
import fishImage from '../../assets/store/Fish_a.svg';
import tutorial_cat from '../../assets/home/tutorial_cat.svg';
import category_set from '../../assets/home/category_log_set.svg';
import green_circle from '../../assets/stock/green_circle.svg';
import dailyQuizIcon from '../../assets/quiz/dailyquiz_icon.svg';
import timeAttackIcon from '../../assets/quiz/timeattack_icon.svg';
import {
  DAILY_FISH_COST,
  TIME_ATTACK_FISH_COST,
} from '../../constants/quizCost';

import gold from '../../assets/home/streak/6th_gold.svg';
import silver from '../../assets/home/streak/4th_silver.svg';
import bronze from '../../assets/home/streak/2nd_bronze.svg';

//카드와 카드 사이를 묶음
import { Fragment } from 'react';

export type PreviewType =
  'welcome' | 'stock' | 'regular' | 'afterhours' | 'streak' | 'start';

const STOCK_LEVELS = CHARACTER_STAGES.filter(
  (stage) => stage.stage !== 'BABY'
).map((stage) => ({
  name: stage.name,
  stock: `${stage.stock.toLocaleString('ko-KR')}방울`,
  image: getCharacterImage(stage.stage),
}));

const STREAK_EFFECTS = [
  { days: 3, name: '동전', image: bronze },
  { days: 7, name: '은화', image: silver },
  { days: 14, name: '금화', image: gold },
  { days: 21, name: '시크릿', image: null },
];

//큰 네모박스의 클래스네임을 저장
export default function TutorialPreview({ type }: { type: PreviewType }) {
  const previewClassName =
    'relative h-[12.5em] shrink-0 overflow-hidden rounded-[1.25em] border border-blue-15 bg-blue-05';

  switch (type) {
    // 맨 처음
    case 'welcome':
      return (
        <div
          aria-hidden="true"
          className="relative h-[12.5em] shrink-0 overflow-hidden rounded-[1.25em] border border-blue-15 bg-white"
        >
          <img
            src={tutorial_cat}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      );

    // 내 주가
    case 'stock':
      return (
        <div aria-hidden="true" className={`${previewClassName} @container`}>
          {/* 상단 주가 */}
          <div className="absolute inset-x-[1.5em] top-[1em] z-10 flex flex-nowrap items-end gap-[min(8px,1.5cqi)] whitespace-nowrap">
            <div className="shrink-0">
              <p className="text-[clamp(8px,3cqi,14px)] text-gray-40">
                시작 주가
              </p>
              <p className="mt-[0.25em] text-[clamp(12px,4cqi,20px)]">100.00</p>
            </div>

            <span className="shrink-0 pb-[0.25em] text-[clamp(10px,3.5cqi,20px)] text-gray-20">
              →
            </span>

            <p className="flex min-w-0 flex-nowrap items-baseline gap-[min(8px,1cqi)] text-[clamp(14px,5cqi,24px)] font-bold text-blue-50">
              123.61
              <span className="text-[clamp(8px,2.8cqi,14px)]">▲23.61%</span>
            </p>
          </div>

          {/* 배경 그래프 */}
          <svg
            viewBox="0 0 480 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <polyline
              points="20,140 110,103 195,103 280,78 365,78 455,42"
              fill="none"
              stroke="#1D3BAF"
              strokeWidth="2"
            />
            <circle
              cx="455"
              cy="42"
              r="4"
              fill="black"
              stroke="white"
              strokeWidth="2"
              style={{
                filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.8))',
              }}
            />
          </svg>

          <div className="absolute inset-x-[min(16px,3.23cqi)] bottom-[min(8px,1.61cqi)] flex items-center gap-[min(8px,1.61cqi)] pb-[min(8px,1.61cqi)]">
            {STOCK_LEVELS.map((level, index) => (
              <Fragment key={level.name}>
                <div
                  className={`flex h-[min(80px,16.13cqi)] min-w-0 flex-1 flex-row items-center justify-center gap-[min(8px,1.61cqi)] rounded-[min(12px,2.42cqi)] border bg-white px-[min(8px,1.61cqi)] py-[min(8px,1.61cqi)] ${
                    index === 0 ? 'border-yellow-45' : 'border-gray-20'
                  }`}
                >
                  <img
                    src={level.image}
                    alt=""
                    className="h-[min(64px,12.9cqi)] w-[min(56px,11.29cqi)] shrink-0 object-contain"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-[min(4px,0.81cqi)] text-center">
                    <p className="whitespace-nowrap text-[min(14px,2.82cqi)] font-semibold text-black">
                      {level.name}
                    </p>

                    <p className="whitespace-nowrap text-[min(11px,2.22cqi)] text-gray-40">
                      {level.stock}
                    </p>
                  </div>
                </div>

                {index < STOCK_LEVELS.length - 1 && (
                  <span className="shrink-0 text-[min(14px,2.82cqi)] text-gray-40">
                    ›
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      );

    case 'regular':
      return (
        <div aria-hidden="true" className={previewClassName}>
          {/* 뒤쪽 카테고리 이미지 */}
          <img
            src={category_set}
            alt=""
            className="absolute bottom-[0.75em] left-1/2 h-[80%] w-[72%] -translate-x-1/2 object-contain"
          />

          {/* 앞쪽 라벨 */}
          <div className="absolute top-[0.75em] left-[0.75em] z-10 flex gap-[0.375em]">
            {['4지선다 5문제', '8개 카테고리'].map((label) => (
              <span
                key={label}
                className="whitespace-nowrap rounded-full border border-blue-60 bg-white px-[1.15em] py-[0.55em] text-[0.875em] font-bold text-blue-60"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      );

    //시간외 거래
    case 'afterhours':
      return (
        <div aria-hidden="true" className={previewClassName}>
          {/* 타이머 */}
          <div className="mx-auto w-[64%] pt-[1.5em]">
            <div className="relative h-px bg-gray-40">
              <div className="absolute inset-y-0 left-0 w-1/4 bg-red-55" />

              <span className="absolute top-1/2 left-1/4 size-[0.5em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-55" />

              <span className="absolute top-1/2 right-0 size-[0.5em] translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-40" />
            </div>

            <p className="mt-[0.25em] text-center text-[1em] font-bold text-red-55">
              00:45
            </p>
          </div>

          <div className="absolute top-[5.5em] left-[1em] inline-flex rounded-full bg-gray-05 text-[0.75em] font-semibold">
            <span className="px-[1.3em] py-[0.65em] text-gray-60">
              정규장 랭킹
            </span>

            <span className="rounded-full border border-blue-60 bg-white px-[1.3em] py-[0.65em] text-blue-60">
              시간외거래 랭킹
            </span>
          </div>

          <div className="absolute inset-x-[1em] bottom-[1.5em] flex h-[3.5em] items-center gap-[0.75em] rounded-[1.25em] border border-blue-60 bg-blue-08 px-[1em] text-blue-60">
            <span className="w-[2.25em] shrink-0 text-[1em] font-bold">
              125
            </span>

            <div className="size-[2.5em] shrink-0 overflow-hidden rounded-full border border-blue-15 bg-white">
              <img
                src={basic_1}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>

            <span className="min-w-0 flex-1 whitespace-nowrap text-[1em] font-semibold">
              COZ:Y_화팅
            </span>

            {/* 정답 개수 */}
            <div className="flex shrink-0 items-center gap-[0.5em] rounded-[0.5em] border border-blue-60 bg-blue-05 px-[0.75em] py-[0.5em]">
              <img
                src={green_circle}
                alt=""
                className="size-[0.75em] object-contain"
              />

              <span className="text-[1em] font-bold">22</span>
            </div>
          </div>
        </div>
      );

    //연속학습
    case 'streak':
      return (
        <div aria-hidden="true" className={`${previewClassName} @container`}>
          {/* 월~일 학습 기록 */}
          <div className="mx-auto flex w-[74%] justify-between pt-[1.5em]">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <div
                key={day}
                className="flex min-w-0 flex-col items-center gap-[0.25em]"
              >
                <img
                  src={
                    index < 4
                      ? completeImage
                      : index === 4
                        ? completetoday
                        : incompleteImage
                  }
                  alt=""
                  className="size-[2em] object-contain"
                />

                <span
                  className={`text-[0.75em] ${
                    index === 4 ? 'font-semibold text-gray-60' : 'text-gray-40'
                  }`}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* 이펙트 단계 */}
          <div className="mx-[1em] mt-[1.25em] flex items-center justify-center gap-[0.25em]">
            {STREAK_EFFECTS.map((effect, index) => (
              <Fragment key={effect.days}>
                <div
                  className={`relative flex h-[5em] w-[4.25em] shrink-0 flex-col items-center justify-end rounded-[0.5em] border pb-[0.375em] text-center ${
                    index < 2
                      ? 'border-yellow-45 bg-yellow-05'
                      : index === 2
                        ? 'border-dashed border-yellow-45 bg-white'
                        : 'border-gray-20 bg-gray-05'
                  }`}
                >
                  {effect.image ? (
                    <img
                      src={effect.image}
                      alt=""
                      className="absolute top-0 left-1/2 size-[3.25em] -translate-x-1/2 object-contain"
                    />
                  ) : (
                    <span className="absolute top-[0.5em] text-[1.5em] font-semibold text-gray-40">
                      ?
                    </span>
                  )}

                  <span className="relative text-[0.75em] text-gray-60">
                    {effect.days}일
                  </span>

                  <span className="relative mt-[0.125em] whitespace-nowrap text-[0.75em] font-semibold text-gray-60">
                    {effect.name}
                  </span>
                </div>

                {index < STREAK_EFFECTS.length - 1 && (
                  <span className="shrink-0 text-[0.875em] text-gray-40">
                    ›
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      );

    case 'start':
      return (
        <div
          aria-hidden="true"
          className="relative @container min-w-0 shrink-0 overflow-hidden rounded-[1.25em] border border-blue-15 bg-blue-05"
        >
          <div className="p-[min(16px,3.23cqi)] text-[min(14px,2.82cqi)]">
            <div className="flex justify-center">
              <p className="whitespace-nowrap rounded-full border border-blue-60 bg-white px-[1.2em] py-[0.65em] text-center leading-[1.4] text-gray-80">
                가입·출석 보상을 모두 받으면{' '}
                <strong className="font-bold text-blue-60">FISH 300개</strong>로
                시작해요!
              </p>
            </div>

            <div className="mt-[1.2em] grid grid-cols-3 gap-[1.5em]">
              {[
                { label: '가입 보상', amount: '+200', badge: '처음 1번' },
                { label: '출석 보상', amount: '+100', badge: '매일 1번' },
                { label: '모두 받으면', amount: '300', badge: null },
              ].map((reward, index) => (
                <div
                  key={reward.label}
                  className={`relative flex aspect-square min-w-0 flex-col items-center justify-center gap-[0.55em] rounded-[1.5em] border bg-white px-[0.5em] py-[0.65em] ${index === 2 ? 'border-blue-60' : 'border-white'}`}
                >
                  <p className="whitespace-nowrap font-medium leading-[1.4] text-gray-60">
                    {reward.label}
                  </p>
                  <div className="flex items-center justify-center gap-[0.5em]">
                    <img
                      src={fishImage}
                      alt=""
                      className="size-[2em] shrink-0 object-contain"
                    />
                    <strong className="text-[2em] leading-none font-semibold text-blue-60">
                      {reward.amount}
                    </strong>
                  </div>
                  {reward.badge ? (
                    <span className="whitespace-nowrap rounded-full border border-blue-60 px-[1.1em] py-[0.6em] leading-[1.4] font-bold text-blue-60">
                      {reward.badge}
                    </span>
                  ) : (
                    <span className="h-[2.6em]" />
                  )}
                  {index < 2 && (
                    <span className="absolute top-1/2 left-full flex w-[1.5em] -translate-y-1/2 items-center">
                      <span className="h-[0.15em] flex-1 bg-white" />
                      <span className="border-y-[0.4em] border-l-[0.65em] border-y-transparent border-l-white" />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-[1.4em] grid grid-cols-[0.9fr_1.35fr] items-center gap-[1em]">
              <div className="min-w-0">
                <p className="whitespace-nowrap font-semibold leading-[1.5] text-gray-80">
                  보상 수령 후 사용 예시
                </p>
                <p className="mt-[0.8em] whitespace-nowrap text-[0.875em] leading-[1.7] text-blue-60">
                  두 모드를 한 번씩 풀면
                  <br />
                  FISH {300 - DAILY_FISH_COST - TIME_ATTACK_FISH_COST}개가
                  남아요.
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-[0.45em]">
                {[
                  {
                    label: '정규장 5문제',
                    cost: DAILY_FISH_COST,
                    icon: dailyQuizIcon,
                  },
                  {
                    label: '시간외거래 1분',
                    cost: TIME_ATTACK_FISH_COST,
                    icon: timeAttackIcon,
                  },
                ].map((quiz) => (
                  <div
                    key={quiz.label}
                    className="flex min-w-0 items-center gap-[0.65em] rounded-full border border-gray-20 bg-white px-[1em] py-[0.4em]"
                  >
                    <img
                      src={quiz.icon}
                      alt=""
                      className="size-[2.1em] shrink-0 object-contain"
                    />
                    <span className="whitespace-nowrap font-semibold text-gray-80">
                      {quiz.label}
                    </span>
                    <span className="ml-auto whitespace-nowrap text-blue-60">
                      FISH {quiz.cost}개
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
  }
}
