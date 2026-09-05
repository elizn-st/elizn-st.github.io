import { usePortalData } from '@/state/DataContext';
import type { Tone } from '@/lib/format';

const WIDTH = 220;
const HEIGHT = 40;

/** The tiny area chart tucked inside a KPI scorecard. */
export function Sparkline({ direction }: { readonly direction: Tone }) {
  const { series } = usePortalData();
  const { sparklineUp, sparklineDown } = series.chartConfig;
  const values = direction === 'down' ? sparklineDown : sparklineUp;
  const color = direction === 'down' ? 'var(--bad)' : 'var(--ok40)';

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map<[number, number]>((value, index) => [
    index * (WIDTH / (values.length - 1)),
    HEIGHT - ((value - min) / span) * (HEIGHT - 8) - 4,
  ]);
  const path = points
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
      <path
        d={`${path} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`}
        fill={color}
        className="spark-area"
      />
      <path d={path} className="spark-line" stroke={color} />
    </svg>
  );
}
