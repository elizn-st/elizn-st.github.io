import type { DecisionStatus } from '@/data/queue';
import type { RuleStatus } from '@/data/rules';
import type { RunStatus } from '@/data/reports';
import { cx } from '@/lib/cx';

/** Status pill — `approved`, `pending`, `flagged`, `rejected`, `overridden`. */
export function StatusBadge({ status }: { readonly status: DecisionStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cx('badge', `badge-${status}`)}>{label}</span>;
}

/**
 * A rule's lifecycle state, borrowing the decision pills rather than adding a
 * third palette: live reads as approved, a draft as pending, a paused rule as
 * inert.
 */
const RULE_BADGE_CLASS: Record<RuleStatus, string> = {
  active: 'badge-approved',
  draft: 'badge-pending',
  paused: 'badge-neutral',
};

export function RuleBadge({
  status,
  label,
}: {
  readonly status: RuleStatus;
  readonly label: string;
}) {
  return <span className={cx('badge', RULE_BADGE_CLASS[status])}>{label}</span>;
}

/**
 * The state of a report generation. Like RuleBadge this borrows the decision
 * pills rather than adding a palette: a finished run reads as approved, a
 * failure as rejected, a queued run as inert, and one still in flight takes the
 * informational blue.
 */
const RUN_BADGE_CLASS: Record<RunStatus, string> = {
  completed: 'badge-approved',
  running: 'badge-overridden',
  queued: 'badge-neutral',
  failed: 'badge-rejected',
};

export function RunBadge({
  status,
  label,
}: {
  readonly status: RunStatus;
  readonly label: string;
}) {
  return <span className={cx('badge', RUN_BADGE_CLASS[status])}>{label}</span>;
}
