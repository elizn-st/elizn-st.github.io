import { DECISION_STATUSES } from '@/data/queue';
import type { Parser } from '@/hooks/useFirestore';
import type { DecisionStatus } from '@/data/queue';
import type { CategorySeries, ChartConfig, ComboWeek, SegmentSeries } from '@/data/series';
import type { FeedItem, ForecastQualityRow, SourceFreshness } from '@/data/dashboards';
import type { CycleActivity } from '@/data/cycle';

/**
 * `analytics/series` and `analytics/dashboards`: the chart series and table
 * rows behind the dashboards. Both are single documents holding arrays,
 * because nothing here is queried by field and Firestore bills per document
 * read -- one read per screen rather than one per data point.
 *
 * Shapes stay the interfaces from src/data, so the charts and tables keep the
 * types they already compile against.
 */

export interface SeriesDoc {
  readonly weekLabels: readonly string[];
  readonly comboWeeks: readonly ComboWeek[];
  readonly categorySeries: readonly CategorySeries[];
  readonly priceHistory: {
    readonly eand: readonly number[];
    readonly competitorA: readonly number[];
    readonly competitorB: readonly number[];
  };
  readonly forecastSeries: {
    readonly forecast: readonly number[];
    readonly actual: readonly number[];
    readonly revenueForecast: readonly number[];
    readonly revenueActual: readonly number[];
  };
  /** Weekly increments; the chart re-accumulates them within the window. */
  readonly impactSeries: {
    readonly withAdpa: readonly number[];
    readonly baseline: readonly number[];
    readonly markdown: readonly number[];
    readonly incrementalUnits: readonly number[];
    readonly marginDelta: readonly number[];
  };
  readonly segmentSeries: readonly SegmentSeries[];
  readonly chartConfig: ChartConfig;
}

export const parseSeries: Parser<SeriesDoc> = (f) => ({
  weekLabels: f.strings('weekLabels'),
  comboWeeks: f.objects('comboWeeks', (w) => ({
    week: w.string('week'),
    approved: w.number('approved'),
    rejected: w.number('rejected'),
    revenue: w.number('revenue'),
    priceVsBaseline: w.number('priceVsBaseline'),
    volumeVsBaseline: w.number('volumeVsBaseline'),
    revenueVsBaseline: w.number('revenueVsBaseline'),
    marginVsBaseline: w.number('marginVsBaseline'),
  })),
  categorySeries: f.objects('categorySeries', (c) => ({
    category: c.string('category'),
    eand: c.numbers('eand'),
    competitorA: c.numbers('competitorA'),
    competitorB: c.numbers('competitorB'),
    priceVsBaseline: c.numbers('priceVsBaseline'),
    revenue: c.numbers('revenue'),
    conversion: c.string('conversion'),
  })),
  priceHistory: f.object('priceHistory', (p) => ({
    eand: p.numbers('eand'),
    competitorA: p.numbers('competitorA'),
    competitorB: p.numbers('competitorB'),
  })),
  forecastSeries: f.object('forecastSeries', (p) => ({
    forecast: p.numbers('forecast'),
    actual: p.numbers('actual'),
    revenueForecast: p.numbers('revenueForecast'),
    revenueActual: p.numbers('revenueActual'),
  })),
  impactSeries: f.object('impactSeries', (p) => ({
    withAdpa: p.numbers('withAdpa'),
    baseline: p.numbers('baseline'),
    markdown: p.numbers('markdown'),
    incrementalUnits: p.numbers('incrementalUnits'),
    marginDelta: p.numbers('marginDelta'),
  })),
  segmentSeries: f.objects('segmentSeries', (s) => ({
    segment: s.string('segment'),
    elasticity: s.numbers('elasticity'),
    deltaVsBase: s.numbers('deltaVsBase'),
    reach: s.string('reach'),
    conversion: s.string('conversion'),
    color: s.string('color'),
  })),
  chartConfig: f.object('chartConfig', (c) => ({
    maxDecisions: c.number('maxDecisions'),
    minRevenue: c.number('minRevenue'),
    maxRevenue: c.number('maxRevenue'),
    maxCategoryPrice: c.number('maxCategoryPrice'),
    retailers: c.objects('retailers', (r) => ({
      name: r.string('name'),
      color: r.string('color'),
    })),
    sparklineUp: c.numbers('sparklineUp'),
    sparklineDown: c.numbers('sparklineDown'),
  })),
});

/**
 * What is left once the range control derives the rest.
 *
 * Category performance, the price gaps and the segment table all used to be
 * stored here; each is now computed from the weekly series for the selected
 * window. These three are genuinely cycle-level reference data with no weekly
 * dimension to filter on.
 */
export interface DashboardsDoc {
  readonly competitorFeed: readonly FeedItem[];
  readonly sourceFreshness: readonly SourceFreshness[];
  readonly forecastQuality: readonly ForecastQualityRow[];
}

export const parseDashboards: Parser<DashboardsDoc> = (f) => ({
  competitorFeed: f.objects('competitorFeed', (r) => ({
    title: r.string('title'),
    time: r.string('time'),
  })),
  sourceFreshness: f.objects('sourceFreshness', (r) => ({
    name: r.string('name'),
    age: r.string('age'),
    color: r.string('color'),
  })),
  forecastQuality: f.objects('forecastQuality', (r) => ({
    category: r.string('category'),
    mape: r.string('mape'),
    bias: r.string('bias'),
    quality: r.oneOf<DecisionStatus>('quality', DECISION_STATUSES),
  })),
});

/**
 * `analytics/cycle`: what each day of the repricing cycle did.
 *
 * Separate from `analytics/dashboards` because the two answer to different
 * controls -- the boards filter by week, the home screen filters by day -- and
 * the home screen should not read a document it uses none of.
 */
export interface CycleDoc {
  readonly days: readonly CycleActivity[];
}

export const parseCycle: Parser<CycleDoc> = (f) => ({
  days: f.objects('days', (d) => ({
    day: d.string('day'),
    generated: d.number('generated'),
    reviewed: d.number('reviewed'),
    overdue: d.number('overdue'),
    anomalies: d.number('anomalies'),
    uplift: d.number('uplift'),
  })),
});
