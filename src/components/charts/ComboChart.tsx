import { Fragment, useRef } from 'react';
import { usePortalData } from '@/state/DataContext';
import type { ComboWeek } from '@/data/series';
import { vars } from '@/lib/style';
import { EMPTY_HIDDEN, hiddenClass, type HiddenSeries } from './types';
import { layoutCategoryLabels, useChartViewBoxWidth } from './geometry';
import { CategoryLabel } from './CategoryLabel';

const HEIGHT = 224;
const PAD_LEFT = 40;
const PAD_RIGHT = 40;
const PAD_TOP = 6;
const BASE_PAD_BOTTOM = 18;
/**
 * Widest a stacked bar may be drawn.
 *
 * Without it a one-week window gives each bar 42% of the whole plot area, and
 * the chart reads as a coloured wall rather than a week.
 */
const MAX_BAR_WIDTH = 44;

/** Stacked approval/rejection bars with the revenue line on a second axis. */
export function ComboChart({
  weeks,
  hiddenSeries = EMPTY_HIDDEN,
}: {
  /** Already sliced to the selected window by the board. */
  readonly weeks: readonly ComboWeek[];
  readonly hiddenSeries?: HiddenSeries;
}) {
  const { series } = usePortalData();
  const {
    maxDecisions: MAX_DECISIONS,
    minRevenue: MIN_REVENUE,
    maxRevenue: MAX_REVENUE,
  } = series.chartConfig;
  const svgRef = useRef<SVGSVGElement>(null);
  const width = useChartViewBoxWidth(svgRef);

  const innerWidth = width - PAD_LEFT - PAD_RIGHT;
  const slot = innerWidth / weeks.length;
  const barWidth = Math.min(slot * 0.42, MAX_BAR_WIDTH);

  const labels = layoutCategoryLabels(
    weeks.map((week) => week.week),
    slot,
  );
  const innerHeight = HEIGHT - PAD_TOP - BASE_PAD_BOTTOM - labels.extraBottom;

  const yDecisions = (value: number) =>
    PAD_TOP + innerHeight - (value / MAX_DECISIONS) * innerHeight;
  const yRevenue = (value: number) =>
    PAD_TOP + innerHeight - ((value - MIN_REVENUE) / (MAX_REVENUE - MIN_REVENUE)) * innerHeight;

  const gridValues: number[] = [];
  for (let value = 0; value <= MAX_DECISIONS; value += 20) gridValues.push(value);

  const revenuePoints = weeks.map<[number, number]>((week, index) => [
    PAD_LEFT + slot * index + slot / 2,
    yRevenue(week.revenue),
  ]);
  const revenuePath = revenuePoints
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');

  const axisMidY = PAD_TOP + innerHeight / 2;

  return (
    <svg ref={svgRef} className="chart-svg" viewBox={`0 0 ${width} ${HEIGHT}`} role="img">
      <defs>
        <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--dv-app)" stopOpacity="1" />
          <stop offset=".85" stopColor="var(--dv-app)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridValues.map((value) => {
        const y = yDecisions(value);
        return (
          <Fragment key={value}>
            <line className="grid-line" x1={PAD_LEFT} x2={PAD_LEFT + innerWidth} y1={y} y2={y} />
            <text className="axis-text" x={PAD_LEFT - 6} y={y + 3} textAnchor="end">
              {value}
            </text>
            <text className="axis-text" x={PAD_LEFT + innerWidth + 6} y={y + 3}>
              {Math.round(MIN_REVENUE + (value / MAX_DECISIONS) * (MAX_REVENUE - MIN_REVENUE))}
            </text>
          </Fragment>
        );
      })}

      {weeks.map((week, index) => {
        const centerX = PAD_LEFT + slot * index + slot / 2;
        return (
          <Fragment key={week.week}>
            <rect
              className={hiddenClass(hiddenSeries, 0, 'bar')}
              x={centerX - barWidth / 2}
              y={yDecisions(week.approved)}
              width={barWidth}
              height={(week.approved / MAX_DECISIONS) * innerHeight}
              fill="url(#gApp)"
              data-s={0}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <title>{`${week.week} · Approved ${week.approved}`}</title>
            </rect>
            <rect
              className={hiddenClass(hiddenSeries, 1, 'bar')}
              x={centerX - barWidth / 2}
              y={yDecisions(week.approved + week.rejected)}
              width={barWidth}
              height={(week.rejected / MAX_DECISIONS) * innerHeight}
              fill="var(--dv-rej)"
              data-s={1}
              style={{ animationDelay: `${index * 55 + 40}ms` }}
            >
              <title>{`${week.week} · Rejected ${week.rejected}`}</title>
            </rect>
            <CategoryLabel
              layout={labels}
              index={index}
              x={centerX}
              y={HEIGHT - 4 - labels.extraBottom}
            />
          </Fragment>
        );
      })}

      <path
        d={revenuePath}
        className={hiddenClass(hiddenSeries, 2, 'series-line')}
        stroke="var(--dv-rev-line)"
        style={vars({ '--len': 1200, animationDelay: '420ms' })}
        data-s={2}
      />
      {revenuePoints.map(([x, y], index) => (
        <circle
          key={weeks[index].week}
          cx={x.toFixed(1)}
          cy={y.toFixed(1)}
          r={3.5}
          fill="#fff"
          stroke="var(--dv-rev-line)"
          strokeWidth={2.5}
          className={hiddenClass(hiddenSeries, 2, 'series-dot')}
          data-s={2}
          style={{ animationDelay: `${900 + index * 50}ms` }}
        >
          <title>{`${weeks[index].week} · AED ${weeks[index].revenue}K`}</title>
        </circle>
      ))}

      <text
        className="axis-title"
        x={10}
        y={axisMidY}
        transform={`rotate(-90 10 ${axisMidY})`}
        textAnchor="middle"
      >
        Decisions
      </text>
      <text
        className="axis-title"
        x={width - 6}
        y={axisMidY}
        transform={`rotate(90 ${width - 6} ${axisMidY})`}
        textAnchor="middle"
      >
        AED K
      </text>
    </svg>
  );
}
