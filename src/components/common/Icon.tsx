import { cx } from '@/lib/cx';

export interface IconProps {
  /** Phosphor icon name without the `ph-` prefix, e.g. `caret-right`. */
  readonly name: string;
  /** Renders the filled variant. */
  readonly fill?: boolean;
  readonly title?: string;
}

/** Thin wrapper over the Phosphor webfont markup used throughout the portal. */
export function Icon({ name, fill = false, title }: IconProps) {
  return <i className={cx(fill ? 'ph-fill' : 'ph', `ph-${name}`)} title={title} />;
}
