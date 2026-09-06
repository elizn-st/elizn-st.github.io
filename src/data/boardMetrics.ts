import type { KpiSpec, KpiDirection, KpiTone } from './ui';
import type { CategorySeries, ComboWeek, SegmentSeries } from './series';
import { mean, sum, windowOf, type RangeId } from './ranges';

/**
 * Every figure the five dashboards show, derived from the selected window.
 *
 * The boards used to hold authored numbers beside a chart that showed a fixed
 * eight weeks. Once the range control actually filters, an authored figure is
 * a claim about a period the reader may not be looking at -- so each one is
 * computed here from the same weeks the chart draws.
 */

/** Runtime list as well as a type, so a Console-edited metric id is validated. */
export const BOARD_METRIC_IDS = [
  'priceVsBaseline',
  'volume',
  'revenue',
  'margin',
  'mapeDemand',
  'mapeRevenue',
  'confidence',
  'uplift',
  'markdown',
  'incrementalUnits',
  'marginDelta',
] as const;

export type BoardMetricId = (typeof BOARD_METRIC_IDS)[number];

/**
 * A scorecard as the copy document holds it.
 *
 * Only the label and the metric it names are content; the figure, its delta
 * and its colour come from the data.
 */
export interface BoardKpiSpec {
  readonly label: string;
  readonly metric: BoardMetricId;
  /**
   * Replaces the derived delta when the card carries a note instead of a
   * movement -- the markdown card reads "planned", which is not a measurement.
   */
  readonly note: string;
  readonly graph: boolean;
}

/** The slice of the series document these derivations need. */
export interface SeriesLike {
  readonly weekLabels: readonly string[];
  readonly priceHistory: {
    readonly eand: readonly number[];
    readonly competitorA: readonly number[];
    readonly competitorB: readonly number[];
  };
  readonly comboWeeks: readonly ComboWeek[];
  readonly categorySeries: readonly CategorySeries[];
  readonly forecastSeries: {
    readonly forecast: readonly number[];
    readonly actual: readonly number[];
    readonly revenueForecast: readonly number[];
    readonly revenueActual: readonly number[];
  };
  readonly impactSeries: {
    readonly withAdpa: readonly number[];
    readonly baseline: readonly number[];
    readonly markdown: readonly number[];
    readonly incrementalUnits: readonly number[];
    readonly marginDelta: readonly number[];
  };
  readonly segmentSeries: readonly SegmentSeries[];
}

