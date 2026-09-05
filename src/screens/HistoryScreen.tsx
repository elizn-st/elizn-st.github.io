import { useMemo } from 'react';
import { Icon } from '@/components/common/Icon';
import { usePortalData } from '@/state/DataContext';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCards } from '@/components/common/KpiCard';
import { StatusBadge } from '@/components/common/Badge';
import { FilterChips } from '@/components/common/FilterChips';
import { FilterButton } from '@/components/common/FilterButton';
import { SearchField } from '@/components/common/SearchField';
import { Segmented } from '@/components/common/Segmented';
import { Pagination } from '@/components/common/Pagination';
import { Table, type TableColumn } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const historyMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'history'),
  width: 1060,
});

/** Column widths are layout; the trailing actions column carries no header. */
const COLUMN_CLASSES = ['tc-110', 'tc', 'tc-85', 'tc-85', 'tc-215', 'tc-110', 'tc-110'];

const ACTION_CELL_STYLE = { gap: '8px', justifyContent: 'flex-end' } as const;

export function HistoryScreen() {
  const { decisions, history } = usePortalData();
  const copy = history.copy;

  const columns = useMemo<TableColumn[]>(
    () => [
      ...copy.columns.map((label, index) => ({
        className: COLUMN_CLASSES[index] ?? 'tc',
        header: label,
        label,
      })),
      { className: 'tc-60' },
    ],
    [copy.columns],
  );

  const rows = decisions.map((entry) => ({
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
              <span className="muted" title={copy.commentTitle}>
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
          <h1 className="page-title">{copy.title}</h1>
          <span className="chip-sm">{copy.chip}</span>
        </div>
        <ToastButton className="btn" message={copy.exportMessage}>
          <Icon name="export" /> {copy.exportLabel}
        </ToastButton>
      </div>

      <div className="kpi-row">
        <KpiCards kpis={history.kpis} />
      </div>

      <div className="q-filters">
        <div className="q-search-row">
          <SearchField placeholder={copy.searchPlaceholder} ariaLabel={copy.searchAriaLabel} />
          <Segmented options={copy.statusFilters} defaultValue={copy.defaultStatusFilter} />
          <FilterButton />
        </div>
        <div className="filters-results">
          <FilterChips labels={copy.appliedFilters} />
          <span className="vdiv" />
          <span className="results-count tnum">{copy.resultsCount}</span>
        </div>
      </div>

      <Table columns={columns} rows={rows} rowStaggerMs={40} />

      <Pagination pages={copy.pagination.pages} active={copy.pagination.active} />
    </>
  );
}
