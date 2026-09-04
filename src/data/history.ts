import type { DecisionStatus } from './queue';

export interface AuditEntry {
  readonly date: string;
  readonly time: string;
  readonly sku: string;
  readonly from: string;
  readonly to: string;
  readonly reason: string;
  readonly reviewer: string;
  readonly status: DecisionStatus;
  readonly hasComment: boolean;
}

export const AUDIT_LOG: readonly AuditEntry[] = [
  {
    date: 'Aug 06, 2026',
    time: '09:12',
    sku: 'iPhone 15 Pro 256GB',
    from: 'AED 3,899',
    to: 'AED 3,749',
    reason: 'Aligned with competitor position',
    reviewer: 'Aisha K.',
    status: 'approved',
    hasComment: true,
  },
  {
    date: 'Aug 06, 2026',
    time: '09:08',
    sku: 'AirPods Pro 2',
    from: 'AED 999',
    to: 'AED 929',
    reason: 'Promotional clearance',
    reviewer: 'Aisha K.',
    status: 'approved',
    hasComment: false,
  },
  {
    date: 'Aug 05, 2026',
    time: '17:41',
    sku: 'iPad Air 11 256GB',
    from: 'AED 2,599',
    to: 'AED 2,399',
    reason: 'Below margin floor',
    reviewer: 'Aisha K.',
    status: 'rejected',
    hasComment: true,
  },
  {
    date: 'Aug 05, 2026',
    time: '16:20',
    sku: 'Galaxy Watch 6',
    from: 'AED 1,099',
    to: 'AED 1,149',
    reason: 'Low stock, rising demand',
    reviewer: 'Omar H.',
    status: 'approved',
    hasComment: false,
  },
  {
    date: 'Aug 05, 2026',
    time: '14:03',
    sku: 'Xiaomi 14 128GB',
    from: 'AED 1,799',
    to: 'AED 1,749',
    reason: 'Manual override — kept above floor',
    reviewer: 'Omar H.',
    status: 'overridden',
    hasComment: true,
  },
  {
    date: 'Aug 04, 2026',
    time: '11:55',
    sku: 'Samsung Galaxy S24',
    from: 'AED 3,299',
    to: 'AED 3,299',
    reason: 'Demand stable, no change',
    reviewer: 'System',
    status: 'approved',
    hasComment: false,
  },
  {
    date: 'Aug 04, 2026',
    time: '10:31',
    sku: 'MacBook Air M3',
    from: 'AED 4,799',
    to: 'AED 4,599',
    reason: 'Competitor price cut 5%',
    reviewer: 'Aisha K.',
    status: 'approved',
    hasComment: true,
  },
  {
    date: 'Aug 03, 2026',
    time: '18:12',
    sku: 'Pixel 8 Pro',
    from: 'AED 2,899',
    to: 'AED 2,999',
    reason: 'Stock shortage guardrail',
    reviewer: 'System',
    status: 'rejected',
    hasComment: false,
  },
];
