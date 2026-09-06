import { cx } from '@/lib/cx';
import { Icon } from './Icon';

export interface SearchFieldProps {
  readonly placeholder: string;
  readonly ariaLabel: string;
  readonly grow?: boolean;
  /**
   * Supply both to drive the field from the parent. Left out, the input keeps
   * its own value and nothing observes it -- which is what the screens
   * transcribed from the prototype want.
   */
  readonly value?: string;
  readonly onChange?: (value: string) => void;
}

/** Inline search input with a leading magnifier, used inside page toolbars. */
export function SearchField({
  placeholder,
  ariaLabel,
  grow = true,
  value,
  onChange,
}: SearchFieldProps) {
  return (
    <label className={cx('input-field', grow && 'grow')}>
      <Icon name="magnifying-glass" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
      />
    </label>
  );
}
