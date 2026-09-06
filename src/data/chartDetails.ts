import type { RangeId, RangeOption } from './ranges';
import type { ChartMetricId } from './chartMetrics';
import type { RouteId } from '@/routing/routeIds';
import type { ChartDetailKey } from '@/screens/chartDetail/keys';
import type { KpiDirection, LegendSpec } from './ui';

/**
 * Copy for the full-page chart views, keyed by chart.
 *
 * The chart itself and the underlying table rows stay in code: the rows are
 * derived from `analytics/series` by formatter functions, so storing them
 * would duplicate figures that already live in Firestore. `rows` here is only
 * used by the elasticity view, whose table is authored rather than computed.
 */
export interface ChartStatSpec {
  readonly label: string;
  /** '' when the figure genuinely does not vary with the selected window. */
  readonly metric: ChartMetricId | '';
  readonly value: string;
  readonly delta: string;
  readonly direction: KpiDirection;
}

export interface ChartDetailCopy {
  readonly section: string;
  readonly title: string;
  readonly subtitle: string;
  readonly back: RouteId;
  readonly stats: readonly ChartStatSpec[];
  readonly legend: readonly LegendSpec[];
  readonly columns: readonly string[];
  /** Authored table rows; empty when the rows are derived from the series. */
  readonly rows: readonly (readonly string[])[];
  readonly notes: readonly string[];
}

export interface ChartDetailsCopy {
  readonly rangeOptions: readonly RangeOption[];
  readonly defaultRange: RangeId;
  readonly exportLabel: string;
  readonly exportIcon: string;
  readonly exportMessage: string;
  readonly backPrefix: string;
  readonly dataTitle: string;
  readonly notesTitle: string;
  readonly charts: Readonly<Record<ChartDetailKey, ChartDetailCopy>>;
}

const noRows: readonly (readonly string[])[] = [];

