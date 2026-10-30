import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import type { RankingType } from '../types/ranking';
import PageTitleSection from '../components/common/PageTitle';
import TapToggle from '../components/ranking/TapToggle';
import RankList from '../components/ranking/rank/RankList'; //랭킹
import MyRankPanel from '../components/ranking/MyRankPanel';
import RankingRewardBanner from '../components/ranking/RankingRewardBanner';
import { ROUTES } from '../constants/routes';
import {
  fetchStockPage,
  fetchTimeAttackPage,
} from '../hooks/rank/rankingAdapter';
import { useIntersect } from '../hooks/rank/useIntersect';
import { usePagedRanking } from '../hooks/rank/usePagedRanking';

const TABS = [
  { key: 'regular', label: '정규장 랭킹' },
  { key: 'afterhours', label: '시간외거래 랭킹' },
] as const;

// 탭별로 달라지는 문구
const CONFIG: Record<
  RankingType,
  {
    title: string;
    description: string;
    notice?: string;
    criteria: string;
    actionLabel: string;
  }
> = {
  regular: {
    title: '주가 랭킹',
    description: '꾸준한 정규장 학습으로 복리 수익을 누린 상위 투자자들입니다',
    criteria: '누적 주가(정규장) 기준',
    actionLabel: '주가 올리러 가기',
  },
  afterhours: {
    title: '시간외거래 정답 랭킹',
    description: '1분 안에 가장 많은 정답을 맞혀보세요!',
    notice: '매일 자정(00:00)에 랭킹이 초기화됩니다.',
    criteria: '오늘의 최고 기록 기준',
    actionLabel: '순위 올리러 가기',
  },
};

// 탭마다 CTA 버튼이 가는 곳 (컴포넌트 밖: 값이 고정이라 매번 만들 필요 없음)
const ACTION_PATH: Record<RankingType, string> = {
  regular: ROUTES.QUIZ, // 정규장 → 문제 풀이
  afterhours: ROUTES.QUIZ, // 시간외거래 → 타임어택
};

const RankingPage = () => {
  const [params, setParams] = useSearchParams();
  const type: RankingType =
    params.get('tab') === 'afterhours' ? 'afterhours' : 'regular';
  const c = CONFIG[type];

  const navigate = useNavigate();

  const stock = usePagedRanking(fetchStockPage, type === 'regular');
  const timeAttack = usePagedRanking(
    fetchTimeAttackPage,
    type === 'afterhours'
  );
  const view = type === 'regular' ? stock : timeAttack;

  const scrollRef = useRef<HTMLDivElement>(null);

  // 목록 맨 아래의 감시 요소가 화면에 보이면 다음 20개를 불러옴
  const sentinelRef = useIntersect(
    view.loadMore,
    view.hasNext && view.status !== 'error', // 실패하면 자동 재시도하지 않음
    view.loadedCount, // view.items.length → view.loadedCount
    scrollRef
  );

  return (
    <div className="-mx-6 w-[calc(100%+48px)] max-w-260 lg:mx-auto lg:w-full">
      <div className="flex justify-center border-b border-gray-20 px-4 pb-3 lg:justify-start lg:border-0 lg:px-0 lg:pb-0">
        <TapToggle
          tabs={TABS}
          value={type}
          onChange={(key) => setParams({ tab: key }, { replace: true })}
        />
      </div>

      <div className="sr-only lg:not-sr-only lg:mt-9.5">
        <PageTitleSection title={c.title} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[18px] text-gray-60">{c.description}</p>
          {c.notice && <p className="text-xs text-blue-60">{c.notice}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-10 lg:mt-10 lg:flex-row lg:gap-18">
        <div className="min-w-0 flex-1">
          <div className="px-5 lg:px-0">
            <RankingRewardBanner />
          </div>
          <div
            ref={scrollRef}
            className="max-h-[calc(100dvh-16rem)] overflow-y-auto lg:max-h-[calc(100vh-24rem)]"
          >
            <RankList
              key={type}
              me={view.me}
              items={view.items}
              isStock={type === 'regular'}
            />

            {/* 이 요소가 화면 근처에 오면 다음 페이지를 불러옴 */}
            <div ref={sentinelRef} className="h-px" />

            {view.status === 'loading' && (
              <p className="py-6 text-center text-sm text-gray-60">
                불러오는 중...
              </p>
            )}
            {view.status === 'error' && (
              <div className="py-6 text-center text-sm text-gray-60">
                <p>랭킹을 불러오지 못했어요.</p>
                <button
                  type="button"
                  onClick={view.loadMore}
                  className="mt-2 cursor-pointer font-bold text-blue-60"
                >
                  다시 시도
                </button>
              </div>
            )}
            {view.status === 'idle' && view.items.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-60">
                아직 랭킹 기록이 없어요.
              </p>
            )}
          </div>
        </div>

        {/* 내 기록이 없으면(오늘 미참여 등) 패널을 숨김 → 시안 확인 후 정하기 */}
        {(view.me || type === 'afterhours') && (
          <div className="hidden lg:block">
            <MyRankPanel
              criteria={c.criteria}
              actionLabel={c.actionLabel}
              rank={view.me?.rank ?? null}
              emptyMessage={
                type === 'afterhours' && view.status === 'idle' && !view.me
                  ? '오늘은 아직 참여하지 않았어요!'
                  : undefined
              }
              lastRank={view.totalMemberCount}
              stats={
                view.stats.length
                  ? view.stats
                  : [
                      { label: '상위', value: '-' },
                      { label: '나의 최고 기록', value: '-' },
                      { label: '유저 평균 정답수', value: '-' },
                    ]
              }
              onAction={() => navigate(ACTION_PATH[type])}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default RankingPage;
