import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Observed inline size of an element, rounded down to a multiple of `step`.
 *
 * The quantisation matters: callers feed this width back into content that
 * changes the element's height, and an exact measurement could otherwise
 * oscillate whenever a page scrollbar appears and disappears.
 */
export function useElementWidth(ref: RefObject<Element | null>, step = 8): number | null {
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const raw = element.getBoundingClientRect().width;
      if (!raw) return;
      const quantised = Math.floor(raw / step) * step;
      setWidth((current) => (current === quantised ? current : quantised));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, step]);

  return width;
}
