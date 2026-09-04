import { Icon } from './Icon';

export type PageToken = number | 'dots';

export interface PaginationProps {
  readonly pages: readonly PageToken[];
  readonly active: number;
}

/** Presentational pager — page selection is out of scope for this prototype. */
export function Pagination({ pages, active }: PaginationProps) {
  return (
    <nav className="pagination">
      <button type="button" className="pg">
        <Icon name="caret-left" /> Previous
      </button>
      {pages.map((page, index) =>
        page === 'dots' ? (
          <span key={`dots-${index}`} className="pg dots">
            ...
          </span>
        ) : (
          <button key={page} type="button" className={page === active ? 'pg is-active' : 'pg'}>
            {page}
          </button>
        ),
      )}
      <button type="button" className="pg">
        Next <Icon name="caret-right" />
      </button>
    </nav>
  );
}
