/** Series indices currently hidden by the chart legend. */
export type HiddenSeries = ReadonlySet<number>;

export const EMPTY_HIDDEN: HiddenSeries = new Set<number>();

/** `series-hidden` fades a series out without removing it from the DOM. */
export const hiddenClass = (hidden: HiddenSeries, index: number, base: string): string =>
  hidden.has(index) ? `${base} series-hidden` : base;
