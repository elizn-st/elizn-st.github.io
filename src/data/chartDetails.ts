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
  readonly rangeOptions: readonly string[];
  readonly defaultRange: string;
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
  rangeOptions: ['4W', '8W', '13W', 'ALL'],
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
      subtitle: 'Approval volume rose 48% over 8 weeks while revenue climbed from AED 410K to 495K',
      back: 'c1',
      stats: [
        { label: 'Total decisions', value: '788', delta: '+48%', direction: 'up' },
        { label: 'Approved', value: '688', delta: '87.3%', direction: 'up' },
        { label: 'Rejected', value: '100', delta: '12.7%', direction: 'down' },
        { label: 'Revenue, cycle end', value: 'AED 495K', delta: '+20.7%', direction: 'up' },
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
        { label: 'Categories tracked', value: '4', delta: 'live', direction: 'up' },
        { label: 'Avg premium vs A', value: '+2.8%', delta: '', direction: 'up' },
        { label: 'Avg premium vs B', value: '+1.4%', delta: '', direction: 'up' },
        { label: 'Feed freshness', value: '12 min', delta: 'ok', direction: 'up' },
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
        { label: 'MAPE, demand', value: '6.8%', delta: '-0.4pp', direction: 'up' },
        { label: 'MAPE, revenue', value: '5.1%', delta: '-0.2pp', direction: 'up' },
        { label: 'Bias', value: '+1.2%', delta: '', direction: 'down' },
        { label: 'Weeks within target', value: '6 of 8', delta: '', direction: 'up' },
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
      title: 'Cumulative effect since cycle start: with ADPA vs baseline',
      subtitle: 'With ADPA the cycle closed AED 612K ahead of the counterfactual baseline',
      back: 'c4',
      stats: [
        { label: 'Uplift', value: '+AED 612K', delta: '+8.4%', direction: 'up' },
        { label: 'Baseline', value: 'AED 360K', delta: '', direction: 'down' },
        { label: 'Markdown cost', value: '-AED 84K', delta: 'planned', direction: 'down' },
        { label: 'Net effect', value: '+AED 528K', delta: '', direction: 'up' },
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
        { label: 'Segments', value: '4', delta: 'UM approved', direction: 'up' },
        { label: 'Best responder', value: 'Value-seekers', delta: '+9.4%', direction: 'up' },
        { label: 'Weakest', value: 'New customers', delta: '+2.1%', direction: 'down' },
        { label: 'Total reach', value: '98,050', delta: '', direction: 'up' },
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
      subtitle: 'e& vs tracked competitors over the last 8 weeks',
      back: 'detail',
      stats: [
        { label: 'Current', value: 'AED 3,899', delta: '', direction: 'down' },
        { label: 'Recommended', value: 'AED 3,749', delta: '-3.8%', direction: 'down' },
        { label: '8-week low', value: 'AED 3,749', delta: '', direction: 'down' },
        { label: '8-week high', value: 'AED 3,980', delta: '', direction: 'up' },
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
