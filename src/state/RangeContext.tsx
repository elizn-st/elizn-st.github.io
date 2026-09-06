import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { RangeId } from '@/data/ranges';

interface RangeValue {
  /** `null` until the reader picks one, so the board's authored default wins. */
  readonly chosen: RangeId | null;
  readonly choose: (range: RangeId) => void;
}

const RangeContext = createContext<RangeValue | null>(null);

/**
 * The window the five dashboards read.
 *
 * Shared rather than held per board: the tabs are five views of one dataset,
 * and having "Competitor intelligence" snap back to 8W because you picked 4W
 * on "Pricing performance" would read as the filter forgetting itself.
 *
 * Session-only, like the period selector on any reporting tool -- a reload
 * returns to the default the board document authors.
 */
export function DashboardRangeProvider({ children }: { children: ReactNode }) {
  const [chosen, setChosen] = useState<RangeId | null>(null);
  const choose = useCallback((range: RangeId) => setChosen(range), []);
  const value = useMemo<RangeValue>(() => ({ chosen, choose }), [chosen, choose]);
  return <RangeContext.Provider value={value}>{children}</RangeContext.Provider>;
}

export function useDashboardRange(): RangeValue {
  const value = useContext(RangeContext);
  if (!value) throw new Error('useDashboardRange must be used inside <DashboardRangeProvider>');
  return value;
}
