import { DECISION_STATUSES } from '@/data/queue';
import type { Parser } from '@/hooks/useFirestore';
import type { DecisionStatus } from '@/data/queue';
import type { CategoryPrices, ChartConfig, ComboWeek, ElasticityBar } from '@/data/series';
import type {
  CategoryPerformance,
  FeedItem,
  ForecastQualityRow,
  GapRow,
  SegmentRow,
  SourceFreshness,
} from '@/data/dashboards';

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
  readonly categoryPrices: readonly CategoryPrices[];
  readonly priceHistory: {
    readonly eand: readonly number[];
    readonly competitorA: readonly number[];
    readonly competitorB: readonly number[];
  };
  readonly forecastSeries: {
    readonly forecast: readonly number[];
    readonly actual: readonly number[];
  };
  readonly impactSeries: {
    readonly withAdpa: readonly number[];
    readonly baseline: readonly number[];
  };
  readonly elasticityBars: readonly ElasticityBar[];
  readonly chartConfig: ChartConfig;
}

export const parseSeries: Parser<SeriesDoc> = (f) => ({
  weekLabels: f.strings('weekLabels'),
  comboWeeks: f.objects('comboWeeks', (w) => ({
    week: w.string('week'),
    approved: w.number('approved'),
    rejected: w.number('rejected'),
    revenue: w.number('revenue'),
  })),
  categoryPrices: f.objects('categoryPrices', (c) => ({
    category: c.string('category'),
    eand: c.number('eand'),
    competitorA: c.number('competitorA'),
    competitorB: c.number('competitorB'),
  })),
  priceHistory: f.object('priceHistory', (p) => ({
    eand: p.numbers('eand'),
    competitorA: p.numbers('competitorA'),
    competitorB: p.numbers('competitorB'),
  })),
  forecastSeries: f.object('forecastSeries', (p) => ({
    forecast: p.numbers('forecast'),
    actual: p.numbers('actual'),
  })),
  impactSeries: f.object('impactSeries', (p) => ({
    withAdpa: p.numbers('withAdpa'),
    baseline: p.numbers('baseline'),
  })),
  elasticityBars: f.objects('elasticityBars', (b) => ({
    label: b.string('label'),
    value: b.number('value'),
    display: b.string('display'),
    color: b.string('color'),
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

export interface DashboardsDoc {
  readonly categoryPerformance: readonly CategoryPerformance[];
  readonly competitorFeed: readonly FeedItem[];
  readonly sourceFreshness: readonly SourceFreshness[];
  readonly gapAnalysis: readonly GapRow[];
  readonly forecastQuality: readonly ForecastQualityRow[];
  readonly segmentBehaviour: readonly SegmentRow[];
}

export const parseDashboards: Parser<DashboardsDoc> = (f) => ({
  categoryPerformance: f.objects('categoryPerformance', (r) => ({
    category: r.string('category'),
    priceVsBaseline: r.number('priceVsBaseline'),
    revenue: r.number('revenue'),
    conversion: r.string('conversion'),
  })),
  competitorFeed: f.objects('competitorFeed', (r) => ({
    title: r.string('title'),
    time: r.string('time'),
  })),
  sourceFreshness: f.objects('sourceFreshness', (r) => ({
    name: r.string('name'),
    age: r.string('age'),
    color: r.string('color'),
  })),
  gapAnalysis: f.objects('gapAnalysis', (r) => ({
    category: r.string('category'),
    gap: r.number('gap'),
  })),
  forecastQuality: f.objects('forecastQuality', (r) => ({
    category: r.string('category'),
    mape: r.string('mape'),
    bias: r.string('bias'),
    quality: r.oneOf<DecisionStatus>('quality', DECISION_STATUSES),
  })),
  segmentBehaviour: f.objects('segmentBehaviour', (r) => ({
    segment: r.string('segment'),
    reach: r.string('reach'),
    conversion: r.string('conversion'),
    deltaVsBase: r.number('deltaVsBase'),
  })),
});
