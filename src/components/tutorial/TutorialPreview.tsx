import completeImage from '../../assets/streak/complete.svg';
import incompleteImage from '../../assets/streak/incomplete.svg';

import basic_1 from '../../assets/character/basic_1.svg';
import basic_2 from '../../assets/character/basic_2.svg';
import basic_3 from '../../assets/character/basic_3.svg';
import completetoday from '../../assets/streak/complete_today.svg';
import fishImage from '../../assets/store/Fish_a.svg';
import tutorial_cat from '../../assets/home/tutorial_cat.svg';
import category_set from '../../assets/home/category_log_set.svg';
import green_circle from '../../assets/stock/green_circle.svg';

import gold from '../../assets/home/streak/3th_Gold.svg';
import silver from '../../assets/home/streak/2nd_Silver.svg';
import bronze from '../../assets/home/streak/1st_bronze.svg';

//카드와 카드 사이를 묶음
import { Fragment } from 'react';

export type PreviewType =
  'welcome' | 'stock' | 'regular' | 'afterhours' | 'streak' | 'start';

const STOCK_LEVELS = [
  { name: '초보냥', stock: '100방울', image: basic_1 },
  { name: '큰손냥', stock: '1,000방울', image: basic_2 },
  { name: '귀족냥', stock: '100,000방울', image: basic_3 },
];

const STREAK_EFFECTS = [
  { days: 3, name: '동전', image: bronze },
  { days: 7, name: '은화', image: silver },
  { days: 14, name: '금화', image: gold },
  { days: 21, name: '시크릿', image: null },
];

