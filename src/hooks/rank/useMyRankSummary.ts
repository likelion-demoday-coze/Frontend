import { useEffect, useState } from 'react';
import { getStockRanking, getTimeAttackRanking } from '../../api/ranking';
import type { MyRankSummary } from '../../types/myRank';
import { ROUTES } from '../../constants/routes';

export const useMyRankSummary = () => {
  const [data, setData] = useState<MyRankSummary[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'done'>('loading');

  useEffect(() => {
    let ignore = false; // 화면을 떠난 뒤 늦게 온 응답 무시
    let refreshTimer: ReturnType<typeof setTimeout>;

    // 두 API를 동시에 호출 (size=1: 목록은 필요 없고 내 순위(myRanking)만 필요해서)
    const load = () =>
      Promise.all([getStockRanking(0, 1), getTimeAttackRanking(0, 1)])
        .then(([stock, timeAttack]) => {
          if (ignore) return;
          const stockMy = stock.myRanking;
          const timeAttackMy = timeAttack.myRanking;

          const cards: MyRankSummary[] = [
            {
              title: '주가 랭킹',
              rank: stockMy?.rankingPosition ?? null,
              footnote: `총 참여자 ${stock.totalMemberCount.toLocaleString('ko-KR')}명 중`,
              challengeTo: stockMy ? undefined : `${ROUTES.QUIZ}?mode=daily`,
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
              challengeTo: timeAttackMy
                ? undefined
                : `${ROUTES.QUIZ}?mode=timeAttack`,
              // 오늘 아직 안 했을 때만 안내문을 보여 줌
              footnote: timeAttackMy ? undefined : '오늘은 아직 기록이 없어요',
              resetAt: timeAttackMy
                ? new Date(
                    `${timeAttack.rankingDate}T00:00:00+09:00`
                  ).getTime() +
                  24 * 60 * 60 * 1000
                : undefined,
              stats: [
                {
                  label: '상위',
                  value: timeAttackMy ? `${timeAttackMy.topPercent}%` : '-',
                },
                {
                  label: '최고',
                  value: timeAttackMy
                    ? `${timeAttackMy.correctCount}문제`
                    : '-',
                },
              ],
            },
          ];

          setData(cards);
          setStatus('done');
        })
        .catch(() => {
          if (!ignore) setStatus('error');
        })
        .finally(() => {
          if (ignore) return;
          // 한국 시간 자정이 지나면 이전 날짜의 기록을 다시 조회
          const dayMs = 24 * 60 * 60 * 1000;
          const untilMidnight =
            dayMs - ((Date.now() + 9 * 60 * 60 * 1000) % dayMs);
          refreshTimer = setTimeout(() => {
            void load();
          }, untilMidnight + 1000);
        });

    void load();

    // 정리 함수: 화면을 떠나면 이후에 오는 응답을 무시
    return () => {
      ignore = true;
      clearTimeout(refreshTimer);
    };
  }, []);

  return { data, status };
};
