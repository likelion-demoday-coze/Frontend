export const CHARACTER_EVOLUTIONS = [
  { stage: 'BIG_HAND', name: '큰손냥', stock: 1000 },
  { stage: 'NOBLE', name: '왕족냥', stock: 10000 },
] as const;

export type CharacterEvolution = (typeof CHARACTER_EVOLUTIONS)[number];

const acknowledged = new Map<number, number>();
const storageKey = (memberId: number) => `character-evolution:seen:${memberId}`;

const readAcknowledgedStock = (memberId: number) => {
  let stock = acknowledged.get(memberId) ?? 0;
  try {
    const stored = Number(localStorage.getItem(storageKey(memberId)));
    if (CHARACTER_EVOLUTIONS.some((item) => item.stock === stored))
      stock = Math.max(stock, stored);
  } catch {
    // 저장소를 사용할 수 없으면 현재 탭의 확인 기록 사용
  }
  return stock;
};

export const getUnseenCharacterEvolution = (
  memberId: number,
  currentStock: number
): CharacterEvolution | null => {
  const evolution = [...CHARACTER_EVOLUTIONS]
    .reverse()
    .find((item) => currentStock >= item.stock);
  return evolution && evolution.stock > readAcknowledgedStock(memberId)
    ? evolution
    : null;
};

export const acknowledgeCharacterEvolution = (
  memberId: number,
  evolution: CharacterEvolution
) => {
  const stock = Math.max(readAcknowledgedStock(memberId), evolution.stock);
  acknowledged.set(memberId, stock);
  try {
    localStorage.setItem(storageKey(memberId), String(stock));
  } catch {
    // 저장 실패 시에도 같은 탭에서 중복 표시하지 않음
  }
};
