import { aed } from '@/lib/format';

const WIDTH = 320;
const HEIGHT = 172;
const CX = 160;
const CY = 148;
const R_OUTER = 116;
const R_INNER = 84;

const polar = (angle: number, radius: number): [number, number] => [
  CX + radius * Math.cos(angle),
  CY + radius * Math.sin(angle),
];

/** Half-donut band between two fractions of the 180° sweep. */
const band = (from: number, to: number, fill: string) => {
  const a0 = Math.PI + Math.PI * from;
  const a1 = Math.PI + Math.PI * to;
  const [x0, y0] = polar(a0, R_OUTER);
  const [x1, y1] = polar(a1, R_OUTER);
  const [x2, y2] = polar(a1, R_INNER);
  const [x3, y3] = polar(a0, R_INNER);
  const largeArc = to - from > 0.5 ? 1 : 0;
  return (
    <path
      key={`${from}-${to}`}
      d={`M${x0} ${y0} A${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${x1} ${y1} L${x2} ${y2} A${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${x3} ${y3} Z`}
      fill={fill}
    />
  );
};

export interface GuardrailGaugeProps {
  readonly value: number;
  readonly floor: number;
  readonly ceiling: number;
}

/** Where the recommended price sits between the margin floor and ceiling. */
export function GuardrailGauge({ value, floor, ceiling }: GuardrailGaugeProps) {
  const fraction = Math.max(0, Math.min(1, (value - floor) / (ceiling - floor)));
  const angle = Math.PI + Math.PI * fraction;
  const midRadius = (R_OUTER + R_INNER) / 2;
  const [markerX, markerY] = polar(angle, midRadius);

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      style={{ maxWidth: '340px', margin: '0 auto' }}
    >
      {band(0, 1, 'var(--n10)')}
      {band(0, 0.4, '#3DCC87')}
      {band(0.4, 0.76, '#EDA12F')}
      {band(0.76, 1, '#E62E2E')}
      <circle
        className="gauge-marker"
        cx={markerX.toFixed(1)}
        cy={markerY.toFixed(1)}
        r={8}
        fill="var(--maroon)"
        stroke="#fff"
        strokeWidth={3}
      />
      <text
        x={CX}
        y={CY - 14}
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--maroon)"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {aed(value)}
      </text>
      <text className="axis-text" x={CX - R_OUTER} y={CY + 18}>
        {`Floor ${floor.toLocaleString()}`}
      </text>
      <text className="axis-text" x={CX + R_OUTER} y={CY + 18} textAnchor="end">
        {`Ceiling ${ceiling.toLocaleString()}`}
      </text>
    </svg>
  );
}
