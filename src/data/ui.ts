/**
 * Shapes shared by the per-screen copy documents.
 *
 * Everything a reader sees -- headings, chips, button labels, scorecard
 * figures, table headers, chart titles -- is content, so it lives in Firestore
 * and is edited in the Console. What stays in code is the presentation the
 * copy is poured into: CSS class names, SVG geometry, animation timings and
 * the route ids the router resolves. A customer editing a padding value or a
 * route id could only break the app; editing a heading is the point.
 */

export const KPI_DIRECTIONS = ['up', 'down'] as const;

/** '' is a real variant: a scorecard rendered without an arrow. */
export type KpiDirection = (typeof KPI_DIRECTIONS)[number] | '';

export const KPI_TONES = ['pos', 'neg'] as const;

/** '' is a real variant: a delta rendered in the default colour. */
export type KpiTone = (typeof KPI_TONES)[number] | '';

/** One scorecard in a `.kpi-row`. */
export interface KpiSpec {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly direction: KpiDirection;
  readonly tone: KpiTone;
  /** Whether the card carries a sparkline. */
  readonly graph: boolean;
}

/** One entry in a chart's legend, and the series it toggles. */
export interface LegendSpec {
  readonly label: string;
  readonly color: string;
  /**
   * Index of the series this pill hides, when the legend is ordered
   * differently from the data (the combo chart lists Rejected first).
   */
  readonly series: number;
}

/** A chart card's heading pair. */
export interface ChartCopy {
  readonly title: string;
  readonly subtitle: string;
}

/**
 * Page numbers with `'dots'` for the elision. Stored as strings because
 * Firestore arrays are typed per element and a mixed number/string array is
 * awkward to edit in the Console.
 */
export type PageToken = number | 'dots';

export interface PaginationSpec {
  readonly pages: readonly PageToken[];
  readonly active: number;
}

/** A button that only raises a toast: its label and the message it shows. */
export interface ActionSpec {
  readonly label: string;
  readonly icon: string;
  readonly message: string;
}
