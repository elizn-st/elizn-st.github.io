import { useCallback, useMemo, useState } from 'react';
import { QUEUE_ROWS } from '@/data/queue';
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
import type { ScreenMeta } from '@/routing/screens';

export const queueMeta: ScreenMeta = {
  section: 'Recommendations',
  page: 'Recommendations review queue',
  width: 892,
};

const APPLIED_FILTERS = ['Category: Electronics', 'Status: Pending', 'Delta: Negative'];

export function QueueScreen() {
  const toast = useToast();
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set<string>());

  const allSelected = selected.size === QUEUE_ROWS.length;

  const toggleRow = useCallback((sku: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    setSelected(checked ? new Set(QUEUE_ROWS.map((row) => row.sku)) : new Set<string>());
  }, []);

  const bulk = useCallback(
    (action: 'approve' | 'reject') => {
      const count = selected.size;
      if (!count) {
        toast('Select at least one row first');
        return;
      }
      const verb = action === 'approve' ? 'approved' : 'rejected';
      toast(`${count} recommendation${count > 1 ? 's' : ''} ${verb}`);
    },
    [selected, toast],
  );

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        className: 'tc-check',
        header: (
          <input
            type="checkbox"
            className="checkbox"
            aria-label="Select all"
            checked={allSelected}
            onChange={(event) => toggleAll(event.target.checked)}
          />
        ),
      },
      { className: 'tc', header: 'SKU', label: 'SKU' },
      { className: 'tc-85', header: 'Current', label: 'Current' },
      { className: 'tc-110', header: 'Recommended', label: 'Recommended' },
      { className: 'tc-50', header: 'Δ%', label: 'Δ%' },
      { className: 'tc-215', header: 'Top factor', label: 'Top factor' },
      { className: 'tc-60', header: 'Status', label: 'Status' },
    ],
    [allSelected, toggleAll],
  );

  const rows = QUEUE_ROWS.map((row) => ({
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
          <h1 className="page-title">Recommendations</h1>
          <span className="chip-sm">Cycle Aug 05–11</span>
        </div>
        <ToastButton className="btn" message="Export started">
          <Icon name="export" /> Export
        </ToastButton>
        <button type="button" className="btn btn-approve" onClick={() => bulk('approve')}>
          Approve selected
        </button>
        <button type="button" className="btn btn-danger" onClick={() => bulk('reject')}>
          Reject selected
        </button>
      </div>

      <div className="q-filters">
        <div className="q-search-row">
          <SearchField placeholder="Search by SKU, brand or factor" ariaLabel="Search" />
          <FilterButton />
        </div>
        <div className="filters-results">
          <FilterChips labels={APPLIED_FILTERS} />
          <span className="vdiv" />
          <span className="results-count tnum">6 of 128 results</span>
        </div>
      </div>

      <Table columns={columns} rows={rows} />

      <Pagination pages={[1, 2, 3, 4, 5, 'dots', 17]} active={3} />
    </>
  );
}
