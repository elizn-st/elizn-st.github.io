import type { DecisionStatus } from '@/data/queue';
import type { RuleStatus } from '@/data/rules';
import type { RunStatus } from '@/data/reports';
import type { AccountStatus } from '@/data/admin';
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

/**
 * An account's standing on the portal. `suspended` takes the inert grey rather
 * than red: access was deliberately withdrawn, which is an administrative
 * state, not a failure.
 */
const ACCOUNT_BADGE_CLASS: Record<AccountStatus, string> = {
  active: 'badge-approved',
  invited: 'badge-pending',
  suspended: 'badge-neutral',
};

export function AccountBadge({
  status,
  label,
}: {
  readonly status: AccountStatus;
  readonly label: string;
}) {
  return <span className={cx('badge', ACCOUNT_BADGE_CLASS[status])}>{label}</span>;
}

/**
 * One custom claim, as it appears in the ID token. The admin claim is drawn in
 * the warning amber because it is an elevated privilege, not a normal one.
 */
export function ClaimBadge({
  claim,
  label,
}: {
  readonly claim: 'portal' | 'admin' | 'none';
  readonly label: string;
}) {
  const tone =
    claim === 'portal' ? 'badge-approved' : claim === 'admin' ? 'badge-flagged' : 'badge-neutral';
  return <span className={cx('badge', tone)}>{label}</span>;
}
