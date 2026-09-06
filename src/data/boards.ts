import type { ChartCopy, LegendSpec, NoticeSpec } from './ui';
import type { DashboardTabId } from './navigation';
import type { BoardKpiSpec } from './boardMetrics';
import type { RangeId, RangeOption } from './ranges';

/**
 * Copy for the five dashboard boards, keyed by tab id.
 *
 * `seriesNames` is separate from the legend labels because they are not always
 * the same string -- the revenue-impact legend reads "Baseline without ADPA"
 * while the series it toggles is named "Baseline".
 */
export interface BoardChart {
  readonly copy: ChartCopy;
  readonly legend: readonly LegendSpec[];
  readonly seriesNames: readonly string[];
}

export type { NoticeSpec };

export interface BoardCopy {
  readonly title: string;
  readonly subtitle: string;
  readonly kpis: readonly BoardKpiSpec[];
  readonly chart: BoardChart;
  readonly columns: readonly string[];
  /** Section headings used only by Competitor intelligence. */
  readonly sectionTitles: readonly string[];
  /** The privacy banner on Customer behaviour; absent elsewhere. */
  readonly notices: readonly NoticeSpec[];
}

export interface BoardsCopy {
  /** Breadcrumb section shared by all five boards. */
  readonly section: string;
  readonly exportLabel: string;
  readonly exportIcon: string;
  readonly exportMessage: string;
  readonly rangeOptions: readonly RangeOption[];
  readonly defaultRange: RangeId;
  readonly expandLabel: string;
  readonly boards: Readonly<Record<DashboardTabId, BoardCopy>>;
}

const noKpis: readonly BoardKpiSpec[] = [];
const noColumns: readonly string[] = [];
const noSections: readonly string[] = [];
const noNotices: readonly NoticeSpec[] = [];

export const BOARDS_COPY: BoardsCopy = {
  section: 'Dashboards',
  exportLabel: 'Export',
  exportIcon: 'export',
  exportMessage: 'Export started',
  rangeOptions: [
    { id: '1W', label: '1W' },
    { id: '4W', label: '4W' },
    { id: '8W', label: '8W' },
    { id: 'ALL', label: 'ALL' },
  ],
  defaultRange: '8W',
  expandLabel: 'Open',
  boards: {
    c1: {
      title: 'Pricing performance',
      subtitle: 'Deviation, volume and revenue · approved decisions impact',
      kpis: [
        { label: 'Avg price vs baseline', metric: 'priceVsBaseline', note: '', graph: false },
        { label: 'Sales volume', metric: 'volume', note: '', graph: false },
        { label: 'Revenue', metric: 'revenue', note: '', graph: false },
        { label: 'Margin', metric: 'margin', note: '', graph: false },
      ],
      chart: {
        copy: {
          title: 'Approved decisions vs actual revenue',
          subtitle: 'Approval and rejection volume against realised revenue, week by week',
        },
        legend: [
          { label: 'Rejected', color: 'var(--dv-rej)', series: 1 },
          { label: 'Approved', color: 'var(--dv-app-lbl)', series: 0 },
          { label: 'Revenue', color: 'var(--dv-rev)', series: 2 },
        ],
        seriesNames: [],
      },
      columns: ['Category', 'Price vs baseline', 'Revenue', 'Conversion'],
      sectionTitles: noSections,
      notices: noNotices,
    },

    c2: {
      title: 'Competitor intelligence',
      subtitle: 'Live pricing vs e& across tracked categories',
      kpis: noKpis,
      chart: {
        copy: {
          title: 'e& price vs competitors by category',
          subtitle: 'Average price per retailer across the selected window',
        },
        legend: [
          { label: 'e&', color: '#950124', series: 0 },
          { label: 'Competitor A', color: '#EA6C29', series: 1 },
          { label: 'Competitor B', color: '#0D9488', series: 2 },
        ],
        seriesNames: [],
      },
      columns: noColumns,
      sectionTitles: ['Competitor price movements feed', 'Source freshness', 'Gap analysis'],
      notices: noNotices,
    },

    c3: {
      title: 'Forecast accuracy',
      subtitle: 'MAPE and bias metrics for demand and revenue models',
      kpis: [
        { label: 'MAPE (demand)', metric: 'mapeDemand', note: '', graph: false },
        { label: 'MAPE (revenue)', metric: 'mapeRevenue', note: '', graph: false },
        { label: 'Confidence interval', metric: 'confidence', note: '', graph: false },
      ],
      chart: {
        copy: {
          title: 'Forecast vs actual weekly demand',
          subtitle: 'Model output tracked against realised units per week',
        },
        legend: [
          { label: 'Forecast', color: 'var(--dv2)', series: 0 },
          { label: 'Actual', color: 'var(--dv1)', series: 1 },
        ],
        seriesNames: ['Forecast', 'Actual'],
      },
      columns: ['Category', 'MAPE', 'Bias', 'Quality'],
      sectionTitles: noSections,
      notices: noNotices,
    },

    c4: {
      title: 'Revenue impact',
      subtitle: 'Cumulative AED uplift vs the no-ADPA baseline',
      kpis: [
        { label: 'Revenue uplift', metric: 'uplift', note: '', graph: false },
        { label: 'Markdown cost', metric: 'markdown', note: 'planned', graph: false },
        { label: 'Incremental units', metric: 'incrementalUnits', note: '', graph: false },
        { label: 'Margin delta', metric: 'marginDelta', note: '', graph: false },
      ],
      chart: {
        copy: {
          title: 'Cumulative effect over the selected window: with ADPA vs baseline',
          subtitle: 'Approved decisions accumulated against the no-ADPA counterfactual',
        },
        legend: [
          { label: 'With ADPA', color: 'var(--dv1)', series: 0 },
          { label: 'Baseline without ADPA', color: 'var(--n40)', series: 1 },
        ],
        seriesNames: ['With ADPA', 'Baseline'],
      },
      columns: noColumns,
      sectionTitles: noSections,
      notices: noNotices,
    },

    c5: {
      title: 'Customer behaviour',
      subtitle: 'Personalised offer response · UM segments only',
      kpis: noKpis,
      chart: {
        copy: {
          title: 'Demand elasticity by segment',
          subtitle: 'Conversion response per customer segment',
        },
        legend: [],
        seriesNames: [],
      },
      columns: ['Segment', 'Reach', 'Conversion', 'Δ vs base price'],
      sectionTitles: noSections,
      notices: [
        {
          severity: 'warning',
          icon: 'warning',
          title: 'Approved, privacy-compliant use cases only. Data is aggregated by UM segment.',
        },
      ],
    },
  },
};
