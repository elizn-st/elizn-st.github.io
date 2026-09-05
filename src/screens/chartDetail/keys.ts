/**
 * Charts that have a dedicated full-page view.
 *
 * Runtime list as well as a type: the copy document is keyed by these, and
 * validating a Console-edited key needs them at runtime.
 */
export const CHART_DETAIL_KEYS = [
  'c1-combo',
  'c2-grouped',
  'c3-forecast',
  'c4-impact',
  'c5-elasticity',
  'b2-price',
] as const;

export type ChartDetailKey = (typeof CHART_DETAIL_KEYS)[number];

export const DEFAULT_CHART_KEY: ChartDetailKey = 'c1-combo';
