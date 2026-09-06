import type { ChartCopy, KpiSpec, LegendSpec, NoticeSpec } from './ui';
import type { DashboardTabId } from './navigation';

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
  readonly kpis: readonly KpiSpec[];
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
  readonly rangeOptions: readonly string[];
  readonly defaultRange: string;
  readonly expandLabel: string;
  readonly boards: Readonly<Record<DashboardTabId, BoardCopy>>;
}

const noKpis: readonly KpiSpec[] = [];
const noColumns: readonly string[] = [];
const noSections: readonly string[] = [];
const noNotices: readonly NoticeSpec[] = [];

export const BOARDS_COPY: BoardsCopy = {
  section: 'Dashboards',
  exportLabel: 'Export',
  exportIcon: 'export',
  exportMessage: 'Export started',
  rangeOptions: ['1W', '4W', '8W', 'ALL'],
  defaultRange: '8W',
  expandLabel: 'Open',
  boards: {
    c1: {
      title: 'Pricing performance',
      subtitle: 'Deviation, volume and revenue · approved decisions impact',
      kpis: [
        {
          label: 'Avg price vs baseline',
          value: '-4.1%',
          delta: '-0.5pp',
          direction: 'down',
          tone: 'neg',
          graph: false,
        },
        {
          label: 'Sales volume',
          value: '+7.8%',
          delta: '+1.2pp',
          direction: 'up',
          tone: 'pos',
          graph: false,
        },
        {
          label: 'Revenue',
          value: '+3.4%',
          delta: '+0.4pp',
          direction: 'up',
          tone: 'pos',
          graph: false,
        },
        {
          label: 'Margin',
          value: '-0.6%',
          delta: '-0.2pp',
          direction: 'down',
          tone: 'neg',
          graph: false,
        },
      ],
      chart: {
        copy: {
          title: 'Approved decisions vs actual revenue',
          subtitle:
            'Approval volume rose 48% over 8 weeks while revenue climbed from AED 410K to 495K',
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
          subtitle:
            'e& holds a price premium in Smartphones and Tablets; near parity in Accessories and Wearables',
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
        { label: 'MAPE (demand)', value: '6.8%', delta: '', direction: '', tone: '', graph: false },
        {
          label: 'MAPE (revenue)',
          value: '5.1%',
          delta: '',
          direction: '',
          tone: '',
          graph: false,
        },
        {
          label: 'Confidence interval',
          value: '4.2%',
          delta: '',
          direction: '',
          tone: '',
          graph: false,
        },
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
        {
          label: 'Revenue uplift',
          value: '+AED 612K',
          delta: '+8.4%',
          direction: 'up',
          tone: 'pos',
          graph: false,
        },
        {
          label: 'Markdown cost',
          value: '-AED 84K',
          delta: 'planned',
          direction: 'down',
          tone: 'neg',
          graph: false,
        },
        {
          label: 'Incremental units',
          value: '1,240',
          delta: '+310',
          direction: 'up',
          tone: '',
          graph: false,
        },
        {
          label: 'Margin delta',
          value: '+2.1%',
          delta: '+0.3pp',
          direction: 'up',
          tone: 'pos',
          graph: false,
        },
      ],
      chart: {
        copy: {
          title: 'Cumulative effect since cycle start: with ADPA vs baseline',
          subtitle: 'With ADPA the cycle closed AED 612K ahead of the counterfactual baseline',
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
