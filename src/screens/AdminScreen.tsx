import { useMemo, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { ACCOUNT_STATUSES } from '@/data/admin';
import { Icon } from '@/components/common/Icon';
import { KpiCard } from '@/components/common/KpiCard';
import { ToastButton } from '@/components/common/ToastButton';
import { NotificationRow } from '@/components/common/NotificationRow';
import { AccountBadge, ClaimBadge } from '@/components/common/Badge';
import { SearchField } from '@/components/common/SearchField';
import { Segmented } from '@/components/common/Segmented';
import { FilterChips } from '@/components/common/FilterChips';
import { Table, type TableColumn } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';
import type { AccountStatus, AdminCopy, AdminMetric, PortalRole } from '@/data/admin';
import type { PersonRecord } from '@/repositories/admin';
import type { Identity } from '@/state/DataContext';

export const adminMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'admin'),
  width: 1180,
});

/** Column widths are layout; the labels come from the copy document. */
const COLUMN_CLASSES = ['tc', 'tc-140', 'tc-170', 'tc-140', 'tc-110', 'tc-110'];

/* -------------------------------------------------------------------------- */
/* derivations                                                                 */
/*                                                                             */
/* Counted from the directory rather than stored, so a claim changed in the     */
/* Console moves the scorecards, the role headcount and the department          */
/* breakdown together.                                                          */
/* -------------------------------------------------------------------------- */

const countMetrics = (people: readonly PersonRecord[]): Record<AdminMetric, number> => ({
  access: people.filter((person) => person.portalAccess).length,
  administrators: people.filter((person) => person.admin).length,
  // Invited, but no Firebase account has ever been created for the address.
  pending: people.filter((person) => !person.signedUp && person.status === 'invited').length,
  suspended: people.filter((person) => person.status === 'suspended').length,
});

const countByRole = (people: readonly PersonRecord[]): Record<PortalRole, number> => {
  const counts = {} as Record<PortalRole, number>;
  for (const person of people) counts[person.role] = (counts[person.role] ?? 0) + 1;
  return counts;
};

interface DepartmentRow {
  readonly department: string;
  readonly count: number;
}

/** Only people who can actually get in: a department of invitations is not access. */
const countByDepartment = (people: readonly PersonRecord[]): readonly DepartmentRow[] => {
  const byDepartment = new Map<string, number>();
  for (const person of people) {
    if (!person.portalAccess) continue;
    byDepartment.set(person.department, (byDepartment.get(person.department) ?? 0) + 1);
  }
  return [...byDepartment]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count || a.department.localeCompare(b.department));
};

/* -------------------------------------------------------------------------- */

/**
 * The claims on this session's own token. Not a copy of the directory row --
 * this is read from the ID token the security rules are evaluating, so it is
 * the one place on the portal that cannot be out of date.
 */
