import { useEffect } from 'react';

let lockCount = 0;

/**
 * Freezes background scrolling while a drawer, overlay or the mobile nav is
 * open. Reference-counted so overlapping overlays cannot unlock each other.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      lockCount -= 1;
      if (lockCount === 0) document.body.style.overflow = '';
    };
  }, [active]);
}
