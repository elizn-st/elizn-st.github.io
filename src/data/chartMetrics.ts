import type { KpiDirection } from './ui';
import { mean, sum, windowOf, weeksIn, type RangeId } from './ranges';
import {
  confidenceInterval,
  hasDelta,
  mape,
  percentErrors,
  signedAedK,
  signedPct1,
  signedPp,
  splitDeltaPct,
  type SeriesLike,
} from './boardMetrics';

/**
 * The four figures above each expanded chart, derived from its window.
 *
 * The same problem the boards had: an authored "Total decisions 788" or
 * "8-week low" is a claim about a period the reader may have filtered away.
 * A stat that genuinely does not vary with the window -- feed freshness, the
 * recommendation's own price -- carries no metric and keeps its authored text.
 */
export const CHART_METRIC_IDS = [
  'decisionsTotal',
  'decisionsApproved',
  'decisionsRejected',
  'revenueEnd',
  'categoriesTracked',
  'premiumVsA',
  'premiumVsB',
  'mapeDemand',
  'mapeRevenue',
  'forecastBias',
  'weeksWithinTarget',
  'upliftTotal',
  'baselineTotal',
  'markdownTotal',
  'netEffect',
  'segmentCount',
  'bestResponder',
  'weakestResponder',
  'totalReach',
  'priceLow',
  'priceHigh',
] as const;

export type ChartMetricId = (typeof CHART_METRIC_IDS)[number];

/**
 * The accuracy band a week is judged against, in percent.
 *
 * Logic rather than copy: it is never shown as text, only as the count of
 * weeks that fall inside it.
 */
const FORECAST_TARGET_PCT = 5;

const whole = (value: number): string => Math.round(value).toLocaleString('en-US');
const aedK = (value: number): string => `AED ${Math.round(value)}K`;
const pct1 = (value: number): string => `${value.toFixed(1)}%`;
const parseReach = (reach: string): number => Number(reach.replace(/[^0-9.]/g, '')) || 0;

export interface DerivedStat {
  readonly value: string;
  readonly delta: string;
  readonly direction: KpiDirection;
}

/** Mean premium of e& over one competitor, across every tracked category. */
const premiumOver = (
  series: SeriesLike,
  range: RangeId,
  rival: 'competitorA' | 'competitorB',
): number =>
  mean(
    series.categorySeries.map((c) => {
      const ours = mean(windowOf(c.eand, range));
      const theirs = mean(windowOf(c[rival], range));
      return theirs === 0 ? 0 : ((ours - theirs) / theirs) * 100;
    }),
  );

const extremeSegment = (series: SeriesLike, range: RangeId, pick: 'best' | 'worst') => {
  const scored = series.segmentSeries.map((s) => ({
    segment: s.segment,
    value: mean(windowOf(s.elasticity, range)),
  }));
  return scored.reduce((chosen, next) =>
    pick === 'best'
      ? next.value > chosen.value
        ? next
        : chosen
      : next.value < chosen.value
        ? next
        : chosen,
  );
};

