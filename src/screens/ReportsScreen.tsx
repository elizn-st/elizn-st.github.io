import { useCallback, useMemo, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { useToast } from '@/state/ToastContext';
import { REPORT_CATEGORIES } from '@/data/reports';
import { saveReportSubscriptions } from '@/repositories/reports';
import { Icon } from '@/components/common/Icon';
import { KpiCard } from '@/components/common/KpiCard';
import { ToastButton } from '@/components/common/ToastButton';
import { NotificationRow } from '@/components/common/NotificationRow';
import { RunBadge } from '@/components/common/Badge';
import { SearchField } from '@/components/common/SearchField';
import { Segmented } from '@/components/common/Segmented';
import { FilterChips } from '@/components/common/FilterChips';
import { Switch } from '@/components/common/Switch';
import { Table, type TableColumn } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';
import type { ReportCategory, ReportMetric, ReportsCopy } from '@/data/reports';
import type { ReportRecord } from '@/repositories/reports';

export const reportsMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'reports'),
  width: 1180,
});

/** Column widths are layout; the labels come from the copy document. */
const COLUMN_CLASSES = ['tc', 'tc-110', 'tc-85', 'tc-170', 'tc-140', 'tc-110', 'tc-60'];

/** How many upcoming runs are worth listing before it stops being a schedule. */
const UPCOMING_ROWS = 5;

/* -------------------------------------------------------------------------- */
/* derivations                                                                 */
/*                                                                             */
/* Counted from the catalogue and the run feed rather than stored, so editing   */
/* a schedule in the Console moves the table, the scorecards, the upcoming      */
/* list, the distribution totals and the retention breakdown together.          */
/* -------------------------------------------------------------------------- */

/** "2.4 MB · 38s", dropping either half a run has not produced yet. */
const artefactOf = (report: ReportRecord): string =>
  [report.size, report.duration].filter((part) => part && part !== '—').join(' · ');

const isScheduled = (report: ReportRecord) => report.cadence !== 'on-demand';

const countMetrics = (
  reports: readonly ReportRecord[],
  runs: number,
  failed: number,
): Record<ReportMetric, number> => ({
  available: reports.length,
  scheduled: reports.filter(isScheduled).length,
  runs,
  failed,
});

interface RetentionRow {
  readonly window: string;
  readonly count: number;
  /** Longest windows first, so the regulated artefacts sort to the top. */
  readonly months: number;
}

/** "7 years" -> 84, "24 months" -> 24, "90 days" -> 3, for ordering only. */
const monthsIn = (window: string): number => {
  const amount = Number.parseFloat(window) || 0;
  if (window.includes('year')) return amount * 12;
  if (window.includes('day')) return amount / 30;
  return amount;
};

const countRetention = (reports: readonly ReportRecord[]): readonly RetentionRow[] => {
  const byWindow = new Map<string, number>();
  for (const report of reports) {
    byWindow.set(report.retention, (byWindow.get(report.retention) ?? 0) + 1);
  }
  return [...byWindow]
    .map(([window, count]) => ({ window, count, months: monthsIn(window) }))
    .sort((a, b) => b.months - a.months);
};

/* -------------------------------------------------------------------------- */

function Delivered({
  copy,
  reports,
}: {
  readonly copy: ReportsCopy;
  readonly reports: readonly ReportRecord[];
}) {
  return (
    <div className="card pad">
      <div className="chart-head">
        <div className="chart-head-t">
          <h2 className="sec-title">{copy.deliveredTitle}</h2>
          <p className="sec-sub">{copy.deliveredSubtitle}</p>
        </div>
        <span className="badge badge-neutral tnum">{reports.length}</span>
      </div>
      {reports.length === 0 ? (
        <div className="cd-note" style={{ marginTop: 'var(--s12)' }}>
          <span className="cd-bullet">
            <Icon name="tray" />
          </span>
          <p>{copy.deliveredEmpty}</p>
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="pf-perm">
            <span className="pf-perm-ic allowed">
              <Icon name={copy.formatIcons[report.format]} />
            </span>
            <span className="grow">
              <span className="pf-toggle-t">{report.name}</span>
              <span className="pf-toggle-s">
                {report.owner} · {copy.formatLabels[report.format]}
              </span>
            </span>
            <span className="pf-when tnum">{report.schedule}</span>
          </div>
        ))
      )}
    </div>
  );
}

