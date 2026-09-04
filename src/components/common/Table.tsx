import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/lib/cx';

export interface TableColumn {
  readonly className?: string;
  readonly header?: ReactNode;
  /**
   * Column name mirrored into `data-label` on every body cell — the stacked
   * mobile layout prints it as the cell's inline caption.
   */
  readonly label?: string;
}

export interface TableCell {
  readonly content: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export interface TableRow {
  readonly key: string;
  readonly cells: readonly TableCell[];
}

export interface TableProps {
  readonly columns: readonly TableColumn[];
  readonly rows: readonly TableRow[];
  /** `tbl compact` — used by tables embedded in chat answers. */
  readonly compact?: boolean;
  readonly rowStaggerMs?: number;
  readonly baseDelayMs?: number;
}

/**
 * The portal's flex-based table. Column definitions carry the shared cell
 * class, so a row only supplies content plus any per-cell override.
 */
export function Table({
  columns,
  rows,
  compact = false,
  rowStaggerMs = 45,
  baseDelayMs = 0,
}: TableProps) {
  return (
    <div className={cx('tbl', compact && 'compact')}>
      <div className="tbl-scroll">
        <div className="trow head">
          {columns.map((column, index) => (
            <span key={index} className={column.className}>
              {column.header}
            </span>
          ))}
        </div>
        {rows.map((row, rowIndex) => (
          <div
            key={row.key}
            className="trow body"
            style={{ animationDelay: `${baseDelayMs + rowIndex * rowStaggerMs}ms` }}
          >
            {row.cells.map((cell, cellIndex) => {
              const column = columns[cellIndex];
              return (
                <span
                  key={cellIndex}
                  className={cx(column?.className, cell.className)}
                  data-label={column?.label || undefined}
                  style={cell.style}
                >
                  {cell.content}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Builds columns that all share one class, e.g. four plain `tc` columns. */
export const uniformColumns = (labels: readonly string[], className = 'tc'): TableColumn[] =>
  labels.map((label) => ({ className, header: label, label }));
