import type { DecisionStatus } from './queue';

/**
 * Cycle-level reference data for the dashboards.
 *
 * Everything with a weekly dimension moved into `series.ts` when the range
 * control started filtering: category performance, the price gaps and the
 * segment table are all derived per window now. What remains is the feed,
 * source freshness and per-category model quality, none of which the range
 * has anything to say about.
 */

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
