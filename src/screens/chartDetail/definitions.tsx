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
type Renderer = (series: SeriesDoc, copy: ChartDetailCopy, hidden: HiddenSeries) => ReactNode;

const RENDERERS: Record<ChartDetailKey, Renderer> = {
  'c1-combo': (_series, _copy, hidden) => <ComboChart hiddenSeries={hidden} />,
  'c2-grouped': (_series, _copy, hidden) => <GroupedBarChart hiddenSeries={hidden} />,
  'c3-forecast': (series, copy, hidden) => (
    <LineChart
      labels={series.weekLabels}
      format={asUnits}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          data: series.forecastSeries.forecast,
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          area: true,
          data: series.forecastSeries.actual,
        },
      ]}
    />
  ),
  'c4-impact': (series, copy, hidden) => (
    <LineChart
      labels={series.weekLabels}
      format={asThousands}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          area: true,
          data: series.impactSeries.withAdpa,
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          data: series.impactSeries.baseline,
        },
      ]}
    />
  ),
  'c5-elasticity': (series) => <BarChart items={series.elasticityBars} />,
  'b2-price': (series, copy, hidden) => (
    <LineChart
      labels={series.weekLabels}
      format={asMoney}
      height={260}
      hiddenSeries={hidden}
      series={[
        {
          name: copy.legend[0]?.label ?? '',
          color: colorOf(copy, 0),
          area: true,
          data: series.priceHistory.eand,
        },
        {
          name: copy.legend[1]?.label ?? '',
          color: colorOf(copy, 1),
          data: series.priceHistory.competitorA,
        },
        {
          name: copy.legend[2]?.label ?? '',
          color: colorOf(copy, 2),
          data: series.priceHistory.competitorB,
        },
      ]}
    />
  ),
};

/**
 * How each table is computed from the series. A chart with no builder uses the
 * authored rows in its copy document instead.
 */
type RowBuilder = (series: SeriesDoc) => readonly (readonly (string | number)[])[];

const ROW_BUILDERS: Partial<Record<ChartDetailKey, RowBuilder>> = {
  'c1-combo': (series) =>
    series.comboWeeks.map((week) => [
      week.week,
      week.approved,
      week.rejected,
      `${((week.approved / (week.approved + week.rejected)) * 100).toFixed(1)}%`,
      week.revenue,
    ]),
  'c2-grouped': (series) =>
    series.categoryPrices.map((row) => [
      row.category,
      aed(row.eand),
      aed(row.competitorA),
      aed(row.competitorB),
      gapPct(row.eand, row.competitorA),
      gapPct(row.eand, row.competitorB),
    ]),
  'c3-forecast': (series) =>
    series.weekLabels.map((week, index) => {
      const forecast = series.forecastSeries.forecast[index];
      const actual = series.forecastSeries.actual[index];
      return [
        week,
        forecast.toLocaleString(),
        actual.toLocaleString(),
        signedWhole(actual - forecast),
        signedRatio(actual - forecast, forecast),
      ];
    }),
  'c4-impact': (series) =>
    series.impactSeries.withAdpa.map((value, index) => {
      const baseline = series.impactSeries.baseline[index];
      return [
        `W${index + 1}`,
        `AED ${value}K`,
        `AED ${baseline}K`,
        `+AED ${value - baseline}K`,
        `+AED ${value - baseline}K`,
      ];
    }),
  'b2-price': (series) =>
    series.priceHistory.eand.map((value, index) => [
      `W${index + 1}`,
      aed(value),
      aed(series.priceHistory.competitorA[index]),
      aed(series.priceHistory.competitorB[index]),
      gapPct(value, series.priceHistory.competitorA[index]),
    ]),
};

/**
 * Combines the copy from `content/chartDetails` with the chart and table code
 * above. A factory rather than a constant, because both halves are data now.
 */
export const buildChartDetails = (
  series: SeriesDoc,
  copy: ChartDetailsCopy,
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
      stats: chartCopy.stats,
      legend: chartCopy.legend,
      columns: chartCopy.columns,
      rows: build ? build(series) : chartCopy.rows,
      notes: chartCopy.notes,
      chart: (hidden) => RENDERERS[key](series, chartCopy, hidden),
    };
  }
  return built;
};

export type { ChartDetailKey };