function YourAccess({ copy, identity }: { readonly copy: AdminCopy; readonly identity: Identity }) {
  const claims = identity.claims;

  const rows = [
    {
      key: 'portal',
      title: copy.accessPortalTitle,
      note: copy.accessPortalNote,
      granted: claims?.portalAccess ?? false,
    },
    {
      key: 'admin',
      title: copy.accessAdminTitle,
      note: copy.accessAdminNote,
      granted: claims?.admin ?? false,
    },
  ];

  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.accessTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.accessSubtitle}
      </p>

      <div className="pf-perm">
        <span className="avatar">{identity.initials}</span>
        <span className="grow">
          <span className="pf-toggle-t">{identity.fullName}</span>
          <span className="pf-toggle-s">{identity.email}</span>
        </span>
      </div>

      {claims === null ? (
        <div className="cd-note" style={{ marginTop: 'var(--s12)' }}>
          <span className="cd-bullet">
            <Icon name="circle-notch" />
          </span>
          <p>{copy.accessUnknown}</p>
        </div>
      ) : (
        rows.map((row) => (
          <div key={row.key} className="pf-perm">
            <span className={cx('pf-perm-ic', row.granted ? 'allowed' : 'denied')}>
              <Icon name={row.granted ? 'check' : 'lock-simple'} />
            </span>
            <span className="grow">
              <span className="pf-toggle-t">{row.title}</span>
              <span className="pf-toggle-s">{row.note}</span>
            </span>
            <span className={cx('badge', row.granted ? 'badge-approved' : 'badge-neutral')}>
              {row.granted ? copy.accessGranted : copy.accessWithheld}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function Roles({
  copy,
  counts,
  selected,
  onSelect,
}: {
  readonly copy: AdminCopy;
  readonly counts: Record<PortalRole, number>;
  readonly selected: PortalRole | null;
  readonly onSelect: (role: PortalRole) => void;
}) {
  const plural = (count: number) => (count === 1 ? copy.peopleUnitOne : copy.peopleUnit);
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.rolesTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.rolesSubtitle}
      </p>
      {copy.roles.map((role) => {
        const count = counts[role.key] ?? 0;
        return (
          <button
            key={role.key}
            type="button"
            className={cx('pf-perm role-row', role.key === selected && 'is-selected')}
            aria-pressed={role.key === selected}
            onClick={() => onSelect(role.key)}
          >
            <span className="pf-perm-ic">
              <Icon name={role.icon} />
            </span>
            <span className="grow">
              <span className="pf-toggle-t">{role.title}</span>
              <span className="pf-toggle-s">{role.description}</span>
            </span>
            <span className="badge badge-neutral tnum">
              {count} {plural(count)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Departments({
  copy,
  rows,
}: {
  readonly copy: AdminCopy;
  readonly rows: readonly DepartmentRow[];
}) {
  const plural = (count: number) => (count === 1 ? copy.peopleUnitOne : copy.peopleUnit);
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.departmentsTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.departmentsSubtitle}
      </p>
      {rows.map((row) => (
        <div key={row.department} className="kv">
          <span>{row.department}</span>
          <span className="tnum muted">
            {row.count} {plural(row.count)}
          </span>
        </div>
      ))}
    </div>
  );
}

function AccessChanges({ copy }: { readonly copy: AdminCopy }) {
  return (
    <div className="card pad">
      <h2 className="sec-title">{copy.changesTitle}</h2>
      <p className="sec-sub" style={{ marginBottom: 'var(--s4)' }}>
        {copy.changesSubtitle}
      </p>
      {copy.changes.map((entry) => (
        <div key={`${entry.date}-${entry.person}`} className="hist">
          <div className="grow">
            <div className="hist-date">{entry.person}</div>
            <div className="hist-reason">
              {entry.change} · {entry.actor}
            </div>
          </div>
          <span className="pf-when tnum">{entry.date}</span>
          <AccountBadge status={entry.status} label={copy.statusLabels[entry.status]} />
        </div>
      ))}
    </div>
  );
}

export function AdminScreen() {
  const { people, admin, identity } = usePortalData();
  const copy = admin.copy;

  const allStatuses = copy.statusFilters[0];
  const [statusFilter, setStatusFilter] = useState(allStatuses);
  const [roleFilter, setRoleFilter] = useState<PortalRole | null>(null);
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  /** The status whose label the segmented control currently shows, if any. */
  const selectedStatus = useMemo<AccountStatus | null>(
    () => ACCOUNT_STATUSES.find((status) => copy.statusLabels[status] === statusFilter) ?? null,
    [copy.statusLabels, statusFilter],
  );

  const filtered = useMemo(() => {
    const needle = trimmed.toLowerCase();
    return people.filter((person) => {
      if (selectedStatus && person.status !== selectedStatus) return false;
      if (roleFilter && person.role !== roleFilter) return false;
      if (!needle) return true;
      return [person.name, person.email, person.department, copy.roleLabels[person.role]]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [people, selectedStatus, roleFilter, trimmed, copy.roleLabels]);

  /** Each chip knows how to undo the filter it stands for. */
  const chipActions = useMemo(() => {
    const actions = new Map<string, () => void>();
    if (statusFilter !== allStatuses) {
      actions.set(`${copy.statusChipPrefix}${statusFilter}`, () => setStatusFilter(allStatuses));
    }
    if (roleFilter) {
      actions.set(`${copy.roleChipPrefix}${copy.roleLabels[roleFilter]}`, () =>
        setRoleFilter(null),
      );
    }
    if (trimmed) {
      actions.set(`${copy.searchChipPrefix}“${trimmed}”`, () => setQuery(''));
    }
    return actions;
  }, [
    statusFilter,
    allStatuses,
    roleFilter,
    trimmed,
    copy.statusChipPrefix,
    copy.roleChipPrefix,
    copy.roleLabels,
    copy.searchChipPrefix,
  ]);

  const metrics = useMemo(() => countMetrics(people), [people]);
  const roleCounts = useMemo(() => countByRole(people), [people]);
  const departments = useMemo(() => countByDepartment(people), [people]);

  const columns = useMemo<TableColumn[]>(
    () =>
      copy.columns.map((label, index) => ({
        className: COLUMN_CLASSES[index] ?? 'tc',
        header: label,
        label,
      })),
    [copy.columns],
  );

  const rows = filtered.map((person) => {
    const isYou = person.email === identity.email;
    return {
      key: person.id,
      cells: [
        {
          content: (
            <span className="row" style={{ gap: 'var(--s8)' }}>
              <span className={cx('avatar avatar-sm', !person.portalAccess && 'is-muted')}>
                {person.name.charAt(0)}
              </span>
              <span className="grow">
                {person.name}
                {isYou && <span className="chip-sm you-chip">{copy.youLabel}</span>}
                <span className="tnote">{person.email}</span>
              </span>
            </span>
          ),
        },
        { content: copy.roleLabels[person.role] },
        { content: person.department },
        {
          content: (
            <span className="row" style={{ gap: '6px', flexWrap: 'wrap' }}>
              {person.portalAccess && <ClaimBadge claim="portal" label={copy.portalClaimLabel} />}
              {person.admin && <ClaimBadge claim="admin" label={copy.adminClaimLabel} />}
              {!person.portalAccess && <ClaimBadge claim="none" label={copy.noClaimLabel} />}
            </span>
          ),
        },
        {
          content: person.lastActive || copy.neverLabel,
          className: person.lastActive ? 'tnum' : 'tnum muted',
        },
        {
          content: <AccountBadge status={person.status} label={copy.statusLabels[person.status]} />,
        },
      ],
    };
  });

  const plural = (count: number) => (count === 1 ? copy.peopleUnitOne : copy.peopleUnit);
  // The notice is chosen by the session's real claim, not by an assumed role.
  const notice = identity.claims?.admin ? copy.noticeAdmin : copy.noticeMember;

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

      <NotificationRow severity={notice.severity} icon={notice.icon} title={notice.title} />

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

      {/* The directory is the primary content and gets the full column. */}
      <div className="stack" style={{ gap: 'var(--s8)' }}>
        <div>
          <h2 className="sec-title">{copy.directoryTitle}</h2>
          <p className="sec-sub">{copy.directorySubtitle}</p>
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
              {filtered.length} {copy.resultsOf} {people.length} {plural(people.length)}
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
        <div className="admin-table">
          <Table columns={columns} rows={rows} rowStaggerMs={35} />
        </div>
      )}

      {/* Paired so the two columns land at roughly the same height. */}
      <div className="d-cols">
        <div className="stack">
          <YourAccess copy={copy} identity={identity} />
          <AccessChanges copy={copy} />
        </div>
        <div className="stack">
          <Roles
            copy={copy}
            counts={roleCounts}
            selected={roleFilter}
            onSelect={(role) => setRoleFilter((current) => (current === role ? null : role))}
          />
          <Departments copy={copy} rows={departments} />
        </div>
      </div>
    </>
  );
}
