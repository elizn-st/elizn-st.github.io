import type { Tone } from '@/lib/format';

const UP = [14, 17, 15, 20, 18, 23, 21, 26, 24, 29, 27, 33];
const DOWN = [30, 26, 28, 23, 25, 20, 22, 17, 19, 15, 17, 12];

const WIDTH = 220;
const HEIGHT = 40;

/** The tiny area chart tucked inside a KPI scorecard. */
export function Sparkline({ direction }: { readonly direction: Tone }) {
  const values = direction === 'down' ? DOWN : UP;
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
