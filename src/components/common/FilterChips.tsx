import { useState } from 'react';
import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { Icon } from './Icon';

const REMOVE_MS = 200;

interface ChipState {
  readonly label: string;
  readonly removing: boolean;
}

/** Applied-filter chips; dismissing one plays the `chipOut` animation first. */
export function FilterChips({ labels }: { readonly labels: readonly string[] }) {
  const { chrome } = usePortalData();
  const [chips, setChips] = useState<readonly ChipState[]>(() =>
    labels.map((label) => ({ label, removing: false })),
  );

  const remove = (label: string) => {
    setChips((current) =>
      current.map((chip) => (chip.label === label ? { ...chip, removing: true } : chip)),
    );
    window.setTimeout(() => {
      setChips((current) => current.filter((chip) => chip.label !== label));
    }, REMOVE_MS);
  };

  return (
    <div className="applied">
      {chips.map((chip) => (
        <span key={chip.label} className={cx('chip is-active', chip.removing && 'removing')}>
          {chip.label}{' '}
          <button
            type="button"
            aria-label={chrome.copy.removeLabel}
            onClick={() => remove(chip.label)}
          >
            <Icon name="x" />
          </button>
        </span>
      ))}
    </div>
  );
}