export const CHART_DETAILS_COPY: ChartDetailsCopy = {
  rangeOptions: [
    { id: '1W', label: '1W' },
    { id: '4W', label: '4W' },
    { id: '8W', label: '8W' },
    { id: 'ALL', label: 'ALL' },
  ],
  defaultRange: '8W',
  exportLabel: 'Export data',
  exportIcon: 'export',
  exportMessage: 'Chart data exported',
  backPrefix: 'Back to ',
  dataTitle: 'Underlying data',
  notesTitle: 'What the data shows',
  charts: {
    'c1-combo': {
      section: 'Dashboards',
      title: 'Approved decisions vs actual revenue',
      subtitle: 'Approval and rejection volume against realised revenue, week by week',
      back: 'c1',
      stats: [
        {
          label: 'Total decisions',
          metric: 'decisionsTotal',
          value: '',
          delta: '',
          direction: 'up',
        },
        { label: 'Approved', metric: 'decisionsApproved', value: '', delta: '', direction: 'up' },
        { label: 'Rejected', metric: 'decisionsRejected', value: '', delta: '', direction: 'down' },
        {
          label: 'Revenue, window end',
          metric: 'revenueEnd',
          value: '',
          delta: '',
          direction: 'up',
        },
      ],
      legend: [
        { label: 'Rejected', color: 'var(--dv-rej)', series: 1 },
        { label: 'Approved', color: 'var(--dv-app-lbl)', series: 0 },
        { label: 'Revenue', color: 'var(--dv-rev)', series: 2 },
      ],
      columns: ['Week', 'Approved', 'Rejected', 'Approval rate', 'Revenue, AED K'],
      rows: noRows,
      notes: [
        'Approval rate climbed from 80.0% in W1 to 95.2% in W8 as competitor signals stabilised.',
        'Rejections fell every week after W3, when the margin floor was raised for Accessories.',
        'Revenue tracks approvals with roughly a one-week lag.',
      ],
    },

    'c2-grouped': {
      section: 'Dashboards',
      title: 'e& price vs competitors by category',
      subtitle:
        'e& holds a price premium in Smartphones and Tablets; near parity in Accessories and Wearables',
      back: 'c2',
      stats: [
        {
          label: 'Categories tracked',
          metric: 'categoriesTracked',
          value: '',
          delta: 'live',
          direction: 'up',
        },
        { label: 'Avg premium vs A', metric: 'premiumVsA', value: '', delta: '', direction: 'up' },
        { label: 'Avg premium vs B', metric: 'premiumVsB', value: '', delta: '', direction: 'up' },
        { label: 'Feed freshness', metric: '', value: '12 min', delta: 'ok', direction: 'up' },
      ],
      legend: [
        { label: 'e&', color: '#950124', series: 0 },
        { label: 'Competitor A', color: '#EA6C29', series: 1 },
        { label: 'Competitor B', color: '#0D9488', series: 2 },
      ],
      columns: ['Category', 'e&', 'Competitor A', 'Competitor B', 'Gap vs A', 'Gap vs B'],
      rows: noRows,
      notes: [
        'Smartphones carry the largest premium at +4.2% over Competitor A.',
        'Accessories sit below both competitors — a candidate for a price increase.',
        'Wearables are the most tightly matched category across all three retailers.',
      ],
    },

    'c3-forecast': {
      section: 'Dashboards',
      title: 'Forecast vs actual weekly demand',
      subtitle: 'Model output tracked against realised units per week',
      back: 'c3',
      stats: [
        { label: 'MAPE, demand', metric: 'mapeDemand', value: '', delta: '', direction: 'up' },
        { label: 'MAPE, revenue', metric: 'mapeRevenue', value: '', delta: '', direction: 'up' },
        { label: 'Bias', metric: 'forecastBias', value: '', delta: '', direction: 'down' },
        {
          label: 'Weeks within target',
          metric: 'weeksWithinTarget',
          value: '',
          delta: '',
          direction: 'up',
        },
      ],
      legend: [
        { label: 'Forecast', color: 'var(--dv2)', series: 0 },
        { label: 'Actual', color: 'var(--dv1)', series: 1 },
      ],
      columns: ['Week', 'Forecast, units', 'Actual, units', 'Error', 'Error %'],
      rows: noRows,
      notes: [
        'The model under-forecast demand in the final three weeks as the seasonal dip reversed.',
        'W3 shows the largest positive error at +3.3%.',
        'Bias stays inside the ±2% tolerance agreed with Finance.',
      ],
    },

    'c4-impact': {
      section: 'Dashboards',
      title: 'Cumulative effect over the selected window: with ADPA vs baseline',
      subtitle: 'Approved decisions accumulated against the no-ADPA counterfactual',
      back: 'c4',
      stats: [
        { label: 'Uplift', metric: 'upliftTotal', value: '', delta: '', direction: 'up' },
        { label: 'Baseline', metric: 'baselineTotal', value: '', delta: '', direction: 'down' },
        {
          label: 'Markdown cost',
          metric: 'markdownTotal',
          value: '',
          delta: 'planned',
          direction: 'down',
        },
        { label: 'Net effect', metric: 'netEffect', value: '', delta: '', direction: 'up' },
      ],
      legend: [
        { label: 'With ADPA', color: 'var(--dv1)', series: 0 },
        { label: 'Baseline without ADPA', color: 'var(--n40)', series: 1 },
      ],
      columns: ['Week', 'With ADPA', 'Baseline', 'Delta', 'Cumulative delta'],
      rows: noRows,
      notes: [
        'The gap widens every week — compounding, not a one-off.',
        'Markdown cost stays inside the approved AED 90K envelope.',
        'W6 onwards the uplift alone covers the full programme run cost.',
      ],
    },

    'c5-elasticity': {
      section: 'Dashboards',
      title: 'Demand elasticity by segment',
      subtitle: 'Conversion response per customer segment',
      back: 'c5',
      stats: [
        {
          label: 'Segments',
          metric: 'segmentCount',
          value: '',
          delta: 'UM approved',
          direction: 'up',
        },
        { label: 'Best responder', metric: 'bestResponder', value: '', delta: '', direction: 'up' },
        { label: 'Weakest', metric: 'weakestResponder', value: '', delta: '', direction: 'down' },
        { label: 'Total reach', metric: 'totalReach', value: '', delta: '', direction: 'up' },
      ],
      legend: [],
      columns: ['Segment', 'Reach', 'Conversion', 'Elasticity', 'Δ vs base price'],
      rows: [
        ['Premium', '18,400', '6.1%', '+4.1%', '+1.2%'],
        ['Value-seekers', '42,100', '9.4%', '+9.4%', '+3.8%'],
        ['Occasional', '27,900', '4.2%', '+3.8%', '+0.9%'],
        ['New customers', '9,650', '3.0%', '+2.1%', '0.0%'],
      ],
      notes: [
        'Value-seekers respond nearly 2.5x more strongly than Premium.',
        'New customers barely react to price — messaging matters more than discount depth.',
        'All figures are aggregated by UM segment; no individual-level data is used.',
      ],
    },

    'b2-price': {
      section: 'Recommendations',
      title: 'Price history',
      subtitle: 'e& vs tracked competitors across the selected window',
      back: 'detail',
      stats: [
        { label: 'Current', metric: '', value: 'AED 3,899', delta: '', direction: 'down' },
        { label: 'Recommended', metric: '', value: 'AED 3,749', delta: '-3.8%', direction: 'down' },
        { label: 'Period low', metric: 'priceLow', value: '', delta: '', direction: 'down' },
        { label: 'Period high', metric: 'priceHigh', value: '', delta: '', direction: 'up' },
      ],
      legend: [
        { label: 'e&', color: 'var(--dv1)', series: 0 },
        { label: 'Competitor A', color: 'var(--dv2)', series: 1 },
        { label: 'Competitor B', color: 'var(--dv3)', series: 2 },
      ],
      columns: ['Week', 'e&', 'Competitor A', 'Competitor B', 'Gap vs A'],
      rows: noRows,
      notes: [
        'Competitor A cut hardest in W8, opening a 4.1% gap against e&.',
        'e& has drifted down steadily rather than in steps — no promo spikes.',
        'The recommendation closes most of the gap without breaching the margin floor.',
      ],
    },
  },
};
