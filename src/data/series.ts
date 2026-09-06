/**
 * Weekly labels shared by every series in the portal.
 *
 * Twelve weeks -- a quarter -- rather than the eight the boards used to hold.
 * The range control offers 1W/4W/8W/ALL, and with only eight weeks recorded
 * the last two buttons selected the same data and the filter looked broken.
 *
 * The eight weeks that were here are now W5-W12, so every board still shows
 * exactly what it showed before at the default 8W range; W1-W4 are earlier
 * history that only ALL reaches.
 */
export const WEEK_LABELS: readonly string[] = [
  'W1',
  'W2',
  'W3',
  'W4',
  'W5',
  'W6',
  'W7',
  'W8',
  'W9',
  'W10',
  'W11',
  'W12',
];

/**
 * One week of decision and revenue outcomes.
 *
 * `approved`/`rejected`/`revenue` draw the combo chart. The four `…VsBaseline`
 * percentages are what the board's KPI tiles average over the selected window,
 * so a tile can no longer disagree with the chart above it.
 */
export interface ComboWeek {
  readonly week: string;
  readonly approved: number;
  readonly rejected: number;
  /** Realised revenue for the week, in AED thousands. */
  readonly revenue: number;
  readonly priceVsBaseline: number;
  readonly volumeVsBaseline: number;
  readonly revenueVsBaseline: number;
  readonly marginVsBaseline: number;
}

export const COMBO_WEEKS: readonly ComboWeek[] = [
  {
    week: 'W1',
    approved: 62,
    rejected: 31,
    revenue: 372,
    priceVsBaseline: -2.8,
    volumeVsBaseline: 3.1,
    revenueVsBaseline: 1.2,
    marginVsBaseline: -1.4,
  },
  {
    week: 'W2',
    approved: 68,
    rejected: 28,
    revenue: 381,
    priceVsBaseline: -3.2,
    volumeVsBaseline: 3.9,
    revenueVsBaseline: 1.6,
    marginVsBaseline: -1.3,
  },
  {
    week: 'W3',
    approved: 71,
    rejected: 25,
    revenue: 390,
    priceVsBaseline: -3.6,
    volumeVsBaseline: 4.6,
    revenueVsBaseline: 2.0,
    marginVsBaseline: -1.1,
  },
  {
    week: 'W4',
    approved: 76,
    rejected: 22,
    revenue: 398,
    priceVsBaseline: -4.0,
    volumeVsBaseline: 5.2,
    revenueVsBaseline: 2.3,
    marginVsBaseline: -1.0,
  },
  {
    week: 'W5',
    approved: 80,
    rejected: 20,
    revenue: 410,
    priceVsBaseline: -3.5,
    volumeVsBaseline: 5.8,
    revenueVsBaseline: 2.5,
    marginVsBaseline: -0.9,
  },
  {
    week: 'W6',
    approved: 84,
    rejected: 18,
    revenue: 421,
    priceVsBaseline: -3.8,
    volumeVsBaseline: 6.4,
    revenueVsBaseline: 2.8,
    marginVsBaseline: -0.8,
  },
  {
    week: 'W7',
    approved: 90,
    rejected: 15,
    revenue: 426,
    priceVsBaseline: -4.0,
    volumeVsBaseline: 7.0,
    revenueVsBaseline: 3.0,
    marginVsBaseline: -0.7,
  },
  {
    week: 'W8',
    approved: 95,
    rejected: 12,
    revenue: 438,
    priceVsBaseline: -4.1,
    volumeVsBaseline: 7.5,
    revenueVsBaseline: 3.3,
    marginVsBaseline: -0.6,
  },
  {
    week: 'W9',
    approved: 101,
    rejected: 10,
    revenue: 452,
    priceVsBaseline: -4.2,
    volumeVsBaseline: 8.1,
    revenueVsBaseline: 3.5,
    marginVsBaseline: -0.6,
  },
  {
    week: 'W10',
    approved: 108,
    rejected: 8,
    revenue: 462,
    priceVsBaseline: -4.3,
    volumeVsBaseline: 8.7,
    revenueVsBaseline: 3.8,
    marginVsBaseline: -0.5,
  },
  {
    week: 'W11',
    approved: 112,
    rejected: 7,
    revenue: 471,
    priceVsBaseline: -4.4,
    volumeVsBaseline: 9.2,
    revenueVsBaseline: 4.1,
    marginVsBaseline: -0.5,
  },
  {
    week: 'W12',
    approved: 118,
    rejected: 6,
    revenue: 495,
    priceVsBaseline: -4.5,
    volumeVsBaseline: 9.7,
    revenueVsBaseline: 4.2,
    marginVsBaseline: -0.4,
  },
];

