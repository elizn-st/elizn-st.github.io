import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { useRouter } from '@/routing/RouterContext';
import { toHash, type RouteId } from '@/routing/routeIds';

export interface GoButtonProps {
  readonly to: RouteId;
  readonly className?: string;
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly ariaLabel?: string;
  /** Adds the momentary `pressed` class the plan cards use. */
  readonly press?: boolean;
  readonly onNavigate?: () => void;
}

const PRESS_MS = 80;

/** Any control whose only job is to move the app to another route. */
export function GoButton({
  to,
  className,
  children,
  disabled,
  ariaLabel,
  press = false,
  onNavigate,
}: GoButtonProps) {
  const { navigate } = useRouter();
  const [pressed, setPressed] = useState(false);

  const onClick = useCallback(() => {
    if (press) {
      setPressed(true);
      window.setTimeout(() => setPressed(false), PRESS_MS);
    }
    onNavigate?.();
    navigate(to);
  }, [press, navigate, to, onNavigate]);

  return (
    <button
      type="button"
      className={cx(className, pressed && 'pressed')}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** Anchor variant, for the SKU links inside the review queue. */
export function GoLink({
  to,
  param,
  className,
  children,
}: {
  readonly to: RouteId;
  readonly param?: string;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const { navigate } = useRouter();
  return (
    <a
      href={toHash(to, param)}
      className={className}
      onClick={(event) => {
        // Let the router record the step instead of the browser, so the entry
        // carries a depth and the back arrow can tell in-app from arrived-here.
        event.preventDefault();
        navigate(to, param);
      }}
    >
      {children}
    </a>
  );
}
