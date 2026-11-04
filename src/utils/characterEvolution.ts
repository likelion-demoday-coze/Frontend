import { CHARACTER_STAGES } from '../constants/character';

export const CHARACTER_EVOLUTIONS = CHARACTER_STAGES.filter(
  (stage) => stage.stage !== 'BABY'
);

export type CharacterEvolution = (typeof CHARACTER_EVOLUTIONS)[number];

export const getPendingCharacterEvolution = (
  stage: string | null | undefined
) =>
  CHARACTER_EVOLUTIONS.find((evolution) => evolution.stage === stage) ?? null;
