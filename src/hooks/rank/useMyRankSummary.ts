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
        const stockMy = stock.myRanking;
        const timeAttackMy = timeAttack.myRanking;

        const cards: MyRankSummary[] = [
          {
            title: '주가 랭킹',
            rank: stockMy?.rankingPosition ?? null,
            stats: [
              {
                label: '상위',
                value: stockMy ? `${stockMy.topPercent}%` : '-',
              },
              {
                label: '주가',
                value: stockMy ? stockMy.currentStock.toFixed(2) : '-',
              },
            ],
          },
          {
            title: '시간외거래 랭킹',
            rank: timeAttackMy?.rankingPosition ?? null,
            // 오늘 아직 안 했을 때만 안내문을 보여 줌
            footnote: timeAttackMy ? undefined : '오늘은 아직 기록이 없어요',
            stats: [
              {
                label: '상위',
                value: timeAttackMy ? `${timeAttackMy.topPercent}%` : '-',
              },
              {
                label: '최고',
                value: timeAttackMy ? `${timeAttackMy.correctCount}문제` : '-',
              },
            ],
          },
        ];

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
