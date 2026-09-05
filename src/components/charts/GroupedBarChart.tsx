import { Fragment, useRef } from 'react';
import { usePortalData } from '@/state/DataContext';
import { aed } from '@/lib/format';
import { EMPTY_HIDDEN, hiddenClass, type HiddenSeries } from './types';
import { layoutCategoryLabels, useChartViewBoxWidth } from './geometry';
import { CategoryLabel } from './CategoryLabel';

const HEIGHT = 200;
const PAD_LEFT = 56;
const PAD_RIGHT = 8;
const PAD_TOP = 6;
const BASE_PAD_BOTTOM = 18;

/** e& against both tracked competitors, grouped by category. */
export function GroupedBarChart({
  hiddenSeries = EMPTY_HIDDEN,
}: {
  readonly hiddenSeries?: HiddenSeries;
}) {
  const { series } = usePortalData();
  const { retailers: RETAILERS, maxCategoryPrice: MAX } = series.chartConfig;
  const svgRef = useRef<SVGSVGElement>(null);
  const width = useChartViewBoxWidth(svgRef);

  const innerWidth = width - PAD_LEFT - PAD_RIGHT;
  const group = innerWidth / series.categoryPrices.length;
  const barWidth = group * 0.16;
  const gap = barWidth * 0.18;

  const labels = layoutCategoryLabels(
    series.categoryPrices.map((row) => row.category),
    group,
  );
  const innerHeight = HEIGHT - PAD_TOP - BASE_PAD_BOTTOM - labels.extraBottom;

  const y = (value: number) => PAD_TOP + innerHeight - (Math.min(value, MAX) / MAX) * innerHeight;

  const gridValues: number[] = [];
  for (let value = 0; value <= MAX; value += 500) gridValues.push(value);

  return (
    <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${width} ${HEIGHT}`} role="img">
      <defs>
        {RETAILERS.map((retailer, index) => (
          <linearGradient key={retailer.name} id={`gG${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={retailer.color} stopOpacity="1" />
            <stop offset="1" stopColor={retailer.color} stopOpacity=".10" />
          </linearGradient>
        ))}
      </defs>

      {gridValues.map((value) => (
        <Fragment key={value}>
          <line
            className="grid-line"
            x1={PAD_LEFT}
            x2={PAD_LEFT + innerWidth}
            y1={y(value)}
            y2={y(value)}
          />
          <text className="axis-text" x={PAD_LEFT - 6} y={y(value) + 3} textAnchor="end">
            {`AED ${value}`}
          </text>
        </Fragment>
      ))}

      {series.categoryPrices.map((row, index) => {
        const start = PAD_LEFT + group * index + (group - (barWidth * 3 + gap * 2)) / 2;
        const values = [row.eand, row.competitorA, row.competitorB];
        return (
          <Fragment key={row.category}>
            {values.map((value, seriesIndex) => (
              <rect
                key={seriesIndex}
                className={hiddenClass(hiddenSeries, seriesIndex, 'bar')}
                x={start + seriesIndex * (barWidth + gap)}
                y={y(value)}
                width={barWidth}
                height={(Math.min(value, MAX) / MAX) * innerHeight}
                fill={`url(#gG${seriesIndex})`}
                data-s={seriesIndex}
                style={{ animationDelay: `${index * 70 + seriesIndex * 35}ms` }}
              >
                <title>{`${row.category} · ${RETAILERS[seriesIndex].name} ${aed(value)}`}</title>
              </rect>
            ))}
            <CategoryLabel
              layout={labels}
              index={index}
              x={PAD_LEFT + group * index + group / 2}
              y={HEIGHT - 4 - labels.extraBottom}
            />
          </Fragment>
        );
      })}
    </svg>
  );
}