//큰 네모박스의 클래스네임을 저장
export default function TutorialPreview({ type }: { type: PreviewType }) {
  const previewClassName =
    'relative h-50 shrink-0 overflow-hidden rounded-2xl border border-blue-15 bg-blue-05';

  switch (type) {
    // 맨 처음
    case 'welcome':
      return (
        <div
          aria-hidden="true"
          className="relative shrink-0 overflow-hidden rounded-xl border border-white bg-white"
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
        <div aria-hidden="true" className={previewClassName}>
          {/* 상단 주가 */}
          <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-end gap-2">
            <div>
              <p className="text-[14px] text-gray-40">시작 주가</p>
              <p className="mt-1 text-[20px]">100.00</p>
            </div>

            <span className="pb-1 text-xl text-gray-20">→</span>

            <p className="text-[24px] font-bold text-blue-50">
              123.61
              <span className="ml-2 text-[14px]">▲23.61%</span>
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

          {/* 진화 카드: 좁은 화면에서는 가로 스크롤 */}
          <div className="absolute inset-x-4 bottom-2 flex items-center gap-2 overflow-x-auto pb-2">
            {STOCK_LEVELS.map((level, index) => (
              <Fragment key={level.name}>
                <div
                  className={`flex h-20 min-w-[148px] flex-1 shrink-0 items-center gap-2 rounded-xl border bg-white px-2 py-2 ${
                    index === 0 ? 'border-yellow-45' : 'border-gray-20'
                  }`}
                >
                  <img
                    src={level.image}
                    alt=""
                    className="h-16 w-14 shrink-0 object-contain"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-center">
                    <p className="whitespace-nowrap text-[14px] font-semibold text-black">
                      {level.name}
                    </p>

                    <p className="whitespace-nowrap text-[11px] text-gray-40">
                      {level.stock}
                    </p>
                  </div>
                </div>

                {index < STOCK_LEVELS.length - 1 && (
                  <span className="shrink-0 text-sm text-gray-40">›</span>
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
            className="absolute bottom-3 left-1/2 h-[80%] w-[72%] -translate-x-1/2 object-contain"
          />

          {/* 앞쪽 라벨 */}
          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
            {['4지선다 5문제', '8개 카테고리'].map((label) => (
              <span
                key={label}
                className="whitespace-nowrap rounded-full border border-blue-60 bg-white px-4 py-2 text-sm font-bold text-blue-60"
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
          <div className="mx-auto w-[64%] pt-6">
            <div className="relative h-px bg-gray-40">
              <div className="absolute inset-y-0 left-0 w-1/4 bg-red-55" />

              <span className="absolute top-1/2 left-1/4 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-55" />

              <span className="absolute top-1/2 right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-40" />
            </div>

            <p className="mt-1 text-center text-[16px] font-bold text-red-55">
              00:45
            </p>
          </div>

          <div className="absolute top-19 left-4 inline-flex rounded-full bg-gray-05 text-[12px] font-semibold">
            <span className="px-4 py-2 text-gray-60">정규장 랭킹</span>

            <span className="rounded-full border border-blue-60 bg-white px-4 py-2 text-blue-60">
              시간외거래 랭킹
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-6 flex h-14 items-center gap-3 rounded-[20px] border border-blue-60 bg-blue-08 px-4 text-blue-60">
            <span className="w-9 shrink-0 text-[16px] font-bold">125</span>

            <div className="size-10 shrink-0 overflow-hidden rounded-full border border-blue-15 bg-white">
              <img
                src={basic_1}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold">
              COZ:Y_화팅
            </span>

            {/* 정답 개수 */}
            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-blue-60 bg-blue-05 px-3 py-2">
              <img
                src={green_circle}
                alt=""
                className="size-3 object-contain"
              />

              <span className="text-[16px] font-bold">22</span>
            </div>
          </div>
        </div>
      );

    //연속학습
    case 'streak':
      return (
        <div aria-hidden="true" className={previewClassName}>
          {/* 월~일 학습 기록 */}
          <div className="mx-auto flex max-w-90 justify-between px-2 pt-5">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <img
                  src={
                    index < 4
                      ? completeImage
                      : index === 4
                        ? completetoday
                        : incompleteImage
                  }
                  alt=""
                  className="size-8 object-contain"
                />

                <span
                  className={`text-xs ${
                    index === 4 ? 'font-semibold text-gray-60' : 'text-gray-40'
                  }`}
                >
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* 이펙트 단계 */}
          <div className="absolute inset-x-5 bottom-4 flex items-center justify-center gap-1">
            {STREAK_EFFECTS.map((effect, index) => (
              <Fragment key={effect.days}>
                <div
                  className={`relative flex h-20 w-17 shrink-0 flex-col items-center justify-end rounded-lg border pb-1.5 text-center text-xs ${
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
                      className="absolute top-0 left-1/2 size-13 -translate-x-1/2 object-contain"
                    />
                  ) : (
                    <span className="absolute top-2 text-2xl font-semibold text-gray-40">
                      ?
                    </span>
                  )}

                  <span className="relative text-gray-60">{effect.days}일</span>

                  <span className="relative mt-0.5 font-semibold text-gray-60">
                    {effect.name}
                  </span>
                </div>

                {index < STREAK_EFFECTS.length - 1 && (
                  <span className="shrink-0 text-sm text-gray-40">›</span>
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
          className="relative flex min-h-50 min-w-0 shrink-0 flex-col gap-3 overflow-hidden rounded-2xl border border-blue-15 bg-blue-05 p-3"
        >
          {/* 안내 문구: 줄바꿈되면 필요한 높이를 차지 */}
          <div className="flex justify-center">
            <p className="rounded-full border border-blue-60 bg-white px-4 py-2 text-center text-[12px] text-black">
              정규장 퀴즈를 풀고도{' '}
              <strong className="font-bold text-blue-60">생선 50개</strong>가
              남아요!
            </p>
          </div>

          {/* 생선 사용 흐름: 좁은 화면에서는 가로 스크롤 */}
          <div className="mt-auto flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-2">
            {/* 현재 생선 */}
            <div className="flex h-31 min-w-[120px] flex-1 shrink-0 flex-col items-center rounded-[20px] bg-white px-2 pt-3">
              <p className="whitespace-nowrap text-[13px] font-medium text-gray-60">
                지금 내 생선
              </p>

              <div className="mt-2 flex items-center justify-center gap-2">
                <img
                  src={fishImage}
                  alt=""
                  className="size-7 shrink-0 object-contain"
                />
                <span className="text-[24px] font-bold text-black">0</span>
              </div>
            </div>

            <span className="shrink-0 text-xl font-bold text-white">→</span>

            {/* 출석 보상 */}
            <div className="flex h-31 min-w-[120px] flex-1 shrink-0 flex-col items-center rounded-[20px] bg-white px-2 pt-3">
              <p className="whitespace-nowrap text-[13px] font-medium text-gray-60">
                출석 보상
              </p>

              <div className="mt-2 flex items-center justify-center gap-1">
                <img
                  src={fishImage}
                  alt=""
                  className="size-7 shrink-0 object-contain"
                />
                <span className="text-[24px] font-bold text-blue-60">+100</span>
              </div>

              <span className="mt-2 whitespace-nowrap rounded-full border border-blue-60 px-4 py-1.5 text-[12px] font-bold text-blue-60">
                매일 1번
              </span>
            </div>

            <span className="shrink-0 text-xl font-bold text-white">→</span>

            {/* 정규장 입장 */}
            <div className="flex h-31 min-w-[120px] flex-1 shrink-0 flex-col items-center rounded-[20px] bg-white px-2 pt-3">
              <p className="whitespace-nowrap text-[13px] font-medium text-gray-60">
                정규장 입장
              </p>

              <div className="mt-2 flex items-center justify-center gap-1">
                <img
                  src={fishImage}
                  alt=""
                  className="size-7 shrink-0 object-contain"
                />
                <span className="text-[24px] font-bold text-red-55">-50</span>
              </div>

              <span className="mt-2 whitespace-nowrap rounded-full border border-blue-60 px-4 py-1.5 text-[12px] font-bold text-blue-60">
                퀴즈 1회
              </span>
            </div>
          </div>
        </div>
      );
  }
}
