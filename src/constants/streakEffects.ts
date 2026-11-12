import footprint from '../assets/home/streak/1st_footprint.svg';
import bronze from '../assets/home/streak/2nd_bronze.svg';
import feather from '../assets/home/streak/3rd_feather.svg';
import silver from '../assets/home/streak/4th_silver.svg';
import leaf from '../assets/home/streak/5th_leaf.svg';
import gold from '../assets/home/streak/6th_gold.svg';
import flower from '../assets/home/streak/7th_flower.svg';
import treasure from '../assets/home/streak/8th_treasure.svg';

// 캐릭터 API는 달성한 효과 중 가장 높은 단계 하나만 반환
export const STREAK_EFFECT_STEPS = [
  { days: 2, name: '발자국', effect: 'PAW_PRINT' },
  { days: 3, name: '동전', effect: 'GLOWING_BASE' },
  { days: 5, name: '깃털', effect: 'FEATHER' },
  { days: 7, name: '은화', effect: 'AURA' },
  { days: 10, name: '은행잎', effect: 'GINKGO_LEAF' },
  { days: 14, name: '금화', effect: 'GOLDEN_HALO' },
  { days: 17, name: '황금꽃', effect: 'GOLDEN_FLOWER' },
  { days: 21, name: '시크릿', effect: 'COIN_BACKGROUND' },
] as const;

export const STREAK_EFFECT_IMAGES: Record<number, string> = {
  2: footprint,
  3: bronze,
  5: feather,
  7: silver,
  10: leaf,
  14: gold,
  17: flower,
  21: treasure,
};
