import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { Icon } from './Icon';

export interface LegendItem {
  readonly label: string;
  readonly color: string;
  /** Series index this entry toggles; defaults to its position. */
  readonly series?: number;
}

export interface LegendProps {
  readonly items: readonly LegendItem[];
  readonly hidden: ReadonlySet<number>;
  readonly onToggle: (series: number) => void;
}

const legendSeries = (item: LegendItem, index: number): number => item.series ?? index;

export function Legend({ items, hidden, onToggle }: LegendProps) {
  const { chrome } = usePortalData();
  return (
    <div className="chart-legend">
      <span className="legend-lead">{chrome.copy.legendLead}</span>
      {items.map((item, index) => {
        const series = legendSeries(item, index);
        return (
          <button
            key={item.label}
            type="button"
            className={cx('legend-item', !hidden.has(series) && 'is-on')}
            onClick={() => onToggle(series)}
          >
            <span className="lg-box" style={{ background: item.color }}>
              <Icon name="check" />
            </span>
            <span className="lg-label" style={{ color: item.color }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
