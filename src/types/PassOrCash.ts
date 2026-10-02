export type PassOrCash =
  { hasPass: true; remainingDays: number } | { hasPass: false; cash: number };