/**
 * A tracked category, weekly.
 *
 * Prices feed the competitor grouped bars (averaged across the window) and the
 * gap analysis beside them; `priceVsBaseline` and `revenue` feed the pricing
 * board's category table. `conversion` is a cycle-level reference figure and
 * does not vary by window.
 */
export interface CategorySeries {
  readonly category: string;
  readonly eand: readonly number[];
  readonly competitorA: readonly number[];
  readonly competitorB: readonly number[];
  readonly priceVsBaseline: readonly number[];
  readonly revenue: readonly number[];
  readonly conversion: string;
}

export const CATEGORY_SERIES: readonly CategorySeries[] = [
  {
    category: 'Smartphones',
    eand: [3980, 3960, 3940, 3920, 3900, 3880, 3860, 3840, 3820, 3800, 3775, 3750],
    competitorA: [3830, 3815, 3800, 3785, 3770, 3750, 3730, 3710, 3690, 3665, 3630, 3600],
    competitorB: [3880, 3865, 3850, 3835, 3820, 3800, 3780, 3760, 3740, 3715, 3685, 3650],
    priceVsBaseline: [-2.8, -3.2, -3.6, -4.0, -4.2, -4.5, -4.8, -5.0, -5.3, -5.6, -5.9, -6.1],
    revenue: [1.9, 2.3, 2.6, 2.9, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.8, 4.8],
    conversion: '3.8%',
  },
  {
    category: 'Accessories',
    eand: [468, 466, 464, 462, 460, 458, 456, 455, 453, 452, 451, 450],
    competitorA: [478, 476, 474, 472, 470, 468, 466, 465, 463, 462, 461, 460],
    competitorB: [449, 447, 445, 443, 441, 439, 437, 436, 434, 433, 431, 430],
    priceVsBaseline: [-0.9, -1.1, -1.3, -1.5, -1.6, -1.8, -2.0, -2.1, -2.2, -2.3, -2.4, -2.4],
    revenue: [4.2, 4.7, 5.1, 5.4, 5.8, 6.1, 6.4, 6.7, 6.9, 7.1, 7.3, 7.3],
    conversion: '5.2%',
  },
  {
    category: 'Wearables',
    eand: [1160, 1152, 1144, 1138, 1130, 1124, 1118, 1112, 1108, 1105, 1102, 1100],
    competitorA: [1196, 1190, 1184, 1178, 1172, 1166, 1160, 1155, 1150, 1146, 1143, 1140],
    competitorB: [1214, 1208, 1202, 1196, 1190, 1185, 1180, 1175, 1170, 1166, 1163, 1160],
    priceVsBaseline: [0.4, 0.6, 0.7, 0.9, 1.0, 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 1.6],
    revenue: [0.7, 0.9, 1.1, 1.2, 1.4, 1.6, 1.8, 1.9, 2.0, 2.1, 2.2, 2.2],
    conversion: '4.4%',
  },
  {
    category: 'Tablets',
    eand: [2530, 2515, 2500, 2488, 2475, 2462, 2450, 2438, 2425, 2415, 2408, 2400],
    competitorA: [2360, 2348, 2336, 2325, 2314, 2302, 2290, 2280, 2268, 2258, 2248, 2240],
    competitorB: [2410, 2398, 2386, 2375, 2364, 2352, 2340, 2330, 2318, 2308, 2298, 2290],
    priceVsBaseline: [-4.1, -4.6, -5.0, -5.4, -5.9, -6.2, -6.5, -6.8, -7.0, -7.3, -7.5, -7.2],
    revenue: [0.3, 0.1, -0.2, -0.4, -0.6, -0.8, -1.0, -1.2, -1.3, -1.5, -1.7, -1.5],
    conversion: '2.9%',
  },
];

