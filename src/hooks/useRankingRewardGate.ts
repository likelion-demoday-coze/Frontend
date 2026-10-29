import { useLayoutEffect } from 'react';
import { create } from 'zustand';

interface RankingRewardGateState {
  blockers: Set<symbol>;
  add: (id: symbol) => void;
  remove: (id: symbol) => void;
}

// 연속학습 조회·팝업이 끝나기 전에는 랭킹 보상만 대기시킴
const useRankingRewardGate = create<RankingRewardGateState>((set) => ({
  blockers: new Set(),
  add: (id) => set((state) => ({ blockers: new Set(state.blockers).add(id) })),
  remove: (id) =>
    set((state) => {
      const blockers = new Set(state.blockers);
      blockers.delete(id);
      return { blockers };
    }),
}));

export const useBlockRankingReward = (blocked: boolean) => {
  useLayoutEffect(() => {
    if (!blocked) return;
    const id = Symbol('ranking-reward-blocker');
    useRankingRewardGate.getState().add(id);
    return () => useRankingRewardGate.getState().remove(id);
  }, [blocked]);
};

export const useCanShowRankingReward = () =>
  useRankingRewardGate((state) => state.blockers.size === 0);
