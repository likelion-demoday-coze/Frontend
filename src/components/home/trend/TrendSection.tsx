import { useState, useEffect } from 'react';
import {
  getEconomicTrendDetail,
  getTodayEconomicTrends,
} from '../../../api/trend';
import SectionTitle from '../../common/SectionTitle';
import type {
  EconomicTrendDetail,
  EconomicTrendItem,
} from '../../../types/trend';

import TrendCard from './TrendCard';
import { MOCK_TRENDS } from '../../../mocks/trendMock';

//정적 데이터
const TOTAL_TRENDS = 3;

type LoadStore = 'loading' | 'done' | 'error';

const TrendSection = () => {
  const [items, setItems] = useState<EconomicTrendItem[]>([]);
  const [status, setStatus] = useState<LoadState>('loading');
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    getTodayEconomicTrends()
      .then((res) => {
        if (ignore) return;
        if (res.status === 'PREPARING') {
          setMessage(res.message || '오늘의 경제 트렌드를 준비하고 있어요.');
          setStatus('done'); //처리 완료
          return;
        }
        //준비 완료된 트랜드 개수가 반드시 3개여야되는지 검토 필요
        setItems(
          [...res.items].sort((a, b) => (a.displayOrder = b.displayOrder))
        );
        setStatus('done');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <div>
      <SectionTitle
        title="오늘의 경제 트렌드"
        subtitle="라이너 API와 함께합니다."
      />
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
        {items.map((item, index) => (
          <TrendCard
            key={item.trendId}
            category="경제 트렌드"
            title={item.title}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendSection;
