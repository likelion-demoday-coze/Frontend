import { useEffect, useState } from 'react';
import { getStockRanking, getTimeAttackRanking } from '../../api/ranking';
import type { MyRankSummary } from '../../types/myRank';

export const useMyRankSummary = () => {
  const [data, setData] = useState<MyRankSummary[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'done'>('loading');

  useEffect(() => {
    let ignore = false; // 화면을 떠난 뒤 늦게 온 응답 무시

    // 두 API를 동시에 호출 (size=1: 목록은 필요 없고 내 순위(myRanking)만 필요해서)
    Promise.all([getStockRanking(0, 1), getTimeAttackRanking(0, 1)])
      .then(([stock, timeAttack]) => {
        if (ignore) return;
        const cards: MyRankSummary[] = [];

        // 정규장 카드: 내 기록이 있을 때만
        if (stock.myRanking) {
          cards.push({
            title: '주가 랭킹',
            rank: stock.myRanking.rankingPosition,
            stats: [
              { label: '상위', value: `${stock.myRanking.topPercent}%` },
              { label: '주가', value: stock.myRanking.currentStock.toFixed(2) },
            ],
          });
        }

        // 시간외거래 카드: 오늘 참여했을 때만
        if (timeAttack.myRanking) {
          cards.push({
            title: '시간외거래 랭킹',
            rank: timeAttack.myRanking.rankingPosition,
            stats: [
              { label: '상위', value: `${timeAttack.myRanking.topPercent}%` },
              {
                label: '최고',
                value: `${timeAttack.myRanking.correctCount}문제`,
              },
            ],
          });
        }

        setData(cards);
        setStatus('done');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });

    // 정리 함수: 화면을 떠나면 이후에 오는 응답을 무시
    return () => {
      ignore = true;
    };
  }, []);

  return { data, status };
};
