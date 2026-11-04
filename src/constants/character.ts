export const CHARACTER_STAGES = [
  { stage: 'BABY', name: '아기냥', stock: 0 },
  { stage: 'BASIC', name: '기본냥', stock: 101 },
  { stage: 'BIG_HAND', name: '큰손냥', stock: 250 },
  { stage: 'ROYAL', name: '왕족냥', stock: 1500 },
] as const;

export const getCharacterStage = (stock: number) =>
  [...CHARACTER_STAGES].reverse().find((stage) => stock >= stage.stock) ??
  CHARACTER_STAGES[0];
