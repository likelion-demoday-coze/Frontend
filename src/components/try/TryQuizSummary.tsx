import kakaologo from '../../assets/landing/kakao_login_logo.svg';
import ReviewList from '../quiz/ReviewList';
import type { ReviewItem } from '../quiz/ReviewList';
import { startKaKaoLogin } from '../../api/auth';

interface TryQuizSummaryProps {
  items: ReviewItem[];
  startStock: number;
  finalStock: number;
}

//맛보기 3문제를 다 풀면 나오는 총정리 (해설 확인 후 카카오 가입 유도)
const TryQuizSummary = ({
  items,
  startStock,
  finalStock,
}: TryQuizSummaryProps) => {
  const correctCount = items.filter((item) => item.correct).length;
  const changePercent = ((finalStock - startStock) / startStock) * 100;

  return (
    <div className="flex flex-col items-center gap-16 lg:gap-25">
      <div className="flex w-full flex-col gap-6 lg:gap-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-black lg:text-[28px]">
              맛보기 투자 총정리
            </h1>
            <p className="text-base font-medium break-keep text-gray-60 lg:text-lg">
              총 {items.length}문제 중 {correctCount}문제를 맞혔어요. 문제와
              해설을 확인해 보세요.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-blue-15 bg-white px-5 py-4 lg:shrink-0">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-40">맛보기 주가</span>
              <div className="flex items-end gap-3">
                <span className="text-xl font-medium text-black">
                  {startStock.toFixed(2)}
                </span>
                <span aria-hidden="true" className="pb-0.5 text-gray-40">
                  →
                </span>
                <strong className="text-2xl font-bold text-blue-50">
                  {finalStock.toFixed(2)}
                </strong>
                <span
                  className={`pb-0.5 text-sm font-bold ${changePercent > 0 ? 'text-blue-50' : 'text-gray-40'}`}
                >
                  {changePercent > 0
                    ? `▲ ${changePercent.toFixed(2)}%`
                    : '변동 없음'}
                </span>
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-40">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-4 shrink-0 fill-current"
              >
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm.75 10.5h-1.5v-4h1.5v4Zm0-5.5h-1.5V4.5h1.5V6Z" />
              </svg>
              맛보기 투자 결과는 계정 생성시 반영되지 않아요.
            </p>
          </div>
        </div>
        <ReviewList items={items} />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-center text-base font-medium break-keep text-gray-80 lg:text-lg">
          맛보기는 여기까지! 로그인하고 진짜 내 주가를 키워보세요
        </p>
        <button
          type="button"
          onClick={startKaKaoLogin}
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-lg font-semibold text-black hover:brightness-95 lg:h-16.75 lg:w-101 lg:text-[22px]"
        >
          <img src={kakaologo} alt="" aria-hidden="true" />
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
};

export default TryQuizSummary;
