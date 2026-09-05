import type { KpiSpec, PaginationSpec } from './ui';
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

export interface HistoryCopy {
  readonly title: string;
  readonly chip: string;
  readonly exportLabel: string;
  readonly exportMessage: string;
  readonly searchPlaceholder: string;
  readonly searchAriaLabel: string;
  readonly statusFilters: readonly string[];
  readonly defaultStatusFilter: string;
  readonly appliedFilters: readonly string[];
  readonly resultsCount: string;
  /** Header labels, in column order. The trailing actions column has none. */
  readonly columns: readonly string[];
  readonly commentTitle: string;
  readonly pagination: PaginationSpec;
}

export const HISTORY_COPY: HistoryCopy = {
  title: 'Decision history',
  chip: 'Full audit log · cycle Aug 05–11',
  exportLabel: 'Export log',
  exportMessage: 'Audit log exported',
  searchPlaceholder: 'Search by SKU, reason code or reviewer',
  searchAriaLabel: 'Search log',
  statusFilters: ['All', 'Approved', 'Rejected', 'Overridden'],
  defaultStatusFilter: 'All',
  appliedFilters: ['Reviewer: Aisha K.', 'Cycle: Aug 05–11'],
  resultsCount: '8 of 1,284 entries',
  columns: ['Date', 'SKU', 'From', 'To', 'Reason code', 'Reviewer', 'Status'],
  commentTitle: 'Has comment',
  pagination: { pages: [1, 2, 3, 'dots', 161], active: 1 },
};

export const HISTORY_KPIS: readonly KpiSpec[] = [
  {
    label: 'Decisions logged',
    value: '1,284',
    delta: '+118',
    direction: 'up',
    tone: '',
    graph: false,
  },
  {
    label: 'Approved',
    value: '86.4%',
    delta: '+2.1pp',
    direction: 'up',
    tone: 'pos',
    graph: false,
  },
  { label: 'Rejected', value: '9.2%', delta: '-1.4pp', direction: 'up', tone: 'neg', graph: false },
  { label: 'Overridden', value: '4.4%', delta: '-0.7pp', direction: 'up', tone: '', graph: false },
];
