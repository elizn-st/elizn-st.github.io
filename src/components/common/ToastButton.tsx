import type { ReactNode } from 'react';
import { useToast } from '@/state/ToastContext';

export interface ToastButtonProps {
  /** Message raised when the control is used. */
  readonly message: string;
  readonly className?: string;
  readonly children: ReactNode;
  readonly type?: 'button' | 'submit';
  readonly ariaLabel?: string;
  readonly title?: string;
}

/**
 * Prototype affordance: buttons that acknowledge an action with a toast rather
 * than mutating data.
 */
export function ToastButton({
  message,
  className,
  children,
  type = 'button',
  ariaLabel,
  title,
}: ToastButtonProps) {
  const toast = useToast();
  return (
    <button
      type={type}
      className={className}
      aria-label={ariaLabel}
      title={title}
      onClick={() => toast(message)}
    >
      {children}
    </button>
  );
}