function Upcoming({
  copy,
  reports,
}: {
  readonly copy: ReportsCopy;
  readonly reports: readonly ReportRecord[];
}) {
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.upcomingTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.upcomingSubtitle}
      </p>
      {reports.map((report) => (
        <div key={report.id} className="pf-perm">
          <span className="pf-perm-ic">
            <Icon name={report.icon} />
          </span>
          <span className="grow">
            <span className="pf-toggle-t">{report.name}</span>
            <span className="pf-toggle-s">
              {report.schedule} · {report.recipients} {copy.recipientsUnit}
            </span>
          </span>
          <span className="pf-when tnum">{report.nextRun}</span>
        </div>
      ))}
    </div>
  );
}

function Retention({
  copy,
  rows,
}: {
  readonly copy: ReportsCopy;
  readonly rows: readonly RetentionRow[];
}) {
  const plural = (count: number) => (count === 1 ? copy.reportsUnitOne : copy.reportsUnit);
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.retentionTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.retentionSubtitle}
      </p>
      {rows.map((row) => (
        <div key={row.window} className="kv">
          <span>{row.window}</span>
          <span className="tnum muted">
            {row.count} {plural(row.count)}
          </span>
        </div>
      ))}
    </div>
  );
}

function RecentRuns({ copy }: { readonly copy: ReportsCopy }) {
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.runsTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.runsSubtitle}
      </p>
      {copy.runs.map((run) => (
        <div key={`${run.when}-${run.report}`} className="hist">
          <div className="grow">
            <div className="hist-date">{run.report}</div>
            <div className="hist-reason">
              {run.detail} · {run.trigger}
            </div>
          </div>
          <span className="pf-when tnum">{run.when}</span>
          <RunBadge status={run.status} label={copy.statusLabels[run.status]} />
        </div>
      ))}
    </div>
  );
}