/** Price-history series shared by the detail screen and its expanded chart. */
export const PRICE_HISTORY = {
  eand: [4090, 4060, 4030, 4005, 3980, 3960, 3940, 3900, 3880, 3860, 3820, 3749],
  competitorA: [3990, 3970, 3950, 3925, 3900, 3890, 3880, 3860, 3840, 3810, 3790, 3600],
  competitorB: [4040, 4020, 4000, 3975, 3950, 3930, 3920, 3900, 3890, 3870, 3850, 3650],
} as const;

/**
 * Forecast accuracy inputs for dashboard C3.
 *
 * The demand pair draws the chart; the revenue pair is not charted but is what
 * "MAPE (revenue)" is computed from. Both MAPEs and the confidence interval are
 * derived from these over the selected window rather than being authored, so
 * they describe the series the reader is looking at.
 */
export const FORECAST_SERIES = {
  forecast: [980, 1030, 1090, 1140, 1180, 1240, 1210, 1330, 1290, 1420, 1460, 1520],
  actual: [1010, 1060, 1050, 1120, 1120, 1190, 1250, 1280, 1330, 1380, 1490, 1560],
  revenueForecast: [392, 361, 410, 378, 390, 442, 404, 461, 429, 485, 447, 520],
  revenueActual: [372, 381, 390, 398, 410, 421, 426, 438, 452, 462, 471, 495],
} as const;

/**
 * Revenue impact for dashboard C4, as weekly increments.
 *
 * Stored per week rather than pre-accumulated: the chart re-accumulates from
 * the start of the selected window, so "cumulative since cycle start" stays
 * true of whatever window is on screen instead of showing the tail of a curve
 * that began somewhere off-screen.
 */
export const IMPACT_SERIES = {
  withAdpa: [42, 55, 58, 62, 60, 80, 75, 85, 90, 80, 75, 67],
  baseline: [30, 36, 38, 40, 40, 48, 52, 46, 46, 48, 40, 40],
  markdown: [-7, -8, -8, -9, -9, -11, -10, -12, -11, -10, -11, -10],
  incrementalUnits: [95, 105, 110, 120, 130, 145, 150, 160, 165, 155, 170, 165],
  marginDelta: [1.1, 1.3, 1.4, 1.6, 1.7, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.2],
} as const;

/**
 * A customer segment, weekly.
 *
 * `elasticity` draws the bars (averaged across the window) and `deltaVsBase`
 * fills the table's last column. `reach` and `conversion` describe the segment
 * itself, so they do not vary by window.
 */
export interface SegmentSeries {
  readonly segment: string;
  readonly elasticity: readonly number[];
  readonly deltaVsBase: readonly number[];
  readonly reach: string;
  readonly conversion: string;
  readonly color: string;
}

export const SEGMENT_SERIES: readonly SegmentSeries[] = [
  {
    segment: 'Premium',
    elasticity: [2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.1, 4.2, 4.4, 4.5, 4.2],
    deltaVsBase: [0.4, 0.5, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.4, 1.3],
    reach: '18,400',
    conversion: '6.1%',
    color: 'var(--dv2)',
  },
  {
    segment: 'Value-seekers',
    elasticity: [7.2, 7.6, 8.0, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6, 9.8, 10.0, 9.7],
    deltaVsBase: [2.3, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 3.9, 4.1, 4.3, 4.1],
    reach: '42,100',
    conversion: '9.4%',
    color: 'var(--dv3)',
  },
  {
    segment: 'Occasional',
    elasticity: [2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.8, 3.9, 4.0, 4.1, 4.1],
    deltaVsBase: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.1, 1.1],
    reach: '27,900',
    conversion: '4.2%',
    color: 'var(--dv-vi)',
  },
  {
    segment: 'New customers',
    elasticity: [1.0, 1.2, 1.4, 1.5, 1.7, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.2],
    deltaVsBase: [-0.8, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.1, 0.2, 0.2],
    reach: '9,650',
    conversion: '3.0%',
    color: '#EDA12F',
  },
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
  minRevenue: 370,
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
