import completeImage from '../../assets/streak/complete.svg';
import incompleteImage from '../../assets/streak/incomplete.svg';
import catImage from '../../assets/character/basic_pose_cat.svg';
import completetoday from '../../assets/streak/complete_today.svg';
import fishImage from '../../assets/payment/Fish.svg';

//카드와 카드 사이를 묶음
import { Fragment } from 'react';

export type PreviewType =
  'welcome' | 'stock' | 'regular' | 'afterhours' | 'streak' | 'start';

const CATEGORIES = [
  '거시경제',
  '금융시장',
  '주식·투자',
  '금리·채권',
  '환율·국제',
  '부동산',
  '기업·재무',
  '생활경제',
];

const STOCK_LEVELS = [
  { name: '초보냥', stock: '100방울' },
  { name: '큰손냥', stock: '1,000방울' },
  { name: '귀족냥', stock: '100,000방울' },
];

const STREAK_EFFECTS = [
  { days: 3, name: '받침' },
  { days: 7, name: '오라' },
  { days: 14, name: '후광' },
  { days: 21, name: '시크릿' },
];

//큰 네모박스의 클래스네임을 저장
export default function TutorialPreview({ type }: { type: PreviewType }) {
  const previewClassName =
    'relative h-50 shrink-0 overflow-hidden rounded-2xl border border-blue-15 bg-blue-05';

  switch (type) {
    // 맨 처음
    case 'welcome':
      return (
        <div aria-hidden="true" className={previewClassName}>
          <div className="absolute right-24 top-8"></div>
        </div>
      );

    // 내 주가
    case 'stock':
      return (
        <div aria-hidden="true" className={previewClassName}>
          <div className="absolute left-6 top-4 z-10 flex items-end gap-4">
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

          <svg
            viewBox="0 0 480 200"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
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

          <div className="absolute inset-x-4 bottom-2 flex items-center">
            {STOCK_LEVELS.map((level, index) => (
              <Fragment key={level.name}>
                <div
                  className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border bg-white px-2 py-2 text-center justify-between ${
                    index === 0 ? 'border-yellow-45' : 'border-gray-20'
                  }`}
                >
                  <img
                    src={catImage}
                    alt=""
                    className="size-13 scale-180 shrink-0 object-contain"
                  />

                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="text-[14px] font-semibold text-black">
                      {level.name}
                    </p>
                    <p className="whitespace-nowrap text-[11px] text-gray-40">
                      {level.stock}
                    </p>
                  </div>
                </div>

                {index < STOCK_LEVELS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm p-1 text-gray-40"
                  >
                    &gt;
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
          <div className="mx-auto max-w-90 px-3 pt-6">
            <div className="flex gap-6 pr-16">
              {['4지선다 5문제', '8개 카테고리'].map((label) => (
                <span
                  key={label}
                  className="whitespace-nowrap rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-white"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {CATEGORIES.map((category) => (
                <span
                  key={category}
                  className="flex h-9 items-center justify-center rounded-xl border border-blue-15 bg-white text-[14px] font-semibold text-gray-60"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute right-12 top-1"></div>
        </div>
      );

    //시간외 거래
    case 'afterhours':
      return (
        <div aria-hidden="true" className={previewClassName}>
          <div className="m-2.5 flex h-14 items-center justify-center gap-7 rounded-2xl bg-white px-6">
            <div className="flex-1">
              <div className="relative h-0.5 bg-gray-20">
                <div className="h-full w-1/4 bg-red-55" />
                <span className="absolute left-1/4 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-red-55" />
                <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-gray-20" />
              </div>

              <p className="mt-1 text-center text-red-55">00:45</p>
            </div>

            <span className="rounded-xl border border-blue-50 bg-blue-05 px-3 py-1 font-semibold text-blue-60">
              <span className="mr-2 text-green-40">●</span>
              02
            </span>
          </div>

          <div className="ml-2.5 mt-4 inline-flex rounded-full bg-white/80 text-xs font-semibold">
            <span className="rounded-full border border-blue-60 bg-white px-5 py-2 text-blue-60">
              정규장 랭킹
            </span>
            <span className="px-5 py-2 text-gray-60">시간외거래 랭킹</span>
          </div>

          <div className="absolute inset-x-2.5 bottom-1.5 h-15 rounded-3xl bg-gray-20" />

          <div className="absolute bottom-7 left-1/2"></div>
        </div>
      );
    //연속학습
    case 'streak':
      return (
        <div aria-hidden="true" className={previewClassName}>
          <div className="mx-auto flex max-w-90 justify-between px-2 pt-6">
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
                <span className="text-xs text-gray-60">{day}</span>
              </div>
            ))}
          </div>

          <div className="mx-5 mt-5 flex items-center justify-center gap-1">
            {STREAK_EFFECTS.map((effect, index) => (
              <div
                key={effect.days}
                className="flex min-w-0 items-center gap-1"
              >
                <div className="flex h-20 w-20 flex-1 flex-col justify-end rounded-xl border border-yellow-45 bg-white p-1 text-center text-xs">
                  <span className="text-gray-40">{effect.days}일</span>
                  <span className="mt-1 text-black">{effect.name}</span>
                </div>

                {index < STREAK_EFFECTS.length - 1 && (
                  <span className="text-gray-60">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    case 'start':
      return (
        <div aria-hidden="true" className={previewClassName}>
          <div className="flex h-full flex-col justify-end gap-4 px-6 pb-8">
            <div className="flex items-center gap-4">
              <span className="w-23 shrink-0 text-sm text-gray-60">
                지금 내 생선
              </span>

              <div className="flex items-center gap-2">
                <img src={fishImage} alt="" className="size-7 object-contain" />
                <span className="text-2xl font-bold text-black">0</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-23 shrink-0 text-sm text-gray-60">
                출석 보상 받으면
              </span>

              <div className="flex items-center gap-2">
                <img src={fishImage} alt="" className="size-7 object-contain" />
                <span className="text-2xl font-bold text-black">100</span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <span className="whitespace-nowrap text-xl font-bold text-black">
                  정규장
                </span>
                <span className="whitespace-nowrap text-xs text-gray-60">
                  바로 입장 가능 (-50)
                </span>
              </div>
            </div>
          </div>
        </div>
      );
  }
}