const metricOf = (metric: ChartMetricId, series: SeriesLike, range: RangeId): DerivedStat => {
  const weeks = windowOf(series.comboWeeks, range);
  const approved = weeks.map((w) => w.approved);
  const rejected = weeks.map((w) => w.rejected);
  const revenues = weeks.map((w) => w.revenue);
  const forecast = windowOf(series.forecastSeries.forecast, range);
  const actual = windowOf(series.forecastSeries.actual, range);
  const uplift = sum(windowOf(series.impactSeries.withAdpa, range));
  const baseline = sum(windowOf(series.impactSeries.baseline, range));
  const markdown = sum(windowOf(series.impactSeries.markdown, range));
  const share = (part: number) => {
    const total = sum(approved) + sum(rejected);
    return total === 0 ? '' : pct1((part / total) * 100);
  };

  switch (metric) {
    case 'decisionsTotal': {
      const totals = weeks.map((w) => w.approved + w.rejected);
      return {
        value: whole(sum(totals)),
        delta: hasDelta(totals) ? signedPct1(splitDeltaPct(totals)) : '',
        direction: 'up',
      };
    }
    case 'decisionsApproved':
      return { value: whole(sum(approved)), delta: share(sum(approved)), direction: 'up' };
    case 'decisionsRejected':
      return { value: whole(sum(rejected)), delta: share(sum(rejected)), direction: 'down' };
    case 'revenueEnd': {
      const first = revenues[0] ?? 0;
      const last = revenues[revenues.length - 1] ?? 0;
      return {
        value: aedK(last),
        delta: revenues.length < 2 || first === 0 ? '' : signedPct1(((last - first) / first) * 100),
        direction: last >= first ? 'up' : 'down',
      };
    }
    case 'categoriesTracked':
      return { value: whole(series.categorySeries.length), delta: '', direction: 'up' };
    case 'premiumVsA': {
      const value = premiumOver(series, range, 'competitorA');
      return { value: signedPct1(value), delta: '', direction: value >= 0 ? 'up' : 'down' };
    }
    case 'premiumVsB': {
      const value = premiumOver(series, range, 'competitorB');
      return { value: signedPct1(value), delta: '', direction: value >= 0 ? 'up' : 'down' };
    }
    case 'mapeDemand': {
      const value = mape(forecast, actual);
      return {
        value: pct1(value),
        delta: hasDelta(forecast)
          ? signedPp(confidenceInterval(percentErrors(forecast, actual)))
          : '',
        direction: 'up',
      };
    }
    case 'mapeRevenue':
      return {
        value: pct1(
          mape(
            windowOf(series.forecastSeries.revenueForecast, range),
            windowOf(series.forecastSeries.revenueActual, range),
          ),
        ),
        delta: '',
        direction: 'up',
      };
    case 'forecastBias': {
      const value = mean(percentErrors(forecast, actual));
      return { value: signedPct1(value), delta: '', direction: value >= 0 ? 'up' : 'down' };
    }
    case 'weeksWithinTarget': {
      const inside = percentErrors(forecast, actual).filter(
        (e) => Math.abs(e) <= FORECAST_TARGET_PCT,
      ).length;
      const total = weeksIn(range, series.weekLabels.length);
      return { value: `${inside} of ${total}`, delta: '', direction: 'up' };
    }
    case 'upliftTotal':
      return { value: signedAedK(uplift), delta: '', direction: 'up' };
    case 'baselineTotal':
      return { value: aedK(baseline), delta: '', direction: 'down' };
    case 'markdownTotal':
      return { value: signedAedK(markdown), delta: '', direction: 'down' };
    case 'netEffect':
      return { value: signedAedK(uplift + markdown), delta: '', direction: 'up' };
    case 'segmentCount':
      return { value: whole(series.segmentSeries.length), delta: '', direction: 'up' };
    case 'bestResponder': {
      const best = extremeSegment(series, range, 'best');
      return { value: best.segment, delta: signedPct1(best.value), direction: 'up' };
    }
    case 'weakestResponder': {
      const worst = extremeSegment(series, range, 'worst');
      return { value: worst.segment, delta: signedPct1(worst.value), direction: 'down' };
    }
    case 'totalReach':
      return {
        value: whole(sum(series.segmentSeries.map((s) => parseReach(s.reach)))),
        delta: '',
        direction: 'up',
      };
    case 'priceLow':
      return {
        value: `AED ${Math.min(...windowOf(series.priceHistory.eand, range)).toLocaleString('en-US')}`,
        delta: '',
        direction: 'down',
      };
    case 'priceHigh':
      return {
        value: `AED ${Math.max(...windowOf(series.priceHistory.eand, range)).toLocaleString('en-US')}`,
        delta: '',
        direction: 'up',
      };
  }
};

export interface StatLike {
  readonly label: string;
  readonly metric: ChartMetricId | '';
  readonly value: string;
  readonly delta: string;
  readonly direction: KpiDirection;
}

/** Authored stats pass through; the rest are computed for the window. */
export const chartStats = <T extends StatLike>(
  stats: readonly T[],
  series: SeriesLike,
  range: RangeId,
): readonly StatLike[] =>
  stats.map((stat) => {
    if (!stat.metric) return stat;
    const derived = metricOf(stat.metric, series, range);
    return {
      label: stat.label,
      metric: stat.metric,
      value: derived.value,
      // An authored delta is a note ("planned"), not a measurement.
      delta: stat.delta || derived.delta,
      direction: derived.direction,
    };
  });
