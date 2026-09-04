import { useEffect, useRef } from 'react';

/** setInterval with a callback ref, so the timer is never re-created. */
export function useInterval(callback: () => void, delayMs: number | null): void {
  const latest = useRef(callback);
  latest.current = callback;

  useEffect(() => {
    if (delayMs === null) return;
    const id = window.setInterval(() => latest.current(), delayMs);
    return () => window.clearInterval(id);
  }, [delayMs]);
}
