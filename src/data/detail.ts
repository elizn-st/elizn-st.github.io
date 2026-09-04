import type { DecisionStatus } from './queue';

export interface FactorContribution {
  readonly name: string;
  readonly value: number;
}

export const FACTOR_CONTRIBUTIONS: readonly FactorContribution[] = [
  { name: 'Competitor position', value: -46 },
  { name: 'Stock on hand', value: -28 },
  { name: 'Demand / seasonality', value: 16 },
  { name: 'Margin constraint', value: -10 },
];

export interface HistoryPreviewEntry {
  readonly date: string;
  readonly reason: string;
  readonly status: DecisionStatus;
  readonly hasComment: boolean;
}

export const HISTORY_PREVIEW: readonly HistoryPreviewEntry[] = [
  {
    date: 'Jul 29, 2026',
    reason: 'Aligned with competitor position',
    status: 'approved',
    hasComment: true,
  },
  {
    date: 'Jul 22, 2026',
    reason: 'Margin protection guardrail',
    status: 'approved',
    hasComment: false,
  },
  {
    date: 'Jul 15, 2026',
    reason: 'Manually overridden — below target',
    status: 'rejected',
    hasComment: true,
  },
  {
    date: 'Jul 08, 2026',
    reason: 'Price floor constraint applied',
    status: 'approved',
    hasComment: false,
  },
  {
    date: 'Jul 01, 2026',
    reason: 'Competitor price spike detected',
    status: 'approved',
    hasComment: true,
  },
];

export const REASON_CODES: readonly string[] = [
  'Aligned with competitor position',
  'Margin protection guardrail',
  'Stock clearance',
  'Manual override',
];

/** Guardrail gauge bounds for the recommendation on the detail screen. */
export const GUARDRAILS = { value: 3749, floor: 3400, ceiling: 4100 } as const;
