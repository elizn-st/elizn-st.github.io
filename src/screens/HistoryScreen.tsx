import { AUDIT_LOG } from '@/data/history';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusBadge } from '@/components/common/Badge';
import { FilterChips } from '@/components/common/FilterChips';
import { FilterButton } from '@/components/common/FilterButton';
import { SearchField } from '@/components/common/SearchField';
import { Segmented } from '@/components/common/Segmented';
import { Pagination } from '@/components/common/Pagination';
import { Table, type TableColumn } from '@/components/common/Table';
import type { ScreenMeta } from '@/routing/screens';

export const historyMeta: ScreenMeta = {
  section: 'Recommendations',
  page: 'Decision history',
  width: 1060,
};

const STATUS_FILTERS = ['All', 'Approved', 'Rejected', 'Overridden'];
const APPLIED_FILTERS = ['Reviewer: Aisha K.', 'Cycle: Aug 05–11'];

const COLUMNS: TableColumn[] = [
  { className: 'tc-110', header: 'Date', label: 'Date' },
  { className: 'tc', header: 'SKU', label: 'SKU' },
  { className: 'tc-85', header: 'From', label: 'From' },
  { className: 'tc-85', header: 'To', label: 'To' },
  { className: 'tc-215', header: 'Reason code', label: 'Reason code' },
  { className: 'tc-110', header: 'Reviewer', label: 'Reviewer' },
  { className: 'tc-110', header: 'Status', label: 'Status' },
  { className: 'tc-60' },
];

const ACTION_CELL_STYLE = { gap: '8px', justifyContent: 'flex-end' } as const;

export function HistoryScreen() {
  const rows = AUDIT_LOG.map((entry) => ({
    key: `${entry.date}-${entry.time}-${entry.sku}`,
    cells: [
      {
        content: (
          <>
            <span className="tnum">{entry.date}</span>
            <span className="tnote tnum">{entry.time}</span>
          </>
        ),
      },
      { content: entry.sku },
      { content: entry.from, className: 'tnum muted' },
      { content: entry.to, className: 'tnum' },
      { content: entry.reason },
      { content: entry.reviewer },
      { content: <StatusBadge status={entry.status} /> },
      {
        className: 'row',
        style: ACTION_CELL_STYLE,
        content: (
          <>
            {entry.hasComment && (
              <span className="muted" title="Has comment">
                <Icon name="chat-circle" />
              </span>
            )}
            <span className="muted">
              <Icon name="caret-right" />
            </span>
          </>
        ),
      },
    ],
  }));

  return (
    <>
      <div className="q-head">
        <div className="q-title">
          <h1 className="page-title">Decision history</h1>
          <span className="chip-sm">Full audit log · cycle Aug 05–11</span>
        </div>
        <ToastButton className="btn" message="Audit log exported">
          <Icon name="export" /> Export log
        </ToastButton>
      </div>

      <div className="kpi-row">
        <KpiCard index={0} label="Decisions logged" value="1,284" delta="+118" direction="up" />
        <KpiCard
          index={1}
          label="Approved"
          value="86.4%"
          delta="+2.1pp"
          direction="up"
          tone="pos"
        />
        <KpiCard index={2} label="Rejected" value="9.2%" delta="-1.4pp" direction="up" tone="neg" />
        <KpiCard index={3} label="Overridden" value="4.4%" delta="-0.7pp" direction="up" />
      </div>

      <div className="q-filters">
        <div className="q-search-row">
          <SearchField
            placeholder="Search by SKU, reason code or reviewer"
            ariaLabel="Search log"
          />
          <Segmented options={STATUS_FILTERS} defaultValue="All" />
          <FilterButton />
        </div>
        <div className="filters-results">
          <FilterChips labels={APPLIED_FILTERS} />
          <span className="vdiv" />
          <span className="results-count tnum">8 of 1,284 entries</span>
        </div>
      </div>

      <Table columns={COLUMNS} rows={rows} rowStaggerMs={40} />

      <Pagination pages={[1, 2, 3, 'dots', 161]} active={1} />
    </>
  );
}
