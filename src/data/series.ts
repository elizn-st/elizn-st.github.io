/** Weekly labels shared by every eight-week series in the portal. */
export const WEEK_LABELS: readonly string[] = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

export interface ComboWeek {
  readonly week: string;
  readonly approved: number;
  readonly rejected: number;
  readonly revenue: number;
}

export const COMBO_WEEKS: readonly ComboWeek[] = [
  { week: 'W1', approved: 80, rejected: 20, revenue: 410 },
  { week: 'W2', approved: 84, rejected: 18, revenue: 421 },
  { week: 'W3', approved: 90, rejected: 15, revenue: 426 },
  { week: 'W4', approved: 95, rejected: 12, revenue: 438 },
  { week: 'W5', approved: 101, rejected: 10, revenue: 452 },
  { week: 'W6', approved: 108, rejected: 8, revenue: 462 },
  { week: 'W7', approved: 112, rejected: 7, revenue: 471 },
  { week: 'W8', approved: 118, rejected: 6, revenue: 495 },
];

export interface CategoryPrices {
  readonly category: string;
  readonly eand: number;
  readonly competitorA: number;
  readonly competitorB: number;
}

export const CATEGORY_PRICES: readonly CategoryPrices[] = [
  { category: 'Smartphones', eand: 3750, competitorA: 3600, competitorB: 3650 },
  { category: 'Accessories', eand: 450, competitorA: 460, competitorB: 430 },
  { category: 'Wearables', eand: 1100, competitorA: 1140, competitorB: 1160 },
  { category: 'Tablets', eand: 2400, competitorA: 2240, competitorB: 2290 },
];

/** Price-history series shared by the detail screen and its expanded chart. */
export const PRICE_HISTORY = {
  eand: [3980, 3960, 3940, 3900, 3880, 3860, 3820, 3749],
  competitorA: [3900, 3890, 3880, 3860, 3840, 3810, 3790, 3600],
  competitorB: [3950, 3930, 3920, 3900, 3890, 3870, 3850, 3650],
} as const;

/** Forecast accuracy series shared by dashboard C3 and its expanded chart. */
export const FORECAST_SERIES = {
  forecast: [1180, 1240, 1210, 1330, 1290, 1420, 1460, 1520],
  actual: [1120, 1190, 1250, 1280, 1330, 1380, 1490, 1560],
} as const;

/** Revenue impact series shared by dashboard C4 and its expanded chart. */
export const IMPACT_SERIES = {
  withAdpa: [60, 140, 215, 300, 390, 470, 545, 612],
  baseline: [40, 88, 140, 186, 232, 280, 320, 360],
} as const;

export interface ElasticityBar {
  readonly label: string;
  readonly value: number;
  readonly display: string;
  readonly color: string;
}

/** Segment elasticity bars shared by dashboard C5 and its expanded chart. */
export const ELASTICITY_BARS: readonly ElasticityBar[] = [
  { label: 'Premium', value: 4.1, display: '+4.1%', color: 'var(--dv2)' },
  { label: 'Value-seekers', value: 9.4, display: '+9.4%', color: 'var(--dv3)' },
  { label: 'Occasional', value: 3.8, display: '+3.8%', color: 'var(--dv-vi)' },
  { label: 'New customers', value: 2.1, display: '+2.1%', color: '#EDA12F' },
];

/**
 * Fixed axis bounds and the retailer identities the grouped bars use.
 *
 * These are bounds, not layout: they decide what the chart claims about the
 * data, so a category added in the Console can be given the headroom it needs
 * without a rebuild. SVG padding and heights stay in the components.
 */
export interface Retailer {
  readonly name: string;
  readonly color: string;
}

export interface ChartConfig {
  readonly maxDecisions: number;
  readonly minRevenue: number;
  readonly maxRevenue: number;
  readonly maxCategoryPrice: number;
  readonly retailers: readonly Retailer[];
  /** The KPI sparkline's two shapes, rising and falling. */
  readonly sparklineUp: readonly number[];
  readonly sparklineDown: readonly number[];
}

export const CHART_CONFIG: ChartConfig = {
  maxDecisions: 140,
  minRevenue: 410,
  maxRevenue: 500,
  maxCategoryPrice: 3000,
  retailers: [
    { name: 'e&', color: '#950124' },
    { name: 'Competitor A', color: '#EA6C29' },
    { name: 'Competitor B', color: '#0D9488' },
  ],
  sparklineUp: [14, 17, 15, 20, 18, 23, 21, 26, 24, 29, 27, 33],
  sparklineDown: [30, 26, 28, 23, 25, 20, 22, 17, 19, 15, 17, 12],
};
