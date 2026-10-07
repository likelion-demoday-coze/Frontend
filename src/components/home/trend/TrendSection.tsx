import { useState, useEffect } from 'react';
import { getTodayEconomicTrends } from '../../../api/trend';
import SectionTitle from '../../common/SectionTitle';
import type { EconomicTrendItem } from '../../../types/trend';

import TrendCard from './TrendCard';
import TrendModal from './TrendModal';

type LoadStore = 'loading' | 'done' | 'error';

const TrendSection = () => {
  const [items, setItems] = useState<EconomicTrendItem[]>([]);
  const [status, setStatus] = useState<LoadStore>('loading');
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
          [...res.items].sort((a, b) => a.displayOrder - b.displayOrder)
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
      {status === 'loading' && (
        <p className="mt-4 text-sm text-gray-500" role="status">
          오늘의 경제 트렌드를 불러오는 중이에요.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-500" role="alert">
          경제 트렌드를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {status === 'done' &&
        //받아오긴 했는데 데이터가 없을 때
        (message ? (
          <p className="mt-4 text-sm text-gray-500" role="status">
            {message}
          </p>
        ) : (
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
        ))}
      {selectedIndex !== null && (
        <TrendModal
          items={items}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
};

export default TrendSection;
