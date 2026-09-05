import type { ActionSpec, ChartCopy, LegendSpec } from './ui';
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

export interface GuardrailBand {
  readonly label: string;
  readonly color: string;
}

export interface DetailCopy {
  readonly icon: string;
  readonly title: string;
  readonly chips: readonly string[];
  readonly currentLabel: string;
  readonly currentValue: string;
  readonly recommendedLabel: string;
  readonly recommendedValue: string;
  readonly deltaValue: string;
  readonly priceChart: ChartCopy;
  readonly priceLegend: readonly LegendSpec[];
  readonly simCardTitle: string;
  readonly simCardSubtitle: string;
  readonly guardrailTitle: string;
  readonly guardrailBands: readonly GuardrailBand[];
  readonly factorTitle: string;
  readonly decisionTitle: string;
  readonly reasonLabel: string;
  readonly commentLabel: string;
  readonly commentPlaceholder: string;
  readonly decisionActions: readonly ActionSpec[];
  readonly historyTitle: string;
  readonly historyBadge: string;
  readonly historyAriaLabel: string;
}

export const DETAIL_COPY: DetailCopy = {
  icon: 'device-mobile',
  title: 'iPhone 15 Pro 256GB',
  chips: ['Smartphones', 'Apple', 'SKU-114872'],
  currentLabel: 'Current price',
  currentValue: 'AED 3,899',
  recommendedLabel: 'Recommended',
  recommendedValue: 'AED 3,749',
  deltaValue: '−3.8%',
  priceChart: {
    title: 'Price history',
    subtitle: 'e& vs tracked competitors over the last 8 weeks',
  },
  priceLegend: [
    { label: 'e&', color: 'var(--dv1)', series: 0 },
    { label: 'Competitor A', color: 'var(--dv2)', series: 1 },
    { label: 'Competitor B', color: 'var(--dv3)', series: 2 },
  ],
  simCardTitle: 'Run scenario simulation',
  simCardSubtitle: 'Test alternative prices and see the predicted revenue impact',
  guardrailTitle: 'Position within price guardrails',
  guardrailBands: [
    { label: 'Safe', color: '#3DCC87' },
    { label: 'Caution', color: '#EDA12F' },
    { label: 'Near ceiling', color: '#E62E2E' },
  ],
  factorTitle: 'Factor contribution',
  decisionTitle: 'Decision',
  reasonLabel: 'Reason code',
  commentLabel: 'Comment',
  commentPlaceholder: 'Optional comment on this decision',
  decisionActions: [
    { label: 'Accept', icon: '', message: 'Recommendation accepted' },
    { label: 'Reject', icon: '', message: 'Recommendation rejected' },
    { label: 'Override', icon: '', message: 'Override opened' },
  ],
  historyTitle: 'Decision history',
  historyBadge: '24 total · showing last 5',
  historyAriaLabel: 'Open full history',
};
