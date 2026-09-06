import { Fragment, useRef } from 'react';
import { vars } from '@/lib/style';
import { EMPTY_HIDDEN, hiddenClass, type HiddenSeries } from './types';
import { AXIS_FONT_SIZE, estimateLabelWidth, useChartViewBoxWidth } from './geometry';

export interface LineSeries {
  readonly name: string;
  readonly color: string;
  readonly data: readonly number[];
  /** Fills the area beneath the line. */
  readonly area?: boolean;
}

export interface LineChartProps {
  readonly series: readonly LineSeries[];
  readonly labels: readonly string[];
  readonly format?: (value: number) => string;
  readonly height?: number;
  readonly hiddenSeries?: HiddenSeries;
}

const MIN_PAD_LEFT = 40;
const AXIS_GAP = 6;
const PAD_RIGHT = 8;
const PAD_TOP = 6;
const PAD_BOTTOM = 4;
const TICKS = [0, 1, 2, 3];

export function LineChart({
  series,
  labels,
  format = (value) => String(value),
  height = 150,
  hiddenSeries = EMPTY_HIDDEN,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = useChartViewBoxWidth(svgRef);

  const all = series.flatMap((s) => s.data);
  const min = Math.min(...all);
  const max = Math.max(...all);
  // A single week puts every series on one value, and a zero-height band would
  // divide by zero in `y`. Give it a band proportional to the value instead.
  const spread = max - min || Math.abs(max) * 0.1 || 1;
  const padded = min - spread * 0.15;
  // Cumulative money and unit counts never go below zero, so a padded floor
  // that does was labelling ticks like "AED -90K" under a rising curve.
  const low = min >= 0 && padded < 0 ? 0 : padded;
  const high = max + spread * 0.15;

  const ticks = TICKS.map((step) => {
    const value = low + (high - low) * (step / 3);
    return { value, label: format(value) };
  });

  // The gutter has to hold the widest tick label — "AED 3,543" overruns the
  // original fixed 40 units and used to be clipped at the viewBox edge.
  const padLeft = Math.max(
    MIN_PAD_LEFT,
    Math.ceil(Math.max(...ticks.map((t) => estimateLabelWidth(t.label, AXIS_FONT_SIZE)))) +
      AXIS_GAP,
  );

  const innerWidth = width - padLeft - PAD_RIGHT;
  const innerHeight = height - PAD_TOP - PAD_BOTTOM;

  // One label has no gaps to divide across, so it sits in the middle.
  const x = (index: number) =>
    labels.length < 2
      ? padLeft + innerWidth / 2
      : padLeft + (index / (labels.length - 1)) * innerWidth;
  const y = (value: number) => PAD_TOP + innerHeight - ((value - low) / (high - low)) * innerHeight;

  return (
    <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img">
      {ticks.map((tick) => (
        <Fragment key={tick.value}>
          <line
            className="grid-line"
            x1={padLeft}
            x2={padLeft + innerWidth}
            y1={y(tick.value)}
            y2={y(tick.value)}
          />
          <text className="axis-text" x={padLeft - AXIS_GAP} y={y(tick.value) + 3} textAnchor="end">
            {tick.label}
          </text>
        </Fragment>
      ))}
      {labels.map((label, index) => (
        <line
          key={label}
          className="grid-line"
          x1={x(index)}
          x2={x(index)}
          y1={PAD_TOP}
          y2={PAD_TOP + innerHeight}
          opacity=".5"
        />
      ))}
      {series.map((s, seriesIndex) => {
        const path = s.data
          .map(
            (value, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)} ${y(value).toFixed(1)}`,
          )
          .join(' ');
        return (
          <Fragment key={s.name}>
            {s.area && (
              <path
                d={`${path} L ${x(s.data.length - 1)} ${PAD_TOP + innerHeight} L ${padLeft} ${PAD_TOP + innerHeight} Z`}
                fill={s.color}
                className={hiddenClass(hiddenSeries, seriesIndex, 'series-area')}
                data-s={seriesIndex}
              />
            )}
            <path
              d={path}
              className={hiddenClass(hiddenSeries, seriesIndex, 'series-line')}
              stroke={s.color}
              style={vars({
                '--len': Math.round(innerWidth * 1.4),
                animationDelay: `${seriesIndex * 120}ms`,
              })}
              data-s={seriesIndex}
            />
            {s.data.map((value, index) => (
              <circle
                key={index}
                cx={x(index).toFixed(1)}
                cy={y(value).toFixed(1)}
                r={3}
                fill="#fff"
                stroke={s.color}
                strokeWidth={2}
                className={hiddenClass(hiddenSeries, seriesIndex, 'series-dot')}
                data-s={seriesIndex}
                style={{ animationDelay: `${600 + seriesIndex * 120 + index * 45}ms` }}
              >
                <title>{`${s.name}: ${format(value)}`}</title>
              </circle>
            ))}
          </Fragment>
        );
      })}
    </svg>
  );
}
