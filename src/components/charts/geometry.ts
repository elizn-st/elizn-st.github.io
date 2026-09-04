import type { RefObject } from 'react';
import { useElementWidth } from '@/hooks/useElementWidth';

/** Coordinate width the charts were originally laid out against. */
export const DESIGN_WIDTH = 960;

/**
 * Charts are authored in a 960-unit coordinate space and stretched to their
 * container with `width:100%`, so a narrow container scales everything down —
 * at phone widths the 9px axis labels land near 2.5px on screen and the plot
 * is squashed to a sliver.
 *
 * Clamping the viewBox to the measured box width keeps the mapping at 1:1
 * whenever the container is narrower than the design width (labels render at
 * their true size, the plot keeps a usable height) and leaves anything 960px
 * or wider exactly as designed.
 */
export function useChartViewBoxWidth(ref: RefObject<Element | null>): number {
  const measured = useElementWidth(ref);
  return measured === null ? DESIGN_WIDTH : Math.min(DESIGN_WIDTH, measured);
}

/** Characters that advance noticeably less than a digit in Inter. */
const NARROW = new Set([',', '.', ' ', "'", ':', '-']);
const WIDE_RATIO = 0.655;
const NARROW_RATIO = 0.31;

/**
 * Width of a chart label in viewBox units. Labels are short runs of digits,
 * currency prefixes and category names in one known font, which advance
 * predictably enough to size a gutter or a bar slot from — and erring a unit
 * or two wide only adds breathing room, where the alternative is a clipped or
 * colliding label.
 */
export const estimateLabelWidth = (text: string, fontSize: number): number => {
  let width = 0;
  for (const char of text) width += fontSize * (NARROW.has(char) ? NARROW_RATIO : WIDE_RATIO);
  return width;
};

/** `.axis-text` font size, mirrored from the stylesheet. */
export const AXIS_FONT_SIZE = 9;
/** `.cat-label` font size, mirrored from the stylesheet. */
export const CATEGORY_FONT_SIZE = 11;

/** Splits a label at its last space or hyphen so it can run onto two lines. */
const splitLabel = (label: string): string[] => {
  const space = label.lastIndexOf(' ');
  const hyphen = label.lastIndexOf('-');
  const at = Math.max(space, hyphen);
  if (at <= 0 || at === label.length - 1) return [label];
  // Keep the hyphen on the first line; drop the space.
  return [label.slice(0, at + (at === hyphen ? 1 : 0)), label.slice(at + 1)];
};

export interface CategoryLabelLayout {
  readonly fontSize: number;
  /** One entry per label, each already split into the lines to render. */
  readonly lines: readonly string[][];
  /** True when any label runs onto a second line. */
  readonly wrapped: boolean;
  /** Extra vertical room the second line needs, in viewBox units. */
  readonly extraBottom: number;
}

/**
 * Category labels sit under their bar in a fixed slot. At the design width
 * there is room to spare, but once the viewBox narrows to a phone the longest
 * name ("New customers", "Smartphones") outgrows its slot and neighbouring
 * labels collide. Wrapping at a space or hyphen buys most of it back, and only
 * what still does not fit gets scaled down. Nothing is ever scaled up, so wide
 * charts render exactly as before.
 */
export const layoutCategoryLabels = (
  labels: readonly string[],
  slot: number,
  minFontSize = 8,
): CategoryLabelLayout => {
  const available = slot - 4;
  const widest = (candidates: readonly string[]) =>
    Math.max(0, ...candidates.map((text) => estimateLabelWidth(text, CATEGORY_FONT_SIZE)));

  const single = labels.map((label) => [label]);
  if (!labels.length || widest(labels) <= available) {
    return { fontSize: CATEGORY_FONT_SIZE, lines: single, wrapped: false, extraBottom: 0 };
  }

  const split = labels.map(splitLabel);
  const wrapped = split.some((lines) => lines.length > 1);
  const parts = split.flat();
  const widestPart = widest(parts);

  const fontSize =
    widestPart <= available
      ? CATEGORY_FONT_SIZE
      : Math.max(minFontSize, Math.floor((CATEGORY_FONT_SIZE * available) / widestPart));

  return {
    fontSize,
    lines: wrapped ? split : single,
    wrapped,
    extraBottom: wrapped ? fontSize + 1 : 0,
  };
};
