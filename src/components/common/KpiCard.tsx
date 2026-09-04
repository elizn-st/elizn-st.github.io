import { cx } from '@/lib/cx';
import type { Tone } from '@/lib/format';
import { useCountUp } from '@/hooks/useCountUp';
import { Sparkline } from '@/components/charts/Sparkline';
import { Icon } from './Icon';

export interface KpiCardProps {
  readonly label: string;
  readonly value: string;
  /** Omit to render the bare value with no scorecard. */
  readonly delta?: string | null;
  readonly direction?: Tone;
  /** Adds the sparkline and the "last updated" footer. */
  readonly graph?: boolean;
  readonly tone?: 'pos' | 'neg';
  /** Position in the row — drives the staggered count-up. */
  readonly index?: number;
}

const COUNT_BASE_DELAY_MS = 120;
const COUNT_STAGGER_MS = 70;

export function KpiCard({
  label,
  value,
  delta,
  direction = 'up',
  graph = false,
  tone,
  index = 0,
}: KpiCardProps) {
  const displayed = useCountUp(value, COUNT_BASE_DELAY_MS + index * COUNT_STAGGER_MS);

  return (
    <article className="kpi-card">
      <div className="kpi-head">
        <span className="kpi-label">{label}</span>
        <span className="kpi-menu">
          <Icon name="dots-three-vertical" />
        </span>
      </div>
      <div className={cx('kpi-value tnum', tone)}>{displayed}</div>
      {delta && (
        <div className="scorecard">
          <div className="score-row">
            <span className="score-label">Since last week</span>
            <span className={cx('score-badge', direction)}>
              <span className="score-icon">
                <Icon name={direction === 'up' ? 'trend-up' : 'trend-down'} />
              </span>
              <span className="score-value tnum">{delta}</span>
            </span>
          </div>
          {graph && (
            <div className="score-graph">
              <Sparkline direction={direction} />
            </div>
          )}
        </div>
      )}
      {graph && <div className="kpi-foot tnum">Last updated: 16:53 05-08-2026</div>}
    </article>
  );
}
