import type { DecisionStatus } from './queue';

export interface CategoryPerformance {
  readonly category: string;
  readonly priceVsBaseline: number;
  readonly revenue: number;
  readonly conversion: string;
}

export const CATEGORY_PERFORMANCE: readonly CategoryPerformance[] = [
  { category: 'Smartphones', priceVsBaseline: -5.2, revenue: 4.1, conversion: '3.8%' },
  { category: 'Accessories', priceVsBaseline: -2.1, revenue: 6.7, conversion: '5.2%' },
  { category: 'Wearables', priceVsBaseline: 1.4, revenue: 1.9, conversion: '4.4%' },
  { category: 'Tablets', priceVsBaseline: -6.8, revenue: -1.2, conversion: '2.9%' },
];

export interface FeedItem {
  readonly title: string;
  readonly time: string;
}

export const COMPETITOR_FEED: readonly FeedItem[] = [
  { title: 'Competitor A cut iPhone 15 Pro price by 4%', time: 'Today, 06:40' },
  { title: 'Competitor B launched a promo on AirPods Pro 2', time: 'Today, 04:15' },
  { title: 'Competitor A raised Galaxy Watch 6 price by 2%', time: 'Yesterday, 21:02' },
  { title: "Anomaly: Competitor B's iPad Air price is below cost", time: 'Yesterday, 18:47' },
];

export interface SourceFreshness {
  readonly name: string;
  readonly age: string;
  readonly color: string;
}

export const SOURCE_FRESHNESS: readonly SourceFreshness[] = [
  { name: 'Competitor A — website', age: '12 min ago', color: 'var(--ok)' },
  { name: 'Competitor B — website', age: '34 min ago', color: 'var(--ok)' },
  { name: 'Licensed feed', age: '5h ago', color: 'var(--warn)' },
];

export interface GapRow {
  readonly category: string;
  readonly gap: number;
}

export const GAP_ANALYSIS: readonly GapRow[] = [
  { category: 'Smartphones', gap: 4.1 },
  { category: 'Accessories', gap: -1.2 },
  { category: 'Wearables', gap: -3.4 },
  { category: 'Tablets', gap: 6.9 },
];

export interface ForecastQualityRow {
  readonly category: string;
  readonly mape: string;
  readonly bias: string;
  readonly quality: DecisionStatus;
}

export const FORECAST_QUALITY: readonly ForecastQualityRow[] = [
  { category: 'Accessories', mape: '3.9%', bias: '-0.6%', quality: 'approved' },
  { category: 'Wearables', mape: '5.2%', bias: '+1.1%', quality: 'approved' },
  { category: 'Smartphones', mape: '7.4%', bias: '+2.3%', quality: 'pending' },
  { category: 'Tablets', mape: '10.1%', bias: '-3.8%', quality: 'flagged' },
];

export interface SegmentRow {
  readonly segment: string;
  readonly reach: string;
  readonly conversion: string;
  readonly deltaVsBase: number;
}

export const SEGMENT_BEHAVIOUR: readonly SegmentRow[] = [
  { segment: 'Premium', reach: '18,400', conversion: '6.1%', deltaVsBase: 1.2 },
  { segment: 'Value-seekers', reach: '42,100', conversion: '9.4%', deltaVsBase: 3.8 },
  { segment: 'Occasional', reach: '27,900', conversion: '4.2%', deltaVsBase: 0.9 },
  { segment: 'New customers', reach: '9,650', conversion: '3.0%', deltaVsBase: 0.0 },
];