export const signedPct1 = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
export const signedPp = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)}pp`;
export const signedUnits = (value: number): string =>
  `${value > 0 ? '+' : ''}${Math.round(value).toLocaleString('en-US')}`;
export const signedAedK = (value: number): string =>
  `${value < 0 ? '-' : '+'}AED ${Math.abs(Math.round(value)).toLocaleString('en-US')}K`;

/**
 * Movement across the window: its later half against its earlier half.
 *
 * Not the preceding window of equal length -- a twelve-week history cannot
 * supply eight weeks before an eight-week window, so the default range would
 * show no delta at all. Split against itself, every range longer than one week
 * has something to say, and it says it about the weeks on screen.
 */
export const splitDelta = (
  values: readonly number[],
  reduce: (v: readonly number[]) => number,
): number => {
  if (values.length < 2) return 0;
  const half = Math.floor(values.length / 2);
  return reduce(values.slice(values.length - half)) - reduce(values.slice(0, half));
};

export const hasDelta = (values: readonly number[]): boolean => values.length >= 2;

/** Growth between the window's two halves, as a percentage of the earlier one. */
export const splitDeltaPct = (values: readonly number[]): number => {
  const half = Math.floor(values.length / 2);
  const earlier = sum(values.slice(0, half));
  if (earlier === 0) return 0;
  return ((sum(values.slice(values.length - half)) - earlier) / earlier) * 100;
};

/** Mean absolute percentage error, the standard forecast-accuracy measure. */
export const mape = (forecast: readonly number[], actual: readonly number[]): number =>
  mean(actual.map((a, i) => (a === 0 ? 0 : Math.abs((forecast[i] ?? 0) - a) / Math.abs(a)))) * 100;

export const percentErrors = (
  forecast: readonly number[],
  actual: readonly number[],
): readonly number[] => actual.map((a, i) => (a === 0 ? 0 : (((forecast[i] ?? 0) - a) / a) * 100));

/** Half-width of the 95% interval around the mean percentage error. */
export const confidenceInterval = (errors: readonly number[]): number => {
  if (errors.length < 2) return 0;
  const centre = mean(errors);
  const variance = sum(errors.map((e) => (e - centre) ** 2)) / (errors.length - 1);
  return (1.96 * Math.sqrt(variance)) / Math.sqrt(errors.length);
};

interface Derived {
  readonly value: string;
  readonly delta: string;
  readonly direction: KpiDirection;
  readonly tone: KpiTone;
}

/** A percentage that is better when it is higher. */
const fromPercent = (values: readonly number[]): Derived => {
  const value = mean(values);
  const delta = splitDelta(values, mean);
  return {
    value: signedPct1(value),
    delta: hasDelta(values) ? signedPp(delta) : '',
    direction: value >= 0 ? 'up' : 'down',
    tone: value >= 0 ? 'pos' : 'neg',
  };
};

/** An error measure: no arrow and no colour, because lower is better. */
const fromErrorRate = (value: number): Derived => ({
  value: `${value.toFixed(1)}%`,
  delta: '',
  direction: '',
  tone: '',
});

const metricOf = (metric: BoardMetricId, range: RangeId, series: SeriesLike): Derived => {
  const weeks = windowOf(series.comboWeeks, range);
  const forecast = windowOf(series.forecastSeries.forecast, range);
  const actual = windowOf(series.forecastSeries.actual, range);
  const impact = series.impactSeries;

  switch (metric) {
    case 'priceVsBaseline':
      return fromPercent(weeks.map((w) => w.priceVsBaseline));
    case 'volume':
      return fromPercent(weeks.map((w) => w.volumeVsBaseline));
    case 'revenue':
      return fromPercent(weeks.map((w) => w.revenueVsBaseline));
    case 'margin':
      return fromPercent(weeks.map((w) => w.marginVsBaseline));
    case 'mapeDemand':
      return fromErrorRate(mape(forecast, actual));
    case 'mapeRevenue':
      return fromErrorRate(
        mape(
          windowOf(series.forecastSeries.revenueForecast, range),
          windowOf(series.forecastSeries.revenueActual, range),
        ),
      );
    case 'confidence':
      return fromErrorRate(confidenceInterval(percentErrors(forecast, actual)));
    case 'uplift': {
      const values = windowOf(impact.withAdpa, range);
      const total = sum(values);
      return {
        value: signedAedK(total),
        delta: hasDelta(values) ? signedPct1(splitDeltaPct(values)) : '',
        direction: total >= 0 ? 'up' : 'down',
        tone: total >= 0 ? 'pos' : 'neg',
      };
    }
    case 'markdown': {
      const total = sum(windowOf(impact.markdown, range));
      return { value: signedAedK(total), delta: '', direction: 'down', tone: 'neg' };
    }
    case 'incrementalUnits': {
      const values = windowOf(impact.incrementalUnits, range);
      return {
        value: Math.round(sum(values)).toLocaleString('en-US'),
        delta: hasDelta(values) ? signedUnits(splitDelta(values, sum)) : '',
        direction: 'up',
        tone: '',
      };
    }
    case 'marginDelta':
      return fromPercent(windowOf(impact.marginDelta, range));
  }
};

export const boardKpis = (
  kpis: readonly BoardKpiSpec[],
  range: RangeId,
  series: SeriesLike,
): readonly KpiSpec[] =>
  kpis.map((kpi) => {
    const derived = metricOf(kpi.metric, range, series);
    return {
      label: kpi.label,
      value: derived.value,
      delta: kpi.note || derived.delta,
      direction: derived.direction,
      tone: derived.tone,
      graph: kpi.graph,
    };
  });

/** Week labels for the selected window, so every x-axis agrees with the data. */
export const windowLabels = (series: SeriesLike, range: RangeId): readonly string[] =>
  windowOf(series.weekLabels, range);

/** Average price per retailer across the window, for the grouped bars. */
export interface CategoryPricePoint {
  readonly category: string;
  readonly eand: number;
  readonly competitorA: number;
  readonly competitorB: number;
}

export const categoryPrices = (series: SeriesLike, range: RangeId): readonly CategoryPricePoint[] =>
  series.categorySeries.map((c) => ({
    category: c.category,
    eand: mean(windowOf(c.eand, range)),
    competitorA: mean(windowOf(c.competitorA, range)),
    competitorB: mean(windowOf(c.competitorB, range)),
  }));

export interface CategoryPerformanceRow {
  readonly category: string;
  readonly priceVsBaseline: number;
  readonly revenue: number;
  readonly conversion: string;
}

export const categoryPerformance = (
  series: SeriesLike,
  range: RangeId,
): readonly CategoryPerformanceRow[] =>
  series.categorySeries.map((c) => ({
    category: c.category,
    priceVsBaseline: Number(mean(windowOf(c.priceVsBaseline, range)).toFixed(1)),
    revenue: Number(mean(windowOf(c.revenue, range)).toFixed(1)),
    conversion: c.conversion,
  }));

export interface GapRow {
  readonly category: string;
  readonly gap: number;
}

/** e& against the mean of both tracked competitors, across the window. */
export const gapAnalysis = (series: SeriesLike, range: RangeId): readonly GapRow[] =>
  categoryPrices(series, range).map((c) => {
    const rivals = (c.competitorA + c.competitorB) / 2;
    return {
      category: c.category,
      gap: rivals === 0 ? 0 : Number((((c.eand - rivals) / rivals) * 100).toFixed(1)),
    };
  });

export interface SegmentBar {
  readonly label: string;
  readonly value: number;
  readonly display: string;
  readonly color: string;
}

export const segmentBars = (series: SeriesLike, range: RangeId): readonly SegmentBar[] =>
  series.segmentSeries.map((s) => {
    const value = Number(mean(windowOf(s.elasticity, range)).toFixed(1));
    return { label: s.segment, value, display: signedPct1(value), color: s.color };
  });

export interface SegmentRow {
  readonly segment: string;
  readonly reach: string;
  readonly conversion: string;
  readonly deltaVsBase: number;
}

export const segmentRows = (series: SeriesLike, range: RangeId): readonly SegmentRow[] =>
  series.segmentSeries.map((s) => ({
    segment: s.segment,
    reach: s.reach,
    conversion: s.conversion,
    deltaVsBase: Number(mean(windowOf(s.deltaVsBase, range)).toFixed(1)),
  }));

/**
 * Cumulative impact, re-accumulated from the start of the window.
 *
 * Stored per week, so a four-week view answers "what did these four weeks
 * add?" rather than showing the tail of a curve that started off-screen.
 */
export const impactCurves = (
  series: SeriesLike,
  range: RangeId,
): { readonly withAdpa: readonly number[]; readonly baseline: readonly number[] } => {
  const accumulate = (values: readonly number[]): readonly number[] => {
    let running = 0;
    return values.map((value) => (running += value));
  };
  return {
    withAdpa: accumulate(windowOf(series.impactSeries.withAdpa, range)),
    baseline: accumulate(windowOf(series.impactSeries.baseline, range)),
  };
};
