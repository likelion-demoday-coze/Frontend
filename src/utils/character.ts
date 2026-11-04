import basicCat from '../assets/character/basic_1.svg';
import bigHandCat from '../assets/character/basic_2.svg';
import nobleCat from '../assets/character/basic_3.svg';
import babyCat from '../assets/character/stand_0_cat.svg';
import basicStandingCat from '../assets/character/stand_pose.svg';
import bigHandStandingCat from '../assets/character/stand_2_cat.svg';
import royalStandingCat from '../assets/character/stand_3_cat.svg';
import { getCharacterStage } from '../constants/character';
import type { CharacterStage } from '../types/member';

const characterImages: Record<CharacterStage, string> = {
  BABY: babyCat,
  BASIC: basicCat,
  BIG_HAND: bigHandCat,
  ROYAL: nobleCat,
};

const standingImages: Record<CharacterStage, string> = {
  BABY: babyCat,
  BASIC: basicStandingCat,
  BIG_HAND: bigHandStandingCat,
  ROYAL: royalStandingCat,
};

//주가 단계별 대표 캐릭터 이미지 (패스 전용 캐릭터는 추후 여기에 조건 추가)
export const getCharacterImage = (stage: CharacterStage) =>
  characterImages[stage] ?? babyCat;

export const getCharacterImageByStock = (stock: number) =>
  getCharacterImage(getCharacterStage(stock).stage);

export const getStandingCharacterImage = (stage: CharacterStage) =>
  standingImages[stage] ?? babyCat;
