import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_CHART_KEY, type ChartDetailKey } from '@/screens/chartDetail/keys';

interface ChartFocusValue {
  /** Which chart the `#/chartd` route should render. */
  readonly chartKey: ChartDetailKey;
  readonly focusChart: (key: ChartDetailKey) => void;
}

const ChartFocusContext = createContext<ChartFocusValue | null>(null);

export function ChartFocusProvider({ children }: { children: ReactNode }) {
  const [chartKey, setChartKey] = useState<ChartDetailKey>(DEFAULT_CHART_KEY);
  const focusChart = useCallback((key: ChartDetailKey) => setChartKey(key), []);
  const value = useMemo<ChartFocusValue>(() => ({ chartKey, focusChart }), [chartKey, focusChart]);
  return <ChartFocusContext.Provider value={value}>{children}</ChartFocusContext.Provider>;
}

export function useChartFocus(): ChartFocusValue {
  const value = useContext(ChartFocusContext);
  if (!value) throw new Error('useChartFocus must be used inside <ChartFocusProvider>');
  return value;
}
