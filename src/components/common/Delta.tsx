import { cx } from '@/lib/cx';
import { signedPct, toneOf } from '@/lib/format';

/** Plain coloured percentage used inside table cells (`num-up` / `num-down`). */
export function Delta({ value }: { readonly value: number }) {
  return <span className={cx(`num-${toneOf(value)}`, 'tnum')}>{signedPct(value)}</span>;
}
