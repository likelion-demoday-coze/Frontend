import basicCat from '../assets/character/basic_1.svg';
import bigHandCat from '../assets/character/basic_2.svg';
import nobleCat from '../assets/character/basic_3.svg';
import type { CharacterStage } from '../types/member';

const characterImages: Record<CharacterStage, string> = {
  BEGINNER: basicCat,
  BIG_HAND: bigHandCat,
  NOBLE: nobleCat,
};

//주가 단계별 대표 캐릭터 이미지 (패스 전용 캐릭터는 추후 여기에 조건 추가)
export const getCharacterImage = (stage: CharacterStage) =>
  characterImages[stage] ?? basicCat;
