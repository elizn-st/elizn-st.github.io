import { useEffect, useState } from 'react';

/**
 * Holds a progress bar at its CSS default (`width: 0`) and then releases it to
 * its real width, letting the stylesheet transition do the animating.
 */
export function useDelayedWidth(percent: number, delayMs: number): string | undefined {
  const [width, setWidth] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => setWidth(`${percent}%`), delayMs);
    return () => window.clearTimeout(timer);
  }, [percent, delayMs]);

  return width;
}
