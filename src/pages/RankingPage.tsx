import { useSearchParams } from 'react-router-dom';
import type { MyRank, RankItem, RankingType } from '../types/ranking';
import TapToggle from '../components/ranking/TapToggle';
import RankList from '../components/ranking/rank/RankList'; //랭킹
import MyRankPanel from '../components/ranking/MyRankPanel';

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

// 임시 데이터 (API 연동 시 교체)
const ME: MyRank = { rank: 125, change: 17, nickname: 'COZ:Y_화팅', score: 22 };

const ITEMS: RankItem[] = Array.from({ length: 8 }, (_, i) => ({
  rank: i + 1,
  nickname: '방울모아태산',
  score: 22,
}));

const STATS: Record<RankingType, { label: string; value: string }[]> = {
  regular: [
    { label: '상위', value: '13.9%' },
    { label: '나의 누적 주가', value: '275.00 방울' },
    { label: '유저 평균 주가', value: '115.30 방울' },
  ],
  afterhours: [
    { label: '상위', value: '13.9%' },
    { label: '나의 최고 기록', value: '22문제' },
    { label: '유저 평균 정답수', value: '15문제' },
  ],
};

const RankingPage = () => {
  const [params, setParams] = useSearchParams();
  const type: RankingType =
    params.get('type') === 'afterhours' ? 'afterhours' : 'regular';
  const c = CONFIG[type];

  return (
    <div>
      <TapToggle
        tabs={TABS}
        value={type}
        onChange={(key) => setParams({ type: key }, { replace: true })}
      />
      <div className="mt-9.5 flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold">{c.title}</h1>
        <p className="text-sm text-gray-60">{c.description}</p>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-18">
        <div className="mt-20 flex-1">
          {c.notice && <p className="text-xs text-blue-60">{c.notice}</p>}
          <div className="mt-4">
            <RankList me={ME} items={ITEMS} />
          </div>
        </div>

        <MyRankPanel
          criteria={c.criteria}
          actionLabel={c.actionLabel}
          rank={ME.rank}
          lastRank={200}
          stats={STATS[type]}
        />
      </div>
    </div>
  );
};
export default RankingPage;