export function ReportsScreen() {
  const { catalogue, reports, identity } = usePortalData();
  const copy = reports.copy;
  const toast = useToast();

  const allCategories = copy.categoryFilters[0];
  const [categoryFilter, setCategoryFilter] = useState(allCategories);
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const subscribed = useMemo(
    () => new Set(identity.reportSubscriptions),
    [identity.reportSubscriptions],
  );

  /**
   * The one write the portal makes. No optimistic state: Firestore applies it
   * to the local cache and fires the user-document listener straight away, so
   * the switch moves immediately and a rejected write reverts it by itself.
   */
  const toggleDelivery = useCallback(
    (report: ReportRecord, wanted: boolean) => {
      const next = new Set(subscribed);
      if (wanted) next.add(report.id);
      else next.delete(report.id);

      void saveReportSubscriptions(identity.uid, [...next])
        .then(() => toast(wanted ? copy.subscribeMessage : copy.unsubscribeMessage))
        .catch((cause: unknown) => {
          console.error('[reports] could not save delivery preference', cause);
          toast(copy.subscribeFailed);
        });
    },
    [
      subscribed,
      identity.uid,
      toast,
      copy.subscribeMessage,
      copy.unsubscribeMessage,
      copy.subscribeFailed,
    ],
  );

  /** The category whose label the segmented control currently shows, if any. */
  const selectedCategory = useMemo<ReportCategory | null>(
    () =>
      REPORT_CATEGORIES.find((category) => copy.categoryLabels[category] === categoryFilter) ??
      null,
    [copy.categoryLabels, categoryFilter],
  );

  const filtered = useMemo(() => {
    const needle = trimmed.toLowerCase();
    return catalogue.filter((report) => {
      if (selectedCategory && report.category !== selectedCategory) return false;
      if (!needle) return true;
      return [
        report.name,
        report.note,
        report.owner,
        report.schedule,
        copy.categoryLabels[report.category],
        copy.formatLabels[report.format],
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [catalogue, selectedCategory, trimmed, copy.categoryLabels, copy.formatLabels]);

  /** Each chip knows how to undo the filter it stands for. */
  const chipActions = useMemo(() => {
    const actions = new Map<string, () => void>();
    if (categoryFilter !== allCategories) {
      actions.set(`${copy.categoryChipPrefix}${categoryFilter}`, () =>
        setCategoryFilter(allCategories),
      );
    }
    if (trimmed) {
      actions.set(`${copy.searchChipPrefix}“${trimmed}”`, () => setQuery(''));
    }
    return actions;
  }, [categoryFilter, allCategories, trimmed, copy.categoryChipPrefix, copy.searchChipPrefix]);

  const metrics = useMemo(
    () =>
      countMetrics(
        catalogue,
        copy.runs.length,
        copy.runs.filter((run) => run.status === 'failed').length,
      ),
    [catalogue, copy.runs],
  );

  const delivered = useMemo(
    () => catalogue.filter((report) => subscribed.has(report.id)),
    [catalogue, subscribed],
  );

  const upcoming = useMemo(
    () => catalogue.filter((report) => report.nextRun).slice(0, UPCOMING_ROWS),
    [catalogue],
  );

  const retention = useMemo(() => countRetention(catalogue), [catalogue]);

  const columns = useMemo<TableColumn[]>(
    () =>
      copy.columns.map((label, index) => ({
        className: COLUMN_CLASSES[index] ?? 'tc',
        header: label,
        label,
      })),
    [copy.columns],
  );

  const rows = filtered.map((report) => ({
    key: report.id,
    cells: [
      {
        content: (
          <span className="row" style={{ gap: 'var(--s8)' }}>
            <span className="muted">
              <Icon name={report.icon} />
            </span>
            <span className="grow">
              {report.name}
              {report.note && <span className="tnote">{report.note}</span>}
            </span>
          </span>
        ),
      },
      { content: copy.categoryLabels[report.category] },
      {
        content: (
          <span className="row" style={{ gap: '6px' }}>
            <Icon name={copy.formatIcons[report.format]} />
            {copy.formatLabels[report.format]}
          </span>
        ),
        className: 'muted',
      },
      { content: report.schedule },
      {
        content: (
          <>
            <span className="tnum">{report.lastRun}</span>
            {/* A run still in flight has produced neither a file nor a
                duration, so it gets no second line rather than "— · —". */}
            {artefactOf(report) && <span className="tnote tnum">{artefactOf(report)}</span>}
          </>
        ),
      },
      {
        content: (
          <RunBadge status={report.lastStatus} label={copy.statusLabels[report.lastStatus]} />
        ),
      },
      {
        content: (
          <Switch
            defaultChecked={false}
            checked={subscribed.has(report.id)}
            label={`${copy.deliveryAriaPrefix}${report.name}`}
            onChange={(wanted) => toggleDelivery(report, wanted)}
          />
        ),
      },
    ],
  }));

  const plural = (count: number) => (count === 1 ? copy.reportsUnitOne : copy.reportsUnit);

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
        <ToastButton className="btn btn-primary" message={copy.requestMessage}>
          <Icon name={copy.requestIcon} /> {copy.requestLabel}
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

      {/* The catalogue is the primary content and gets the full column: seven
          columns in a side panel would scroll horizontally on every desktop. */}
      <div className="stack" style={{ gap: 'var(--s8)' }}>
        <div>
          <h2 className="sec-title">{copy.catalogueTitle}</h2>
          <p className="sec-sub">{copy.catalogueSubtitle}</p>
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
              options={copy.categoryFilters}
              defaultValue={allCategories}
              value={categoryFilter}
              onChange={setCategoryFilter}
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
              {filtered.length} {copy.resultsOf} {catalogue.length} {plural(catalogue.length)}
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
        <div className="reports-table">
          <Table columns={columns} rows={rows} rowStaggerMs={35} />
        </div>
      )}

      {/* Paired so the two columns land at roughly the same height. */}
      <div className="d-cols">
        <div className="stack">
          <Delivered copy={copy} reports={delivered} />
          <RecentRuns copy={copy} />
        </div>
        <div className="stack">
          <Upcoming copy={copy} reports={upcoming} />
          <Retention copy={copy} rows={retention} />
        </div>
      </div>
    </>
  );
}
