import { useMemo, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { useDelayedWidth } from '@/hooks/useDelayedWidth';
import { RULE_STAGES, RULE_STATUSES } from '@/data/rules';
import { Icon } from '@/components/common/Icon';
import { KpiCard } from '@/components/common/KpiCard';
import { ToastButton } from '@/components/common/ToastButton';
import { NotificationRow } from '@/components/common/NotificationRow';
import { RuleBadge, StatusBadge } from '@/components/common/Badge';
import { SearchField } from '@/components/common/SearchField';
import { Segmented } from '@/components/common/Segmented';
import { FilterChips } from '@/components/common/FilterChips';
import { Table, type TableColumn } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';
import type { RuleMetric, RuleStage, RuleStatus, RulesCopy } from '@/data/rules';
import type { RuleRecord } from '@/repositories/rules';

export const rulesMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'rules'),
  width: 1180,
});

/** Column widths are layout; the labels come from the copy document. */
const COLUMN_CLASSES = ['tc', 'tc-110', 'tc-140', 'tc-110', 'tc-60', 'tc-85'];

const BAR_BASE_DELAY_MS = 240;
const BAR_STAGGER_MS = 70;

/** How many rules the binding chart shows before it stops being a ranking. */
const BINDING_ROWS = 5;

/* -------------------------------------------------------------------------- */
/* derivations                                                                 */
/*                                                                             */
/* Every number on this page is counted from the rules collection rather than  */
/* stored, so editing a threshold in the Console moves the table, the stage     */
/* counts, the coverage list, the bars and the scorecards in one go.           */
/* -------------------------------------------------------------------------- */

const isLive = (rule: RuleRecord) => rule.status === 'active';

const countMetrics = (
  rules: readonly RuleRecord[],
  pending: number,
): Record<RuleMetric, number> => ({
  active: rules.filter(isLive).length,
  hard: rules.filter((rule) => isLive(rule) && rule.enforcement === 'hard').length,
  // Block *events*, not distinct recommendations: two rules can block the same
  // one, so only the event count is arithmetically safe to sum.
  blocks: rules.reduce((total, rule) => total + rule.blocked, 0),
  pending,
});

interface CoverageRow {
  readonly scope: string;
  readonly count: number;
  /** Whether an active hard guardrail covers this scope at all. */
  readonly hard: boolean;
}

const countCoverage = (rules: readonly RuleRecord[]): readonly CoverageRow[] => {
  const byScope = new Map<string, { count: number; hard: boolean }>();
  for (const rule of rules) {
    for (const scope of rule.scopes) {
      const entry = byScope.get(scope) ?? { count: 0, hard: false };
      entry.count += 1;
      entry.hard = entry.hard || (isLive(rule) && rule.enforcement === 'hard');
      byScope.set(scope, entry);
    }
  }
  return [...byScope]
    .map(([scope, entry]) => ({ scope, ...entry }))
    .sort((a, b) => b.count - a.count || a.scope.localeCompare(b.scope));
};

const countByStage = (rules: readonly RuleRecord[]): Record<RuleStage, number> => {
  const counts = {} as Record<RuleStage, number>;
  for (const stage of RULE_STAGES) counts[stage] = 0;
  for (const rule of rules) counts[rule.stage] += 1;
  return counts;
};

/* -------------------------------------------------------------------------- */

function BindingBar({
  rule,
  percent,
  index,
}: {
  readonly rule: RuleRecord;
  readonly percent: number;
  readonly index: number;
}) {
  const width = useDelayedWidth(percent, BAR_BASE_DELAY_MS + index * BAR_STAGGER_MS);
  return (
    <div className="factor">
      <div className="factor-head">
        <span>{rule.name}</span>
        <span className="tnum muted">{rule.bindings}</span>
      </div>
      <div className="factor-bar">
        <div className="factor-fill" style={{ width }} />
      </div>
    </div>
  );
}

function EvaluationOrder({
  copy,
  counts,
}: {
  readonly copy: RulesCopy;
  readonly counts: Record<RuleStage, number>;
}) {
  const plural = (count: number) => (count === 1 ? copy.rulesUnitOne : copy.rulesUnit);
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.stagesTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.stagesSubtitle}
      </p>
      {copy.stages.map((stage, index) => (
        <div key={stage.key} className="pf-perm">
          <span className="cd-bullet rule-stage-no">{index + 1}</span>
          <span className="grow">
            <span className="pf-toggle-t">{stage.title}</span>
            <span className="pf-toggle-s">{stage.description}</span>
          </span>
          <span className="badge badge-neutral tnum">
            {counts[stage.key]} {plural(counts[stage.key])}
          </span>
        </div>
      ))}
    </div>
  );
}

