import { useState } from 'react';
import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { Icon } from './Icon';

const REMOVE_MS = 200;

export interface FilterChipsProps {
  readonly labels: readonly string[];
  /**
   * Supply it to own the list: the chip plays its exit animation and then the
   * parent is told, so it can drop the filter the chip stands for. Left out,
   * the chip simply removes itself and nothing else changes.
   */
  readonly onRemove?: (label: string) => void;
}

/** Applied-filter chips; dismissing one plays the `chipOut` animation first. */
export function FilterChips({ labels, onRemove }: FilterChipsProps) {
  const { chrome } = usePortalData();
  const [removing, setRemoving] = useState<ReadonlySet<string>>(() => new Set<string>());
  /** Only used when the parent does not own the list. */
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set<string>());

  const without = (set: ReadonlySet<string>, label: string) => {
    const next = new Set(set);
    next.delete(label);
    return next;
  };

  const remove = (label: string) => {
    setRemoving((current) => new Set(current).add(label));
    window.setTimeout(() => {
      setRemoving((current) => without(current, label));
      if (onRemove) onRemove(label);
      else setDismissed((current) => new Set(current).add(label));
    }, REMOVE_MS);
  };

  return (
    <div className="applied">
      {labels
        .filter((label) => !dismissed.has(label))
        .map((label) => (
          <span key={label} className={cx('chip is-active', removing.has(label) && 'removing')}>
            {label}{' '}
            <button
              type="button"
              aria-label={chrome.copy.removeLabel}
              onClick={() => remove(label)}
            >
              <Icon name="x" />
            </button>
          </span>
        ))}
    </div>
  );
}
