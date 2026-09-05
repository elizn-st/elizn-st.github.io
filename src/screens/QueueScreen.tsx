import { useCallback, useMemo, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { aed } from '@/lib/format';
import { useToast } from '@/state/ToastContext';
import { Icon } from '@/components/common/Icon';
import { GoLink } from '@/components/common/GoButton';
import { ToastButton } from '@/components/common/ToastButton';
import { StatusBadge } from '@/components/common/Badge';
import { Delta } from '@/components/common/Delta';
import { FilterChips } from '@/components/common/FilterChips';
import { FilterButton } from '@/components/common/FilterButton';
import { SearchField } from '@/components/common/SearchField';
import { Pagination } from '@/components/common/Pagination';
import { Table, type TableColumn } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const queueMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'queue'),
  width: 892,
});

/** Column widths are layout, so they stay here and pair with the fetched labels. */
const COLUMN_CLASSES = ['tc', 'tc-85', 'tc-110', 'tc-50', 'tc-215', 'tc-60'];

export function QueueScreen() {
  const { recommendations, queue } = usePortalData();
  const copy = queue.copy;
  const toast = useToast();
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set<string>());

  const allSelected = selected.size === recommendations.length;

  const toggleRow = useCallback((sku: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelected(checked ? new Set(recommendations.map((row) => row.sku)) : new Set<string>());
    },
    [recommendations],
  );

  const bulk = useCallback(
    (action: 'approve' | 'reject') => {
      const count = selected.size;
      if (!count) {
        toast(copy.emptySelectionMessage);
        return;
      }
      const verb = action === 'approve' ? 'approved' : 'rejected';
      toast(`${count} recommendation${count > 1 ? 's' : ''} ${verb}`);
    },
    [selected, toast, copy.emptySelectionMessage],
  );

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        className: 'tc-check',
        header: (
          <input
            type="checkbox"
            className="checkbox"
            aria-label={copy.selectAllLabel}
            checked={allSelected}
            onChange={(event) => toggleAll(event.target.checked)}
          />
        ),
      },
      ...copy.columns.map((label, index) => ({
        className: COLUMN_CLASSES[index] ?? 'tc',
        header: label,
        label,
      })),
    ],
    [allSelected, toggleAll, copy.columns, copy.selectAllLabel],
  );

  const rows = recommendations.map((row) => ({
    key: row.sku,
    cells: [
      {
        content: (
          <input
            type="checkbox"
            className="checkbox"
            aria-label={`Select ${row.sku}`}
            checked={selected.has(row.sku)}
            onChange={() => toggleRow(row.sku)}
          />
        ),
      },
      {
        content: (
          <>
            <GoLink to="detail">{row.sku}</GoLink>
            {row.note && <span className="tnote">{row.note}</span>}
          </>
        ),
      },
      { content: aed(row.current), className: 'tnum' },
      { content: aed(row.recommended), className: 'tnum' },
      { content: <Delta value={row.delta} /> },
      { content: row.topFactor },
      { content: <StatusBadge status={row.status} /> },
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
        <button type="button" className="btn btn-approve" onClick={() => bulk('approve')}>
          {copy.approveLabel}
        </button>
        <button type="button" className="btn btn-danger" onClick={() => bulk('reject')}>
          {copy.rejectLabel}
        </button>
      </div>

      <div className="q-filters">
        <div className="q-search-row">
          <SearchField placeholder={copy.searchPlaceholder} ariaLabel={copy.searchAriaLabel} />
          <FilterButton />
        </div>
        <div className="filters-results">
          <FilterChips labels={copy.appliedFilters} />
          <span className="vdiv" />
          <span className="results-count tnum">{copy.resultsCount}</span>
        </div>
      </div>

      <Table columns={columns} rows={rows} />

      <Pagination pages={copy.pagination.pages} active={copy.pagination.active} />
    </>
  );
}
