export type PassOrCash =
  { hasPass: true; remainingDays: number } | { hasPass: false; status: 'loading' | 'inactive' | 'error' };
