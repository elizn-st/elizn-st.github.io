/**
 * The trailing window every dashboard reads its numbers from.
 *
 * Runtime list as well as a type, so a Console-edited id can be validated --
 * the id decides how many weeks are in scope, and only the label is copy.
 */
export const RANGE_IDS = ['1W', '4W', '8W', 'ALL'] as const;

export type RangeId = (typeof RANGE_IDS)[number];

/**
 * One button on the range control. The options themselves are copy, authored
 * in the board documents and validated against RANGE_IDS on read, so a label
 * can be renamed in the Console without changing what the button selects.
 */
export interface RangeOption {
  readonly id: RangeId;
  readonly label: string;
}

/** Used only when a document somehow carries no options at all. */
export const DEFAULT_RANGE: RangeId = '8W';

/** Weeks each range covers; `null` means "however many there are". */
const RANGE_WEEKS: Readonly<Record<RangeId, number | null>> = {
  '1W': 1,
  '4W': 4,
  '8W': 8,
  ALL: null,
};

/**
 * How many weeks the range actually covers, given what the series holds.
 *
 * Clamped, so a window longer than the history shows the history rather than
 * padding it out with weeks that were never recorded.
 */
export const weeksIn = (range: RangeId, available: number): number => {
  const weeks = RANGE_WEEKS[range];
  return weeks === null ? available : Math.min(weeks, available);
};

/** The trailing slice of a weekly series. */
export const windowOf = <T>(items: readonly T[], range: RangeId): readonly T[] =>
  items.slice(items.length - weeksIn(range, items.length));

export const sum = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0);

export const mean = (values: readonly number[]): number =>
  values.length === 0 ? 0 : sum(values) / values.length;

export const isRangeId = (value: unknown): value is RangeId =>
  (RANGE_IDS as readonly unknown[]).includes(value);
