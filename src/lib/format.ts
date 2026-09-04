/** Trend direction shared by deltas, sparklines and badges. */
export type Tone = 'up' | 'down' | 'flat';

/** AED currency label used across every price and revenue figure. */
export const aed = (value: number): string => `AED ${value.toLocaleString('en-US')}`;

/** Maps a signed number onto its trend tone. */
export const toneOf = (value: number): Tone => (value > 0 ? 'up' : value < 0 ? 'down' : 'flat');

/** Signed percentage with one decimal, e.g. `+3.4%`. */
export const signedPct = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

/** Signed integer-ish percentage, e.g. `-28%` (factor contribution). */
export const signedInt = (value: number): string => `${value > 0 ? '+' : ''}${value}%`;

/** `+4.1%` style gap label derived from two absolute values. */
export const gapPct = (value: number, against: number): string => {
  const delta = ((value - against) / against) * 100;
  return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
};
