import { cx } from '@/lib/cx';
import { Icon } from './Icon';

export interface SearchFieldProps {
  readonly placeholder: string;
  readonly ariaLabel: string;
  readonly grow?: boolean;
}

/** Inline search input with a leading magnifier, used inside page toolbars. */
export function SearchField({ placeholder, ariaLabel, grow = true }: SearchFieldProps) {
  return (
    <label className={cx('input-field', grow && 'grow')}>
      <Icon name="magnifying-glass" />
      <input type="search" placeholder={placeholder} aria-label={ariaLabel} />
    </label>
  );
}
