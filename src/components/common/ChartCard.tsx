import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import type { HiddenSeries } from '@/components/charts/types';
import { Legend, type LegendItem } from './Legend';

export interface ChartCardProps {
  readonly head?: ReactNode;
  readonly legend?: readonly LegendItem[] | null;
  /** Renders the `.x-axis` strip between the chart and the legend. */
  readonly xAxisLabels?: readonly string[];
  readonly className?: string;
  /** Receives the series currently switched off in the legend. */
  readonly children: (hidden: HiddenSeries) => ReactNode;
}

/**
 * Owns the legend on/off state for one chart, which is what the original
 * `[data-chart]` / `[data-legend]` class toggling did imperatively.
 */
export function ChartCard({ head, legend, xAxisLabels, className, children }: ChartCardProps) {
  const [hidden, setHidden] = useState<ReadonlySet<number>>(() => new Set<number>());

  const toggle = useCallback((series: number) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(series)) next.delete(series);
      else next.add(series);
      return next;
    });
  }, []);

  return (
    <div className={cx('chart-card', className)}>
      {head}
      {children(hidden)}
      {xAxisLabels && (
        <div className="x-axis">
          {xAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      {legend && <Legend items={legend} hidden={hidden} onToggle={toggle} />}
    </div>
  );
}
