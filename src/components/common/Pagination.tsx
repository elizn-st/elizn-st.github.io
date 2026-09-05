import { usePortalData } from '@/state/DataContext';
import { Icon } from './Icon';
import type { PageToken } from '@/data/ui';

export type { PageToken };

export interface PaginationProps {
  readonly pages: readonly PageToken[];
  readonly active: number;
}

/** Presentational pager — page selection is out of scope for this prototype. */
export function Pagination({ pages, active }: PaginationProps) {
  const { chrome } = usePortalData();
  return (
    <nav className="pagination">
      <button type="button" className="pg">
        <Icon name="caret-left" /> {chrome.copy.previousLabel}
      </button>
      {pages.map((page, index) =>
        page === 'dots' ? (
          <span key={`dots-${index}`} className="pg dots">
            {chrome.copy.ellipsis}
          </span>
        ) : (
          <button key={page} type="button" className={page === active ? 'pg is-active' : 'pg'}>
            {page}
          </button>
        ),
      )}
      <button type="button" className="pg">
        {chrome.copy.nextLabel} <Icon name="caret-right" />
      </button>
    </nav>
  );
}