function Coverage({
  copy,
  rows,
}: {
  readonly copy: RulesCopy;
  readonly rows: readonly CoverageRow[];
}) {
  const plural = (count: number) => (count === 1 ? copy.rulesUnitOne : copy.rulesUnit);
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.coverageTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.coverageSubtitle}
      </p>
      {rows.map((row) => (
        <div key={row.scope} className="kv">
          <span title={row.hard ? copy.coverageHardTitle : copy.coverageSoftTitle}>
            <span
              className="dot"
              style={{ background: row.hard ? 'var(--ok)' : 'var(--warn)' }}
              aria-hidden="true"
            />
            {row.scope}
          </span>
          <span className="tnum muted">
            {row.count} {plural(row.count)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChangeLog({ copy }: { readonly copy: RulesCopy }) {
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.changeLogTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.changeLogSubtitle}
      </p>
      {copy.changeLog.map((entry) => (
        <div key={`${entry.date}-${entry.rule}`} className="hist">
          <div className="grow">
            <div className="hist-date">{entry.rule}</div>
            <div className="hist-reason">
              {entry.change} · {entry.requester}
            </div>
          </div>
          <span className="pf-when tnum">{entry.date}</span>
          <StatusBadge status={entry.status} />
        </div>
      ))}
    </div>
  );
}

export function RulesScreen() {
  const { pricingRules, rules } = usePortalData();
  const copy = rules.copy;

  const allStatuses = copy.statusFilters[0];
  const [statusFilter, setStatusFilter] = useState(allStatuses);
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const stageTitles = useMemo(() => {
    const titles = {} as Record<RuleStage, string>;
    for (const stage of RULE_STAGES) titles[stage] = '';
    for (const stage of copy.stages) titles[stage.key] = stage.title;
    return titles;
  }, [copy.stages]);

  /** The status whose label the segmented control currently shows, if any. */
  const selectedStatus = useMemo<RuleStatus | null>(
    () => RULE_STATUSES.find((status) => copy.statusLabels[status] === statusFilter) ?? null,
    [copy.statusLabels, statusFilter],
  );

  const filtered = useMemo(() => {
    const needle = trimmed.toLowerCase();
    return pricingRules.filter((rule) => {
      if (selectedStatus && rule.status !== selectedStatus) return false;
      if (!needle) return true;
      return [
        rule.name,
        rule.note,
        rule.threshold,
        rule.owner,
        stageTitles[rule.stage],
        copy.enforcementLabels[rule.enforcement],
        ...rule.scopes,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [pricingRules, selectedStatus, trimmed, stageTitles, copy.enforcementLabels]);

  /**
   * Each chip knows how to undo the filter it stands for, so dismissing one
   * actually widens the result set rather than only clearing the chip.
   */
  const chipActions = useMemo(() => {
    const actions = new Map<string, () => void>();
    if (statusFilter !== allStatuses) {
      actions.set(`${copy.statusChipPrefix}${statusFilter}`, () => setStatusFilter(allStatuses));
    }
    if (trimmed) {
      actions.set(`${copy.searchChipPrefix}“${trimmed}”`, () => setQuery(''));
    }
    return actions;
  }, [statusFilter, allStatuses, trimmed, copy.statusChipPrefix, copy.searchChipPrefix]);

  const metrics = useMemo(
    () =>
      countMetrics(
        pricingRules,
        copy.changeLog.filter((entry) => entry.status === 'pending').length,
      ),
    [pricingRules, copy.changeLog],
  );

  const stageCounts = useMemo(() => countByStage(pricingRules), [pricingRules]);
  const coverage = useMemo(() => countCoverage(pricingRules), [pricingRules]);

  const binding = useMemo(() => {
    const ranked = [...pricingRules]
      .filter((rule) => rule.bindings > 0)
      .sort((a, b) => b.bindings - a.bindings)
      .slice(0, BINDING_ROWS);
    const max = ranked[0]?.bindings ?? 1;
    return ranked.map((rule) => ({ rule, percent: Math.round((rule.bindings / max) * 100) }));
  }, [pricingRules]);

  const columns = useMemo<TableColumn[]>(
    () =>
      copy.columns.map((label, index) => ({
        className: COLUMN_CLASSES[index] ?? 'tc',
        header: label,
        label,
      })),
    [copy.columns],
  );

  const rows = filtered.map((rule) => ({
    key: rule.id,
    cells: [
      {
        content: (
          <span className="row" style={{ gap: 'var(--s8)' }}>
            <span className="muted">
              <Icon name={rule.icon} />
            </span>
            <span className="grow">
              {rule.name}
              {rule.note && <span className="tnote">{rule.note}</span>}
            </span>
          </span>
        ),
      },
      { content: rule.scopes.join(', ') },
      { content: rule.threshold, className: 'tnum' },
      {
        content: (
          <span className="row" style={{ gap: '6px' }}>
            <Icon name={copy.enforcementIcons[rule.enforcement]} />
            {copy.enforcementLabels[rule.enforcement]}
          </span>
        ),
        className: rule.enforcement === 'soft' ? 'muted' : undefined,
      },
      { content: rule.bindings, className: 'tnum' },
      { content: <RuleBadge status={rule.status} label={copy.statusLabels[rule.status]} /> },
    ],
  }));

  const plural = (count: number) => (count === 1 ? copy.rulesUnitOne : copy.rulesUnit);

  return (
    <>
      <div className="q-head">
        <div className="q-title">
          <h1 className="page-title">{copy.title}</h1>
          <span className="chip-sm">{copy.chip}</span>
        </div>
        <ToastButton className="btn" message={copy.exportMessage}>
          <Icon name={copy.exportIcon} /> {copy.exportLabel}
        </ToastButton>
        <ToastButton className="btn btn-primary" message={copy.proposeMessage}>
          <Icon name={copy.proposeIcon} /> {copy.proposeLabel}
        </ToastButton>
      </div>

      <NotificationRow
        severity={copy.notice.severity}
        icon={copy.notice.icon}
        title={copy.notice.title}
      />

      <div className="kpi-row">
        {copy.kpis.map((kpi, index) => (
          <KpiCard
            key={kpi.metric}
            index={index}
            label={kpi.label}
            value={String(metrics[kpi.metric])}
            delta={kpi.delta || null}
            direction={kpi.direction || 'up'}
            tone={kpi.tone || undefined}
          />
        ))}
      </div>

      {/* The rule set is the primary content and gets the full column: six
          columns in a 1.6fr panel would scroll horizontally on every desktop. */}
      <div className="stack" style={{ gap: 'var(--s8)' }}>
        <div>
          <h2 className="sec-title">{copy.tableTitle}</h2>
          <p className="sec-sub">{copy.tableSubtitle}</p>
        </div>

        <div className="q-filters">
          <div className="q-search-row">
            <SearchField
              placeholder={copy.searchPlaceholder}
              ariaLabel={copy.searchAriaLabel}
              value={query}
              onChange={setQuery}
            />
            <Segmented
              options={copy.statusFilters}
              defaultValue={allStatuses}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
          <div className="filters-results">
            {chipActions.size > 0 && (
              <>
                <FilterChips
                  labels={[...chipActions.keys()]}
                  onRemove={(label) => chipActions.get(label)?.()}
                />
                <span className="vdiv" />
              </>
            )}
            <span className="results-count tnum">
              {filtered.length} {copy.resultsOf} {pricingRules.length} {plural(pricingRules.length)}
            </span>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card pad">
          <div className="cd-note">
            <span className="cd-bullet">
              <Icon name={copy.emptyIcon} />
            </span>
            <p>{copy.emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="rules-table">
          <Table columns={columns} rows={rows} rowStaggerMs={35} />
        </div>
      )}

      {/* Paired so the two columns end up roughly the same height: the seven
          pipeline stages balance the bars plus the change log. */}
      <div className="d-cols">
        <div className="stack">
          <EvaluationOrder copy={copy} counts={stageCounts} />
          <Coverage copy={copy} rows={coverage} />
        </div>
        <div className="stack">
          <div className="card pad">
            <h2 className="sec-title">{copy.bindingTitle}</h2>
            <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
              {copy.bindingSubtitle}
            </p>
            {binding.map((entry, index) => (
              <BindingBar
                key={entry.rule.id}
                rule={entry.rule}
                percent={entry.percent}
                index={index}
              />
            ))}
          </div>
          <ChangeLog copy={copy} />
        </div>
      </div>
    </>
  );
}
