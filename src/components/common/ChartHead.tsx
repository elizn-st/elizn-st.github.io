import { useRouter } from '@/routing/RouterContext';
import { useChartFocus } from '@/state/ChartFocusContext';
import type { ChartDetailKey } from '@/screens/chartDetail/keys';
import { Icon } from './Icon';

export interface ChartHeadProps {
  readonly title: string;
  readonly subtitle?: string;
  /** Optical alignment with the chart's plot area, in pixels. */
  readonly padLeft?: number;
  /** When set, the expand button opens the matching full chart page. */
  readonly chartKey?: ChartDetailKey;
  readonly expandLabel?: string;
  /** Overrides the expand action, e.g. the detail screen's history link. */
  readonly onExpand?: () => void;
}

export function ChartHead({
  title,
  subtitle,
  padLeft,
  chartKey,
  expandLabel = 'Open full view',
  onExpand,
}: ChartHeadProps) {
  const { navigate } = useRouter();
  const { focusChart } = useChartFocus();

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
      return;
    }
    if (!chartKey) return;
    focusChart(chartKey);
    navigate('chartd');
  };

  return (
    <div className="chart-head" style={padLeft ? { paddingLeft: `${padLeft}px` } : undefined}>
      <div className="chart-head-t">
        <h2 className="sec-title">{title}</h2>
        {subtitle && <p className="sec-sub">{subtitle}</p>}
      </div>
      <button type="button" className="expand-btn" aria-label={expandLabel} onClick={handleExpand}>
        <Icon name="arrow-square-out" />
      </button>
    </div>
  );
}
