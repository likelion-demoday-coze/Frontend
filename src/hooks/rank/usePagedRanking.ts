import { useCallback, useEffect, useRef, useState } from 'react';
import useAuthstore from '../../stores/useAuthStore';
import type { MyRank, RankItem } from '../../types/ranking';

// 화면용 응답 모양 (탭마다 서버 필드는 다르지만, 어댑터가 이 모양으로 맞춰 줌)
export interface RankingPageResult {
  items: RankItem[];
  totalMemberCount: number;
  hasNext: boolean;
  my: { rank: number; score: string | number } | null; // 오늘 미참여면 null
  stats: { label: string; value: string }[];
}

export const usePagedRanking = (
  fetchPage: (page: number) => Promise<RankingPageResult>,
  enabled: boolean
) => {
  const nickname = useAuthstore((s) => s.member?.nickname ?? '');

  //화면에 보일 값
  const [items, setItems] = useState<RankItem[]>([]);
  const [meta, setMeta] = useState<Omit<
    RankingPageResult,
    'items' | 'hasNext'
  > | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');

  // 기록용
  const nextPageRef = useRef(0); // 다음에 불러올 페이지 번호
  const hasNextRef = useRef(true);
  const loadingRef = useRef(false); // 요청 중 중복 방지

  // fetchPage가 바뀌어도 loadMore를 새로 만들지 않도록 ref에 최신 함수를 보관
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextRef.current) return;
    loadingRef.current = true;
    setStatus('loading');
    try {
      const response = await fetchPageRef.current(nextPageRef.current);

      // 이미 있는 회원은 건너뛰고 이어 붙임 (순위가 바뀌어 중복되는 경우 방지)
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.memberId));
        return [
          ...prev,
          ...response.items.filter((n) => !seen.has(n.memberId)),
        ];
      });
      setMeta({
        totalMemberCount: response.totalMemberCount,
        my: response.my,
        stats: response.stats,
      });

      hasNextRef.current = response.hasNext;
      setHasNext(response.hasNext);
      nextPageRef.current += 1; // 성공했을 때만 다음 페이지로
      setStatus('idle');
    } catch {
      setStatus('error');
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // 탭에 처음 들어왔을 때 -> 첫 페이지를 불러옴
  useEffect(() => {
    if (enabled && nextPageRef.current === 0) loadMore();
  }, [enabled, loadMore]);

  // 내 순위를 MyRank로 변환
  const me: MyRank | undefined = meta?.my
    ? { rank: meta.my.rank, nickname, score: meta.my.score }
    : undefined;

  return {
    items,
    me,
    stats: meta?.stats ?? [],
    totalMemberCount: meta?.totalMemberCount ?? 0,
    hasNext,
    status,
    loadMore,
  };
};
