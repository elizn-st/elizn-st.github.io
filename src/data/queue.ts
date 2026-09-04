/**
 * Runtime list as well as a type: validating a Console-edited document needs
 * the allowed values at runtime, and deriving the union from the array keeps
 * the two from drifting apart.
 */
export const DECISION_STATUSES = [
  'approved',
  'pending',
  'rejected',
  'flagged',
  'overridden',
] as const;

export type DecisionStatus = (typeof DECISION_STATUSES)[number];

export interface QueueRow {
  readonly sku: string;
  readonly note: string;
  readonly current: number;
  readonly recommended: number;
  readonly delta: number;
  readonly topFactor: string;
  readonly status: DecisionStatus;
}

export const QUEUE_ROWS: readonly QueueRow[] = [
  {
    sku: 'iPhone 15 Pro 256GB',
    note: '↓ Competitor A −4%',
    current: 3899,
    recommended: 3749,
    delta: -3.8,
    topFactor: 'Competitor price lower',
    status: 'flagged',
  },
  {
    sku: 'Samsung Galaxy S24',
    note: '',
    current: 3299,
    recommended: 3299,
    delta: 0.0,
    topFactor: 'Demand stable',
    status: 'pending',
  },
  {
    sku: 'AirPods Pro 2',
    note: 'Promotional clearance',
    current: 999,
    recommended: 929,
    delta: -7.0,
    topFactor: 'Competitor promotion',
    status: 'pending',
  },
  {
    sku: 'Xiaomi 14 128GB',
    note: '',
    current: 1799,
    recommended: 1699,
    delta: -5.6,
    topFactor: 'High stock on hand',
    status: 'pending',
  },
  {
    sku: 'Galaxy Watch 6',
    note: '',
    current: 1099,
    recommended: 1149,
    delta: 4.5,
    topFactor: 'Low stock, rising demand',
    status: 'pending',
  },
  {
    sku: 'iPad Air 11 256GB',
    note: '↓ Competitor B −6%',
    current: 2599,
    recommended: 2399,
    delta: -7.7,
    topFactor: 'Seasonal dip + competitor',
    status: 'flagged',
  },
];
