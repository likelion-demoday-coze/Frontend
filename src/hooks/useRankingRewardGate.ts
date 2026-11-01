import { useLayoutEffect, useState } from 'react';
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
  const [id] = useState(() => Symbol('ranking-reward-blocker'));
  useLayoutEffect(() => {
    if (!blocked) return;
    useRankingRewardGate.getState().add(id);
    return () => useRankingRewardGate.getState().remove(id);
  }, [blocked, id]);
  return id;
};

export const useCanShowRankingReward = (ownBlocker?: symbol) =>
  useRankingRewardGate((state) =>
    [...state.blockers].every((id) => id === ownBlocker)
  );
