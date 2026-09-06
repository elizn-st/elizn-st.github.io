import type { ReactNode } from 'react';
import type { RouteId } from '@/routing/routeIds';
import { aed, gapPct } from '@/lib/format';
import type { LegendItem } from '@/components/common/Legend';
import type { HiddenSeries } from '@/components/charts/types';
import { LineChart } from '@/components/charts/LineChart';
import { ComboChart } from '@/components/charts/ComboChart';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { BarChart } from '@/components/charts/BarChart';
import type { SeriesDoc } from '@/repositories/analytics';
import { categoryPrices, impactCurves, segmentBars, windowLabels } from '@/data/boardMetrics';
import { windowOf, type RangeId } from '@/data/ranges';
import { chartStats } from '@/data/chartMetrics';
import type { ChartDetailCopy, ChartDetailsCopy, ChartStatSpec } from '@/data/chartDetails';
import { CHART_DETAIL_KEYS, type ChartDetailKey } from './keys';

export interface ChartDetailDefinition {
  readonly section: string;
  readonly title: string;
  readonly subtitle: string;
  readonly back: RouteId;
  readonly stats: readonly ChartStatSpec[];
  readonly chart: (hidden: HiddenSeries) => ReactNode;
  readonly legend: readonly LegendItem[];
  readonly columns: readonly string[];
  readonly rows: readonly (readonly (string | number)[])[];
  readonly notes: readonly string[];
}

const asMoney = (value: number) => `AED ${Math.round(value).toLocaleString()}`;
const asUnits = (value: number) => Math.round(value).toLocaleString();
const asThousands = (value: number) => `AED ${Math.round(value)}K`;

const signedWhole = (value: number) => `${value > 0 ? '+' : ''}${value}`;
const signedRatio = (value: number, against: number) => {
  const pct = (value / against) * 100;
  return `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
};

/** Series colours come from the copy's legend, so the two cannot disagree. */
const colorOf = (copy: ChartDetailCopy, index: number) => copy.legend[index]?.color ?? '';

/**
 * How each chart is drawn. This is code, not content: it names components and
 * threads the numbers from `analytics/series` through formatters.
 */
type Renderer = (
  series: SeriesDoc,
  copy: ChartDetailCopy,
  hidden: HiddenSeries,
  range: RangeId,
) => ReactNode;

const RENDERERS: Record<ChartDetailKey, Renderer> = {
  'c1-combo': (series, _copy, hidden, range) => (
    <ComboChart weeks={windowOf(series.comboWeeks, range)} hiddenSeries={hidden} />
  ),
  'c2-grouped': (series, _copy, hidden, range) => (
    <GroupedBarChart rows={categoryPrices(series, range)} hiddenSeries={hidden} />
  ),
  'c3-forecast': (series, copy, hidden, range) => (
    <LineChart
      labels={windowLabels(series, range)}
      format={asUnits}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          data: windowOf(series.forecastSeries.forecast, range),
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          area: true,
          data: windowOf(series.forecastSeries.actual, range),
        },
      ]}
    />
  ),
  'c4-impact': (series, copy, hidden, range) => (
    <LineChart
      labels={windowLabels(series, range)}
      format={asThousands}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          area: true,
          data: impactCurves(series, range).withAdpa,
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          data: impactCurves(series, range).baseline,
        },
      ]}
    />
  ),
  'c5-elasticity': (series, _copy, _hidden, range) => (
    <BarChart items={segmentBars(series, range)} />
  ),
  'b2-price': (series, copy, hidden, range) => (
    <LineChart
      labels={windowLabels(series, range)}
      format={asMoney}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          area: true,
          data: windowOf(series.priceHistory.eand, range),
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          data: windowOf(series.priceHistory.competitorA, range),
        },
        {
          name: copy.legend[2]?.label ?? '',
          color: colorOf(copy, 2),
          data: windowOf(series.priceHistory.competitorB, range),
        },
      ]}
    />
  ),
};

/**
 * How each table is computed from the series. A chart with no builder uses the
 * authored rows in its copy document instead.
 */
type RowBuilder = (series: SeriesDoc, range: RangeId) => readonly (readonly (string | number)[])[];

const ROW_BUILDERS: Partial<Record<ChartDetailKey, RowBuilder>> = {
  'c1-combo': (series, range) =>
    windowOf(series.comboWeeks, range).map((week) => [
      week.week,
      week.approved,
      week.rejected,
      `${((week.approved / (week.approved + week.rejected)) * 100).toFixed(1)}%`,
      week.revenue,
    ]),
  'c2-grouped': (series, range) =>
    categoryPrices(series, range).map((row) => [
      row.category,
      aed(row.eand),
      aed(row.competitorA),
      aed(row.competitorB),
      gapPct(row.eand, row.competitorA),
      gapPct(row.eand, row.competitorB),
    ]),
  'c3-forecast': (series, range) => {
    const forecasts = windowOf(series.forecastSeries.forecast, range);
    const actuals = windowOf(series.forecastSeries.actual, range);
    return windowLabels(series, range).map((week, index) => {
      const forecast = forecasts[index];
      const actual = actuals[index];
      return [
        week,
        forecast.toLocaleString(),
        actual.toLocaleString(),
        signedWhole(actual - forecast),
        signedRatio(actual - forecast, forecast),
      ];
    });
  },
  'c4-impact': (series, range) => {
    const labels = windowLabels(series, range);
    const curves = impactCurves(series, range);
    return curves.withAdpa.map((value, index) => {
      const baseline = curves.baseline[index];
      return [
        labels[index] ?? '',
        `AED ${Math.round(value)}K`,
        `AED ${Math.round(baseline)}K`,
        `+AED ${Math.round(value - baseline)}K`,
        signedRatio(value - baseline, baseline),
      ];
    });
  },
  'b2-price': (series, range) => {
    const labels = windowLabels(series, range);
    const rivalA = windowOf(series.priceHistory.competitorA, range);
    const rivalB = windowOf(series.priceHistory.competitorB, range);
    return windowOf(series.priceHistory.eand, range).map((value, index) => [
      labels[index] ?? '',
      aed(value),
      aed(rivalA[index]),
      aed(rivalB[index]),
      gapPct(value, rivalA[index]),
    ]);
  },
};

/**
 * Combines the copy from `content/chartDetails` with the chart and table code
 * above. A factory rather than a constant, because both halves are data now.
 */
export const buildChartDetails = (
  series: SeriesDoc,
  copy: ChartDetailsCopy,
  range: RangeId,
): Record<ChartDetailKey, ChartDetailDefinition> => {
  const built = {} as Record<ChartDetailKey, ChartDetailDefinition>;
  for (const key of CHART_DETAIL_KEYS) {
    const chartCopy = copy.charts[key];
    const build = ROW_BUILDERS[key];
    built[key] = {
      section: chartCopy.section,
      title: chartCopy.title,
      subtitle: chartCopy.subtitle,
      back: chartCopy.back,
      stats: chartStats(chartCopy.stats, series, range),
      legend: chartCopy.legend,
      columns: chartCopy.columns,
      rows: build ? build(series, range) : chartCopy.rows,
      notes: chartCopy.notes,
      chart: (hidden) => RENDERERS[key](series, chartCopy, hidden, range),
    };
  }
  return built;
};

export type { ChartDetailKey };
