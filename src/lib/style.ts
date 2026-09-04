import type { CSSProperties } from 'react';

/**
 * Escape hatch for inline CSS custom properties (`--len`, `--cmax`), which
 * React's `CSSProperties` type does not model.
 */
export const vars = (declarations: Record<string, string | number>): CSSProperties =>
  declarations as CSSProperties;
