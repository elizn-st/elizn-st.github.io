import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import type { Tone } from '@/lib/format';
import { useCountUp } from '@/hooks/useCountUp';
import { Sparkline } from '@/components/charts/Sparkline';
import { Icon } from './Icon';
import type { KpiSpec } from '@/data/ui';

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
  /**
   * What the delta is measured against. Defaults to the chrome copy's shared
   * line; the home cards override it because they compare a day with the
   * cycle's average rather than this week with last.
   */
  readonly scoreLabel?: string;
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
  scoreLabel,
}: KpiCardProps) {
  const { chrome } = usePortalData();
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
            <span className="score-label">{scoreLabel ?? chrome.copy.scoreLabel}</span>
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
      {graph && <div className="kpi-foot tnum">{chrome.copy.lastUpdated}</div>}
    </article>
  );
}

/**
 * A row's worth of scorecards from the copy document. A fragment, so the
 * `.kpi-row` wrapper stays with the screen that owns the layout.
 */
export function KpiCards({
  kpis,
  scoreLabel,
}: {
  readonly kpis: readonly KpiSpec[];
  readonly scoreLabel?: string;
}) {
  return (
    <>
      {kpis.map((kpi, index) => (
        <KpiCard
          key={kpi.label}
          index={index}
          scoreLabel={scoreLabel}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta || null}
          direction={kpi.direction || 'up'}
          tone={kpi.tone || undefined}
          graph={kpi.graph}
        />
      ))}
    </>
  );
}
