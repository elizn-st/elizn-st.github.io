import { Fragment, useRef } from 'react';
import type { ElasticityBar } from '@/data/series';
import { layoutCategoryLabels, useChartViewBoxWidth } from './geometry';
import { CategoryLabel } from './CategoryLabel';

const HEIGHT = 170;
const PAD_LEFT = 36;
const PAD_RIGHT = 8;
const PAD_TOP = 22;
const BASE_PAD_BOTTOM = 18;

/** Single-series bars with the value printed above each column. */
export function BarChart({ items }: { readonly items: readonly ElasticityBar[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = useChartViewBoxWidth(svgRef);

  const innerWidth = width - PAD_LEFT - PAD_RIGHT;
  const max = Math.max(...items.map((item) => item.value)) * 1.15;
  const slot = innerWidth / items.length;
  const barWidth = slot * 0.4;

  const labels = layoutCategoryLabels(
    items.map((item) => item.label),
    slot,
  );
  const innerHeight = HEIGHT - PAD_TOP - BASE_PAD_BOTTOM - labels.extraBottom;

  const y = (value: number) => PAD_TOP + innerHeight - (value / max) * innerHeight;

  return (
    <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${width} ${HEIGHT}`} role="img">
      <defs>
        {items.map((item, index) => (
          <linearGradient key={item.label} id={`gS${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={item.color} stopOpacity="1" />
            <stop offset="1" stopColor={item.color} stopOpacity=".10" />
          </linearGradient>
        ))}
      </defs>

      {[0, 1, 2, 3].map((step) => {
        const gridY = PAD_TOP + innerHeight - (step / 3) * innerHeight;
        return (
          <line
            key={step}
            className="grid-line"
            x1={PAD_LEFT}
            x2={PAD_LEFT + innerWidth}
            y1={gridY}
            y2={gridY}
          />
        );
      })}

      {items.map((item, index) => {
        const centerX = PAD_LEFT + slot * index + slot / 2;
        return (
          <Fragment key={item.label}>
            <rect
              className="bar"
              x={centerX - barWidth / 2}
              y={y(item.value)}
              width={barWidth}
              height={(item.value / max) * innerHeight}
              fill={`url(#gS${index})`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <title>{`${item.label}: ${item.display}`}</title>
            </rect>
            <text className="axis-text" x={centerX} y={y(item.value) - 8} textAnchor="middle">
              {item.display}
            </text>
            <CategoryLabel
              layout={labels}
              index={index}
              x={centerX}
              y={HEIGHT - 4 - labels.extraBottom}
            />
          </Fragment>
        );
      })}
    </svg>
  );
}
