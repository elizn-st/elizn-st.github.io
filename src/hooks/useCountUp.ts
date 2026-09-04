import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const DURATION_MS = 850;

/**
 * Eases a KPI value up from zero to its final figure. The formatted string is
 * parsed so prefixes and suffixes (`+`, `%`, `AED`, `pp`) survive untouched,
 * and the animation is skipped entirely under reduced motion.
 */
export function useCountUp(value: string, delayMs: number): string {
  const [text, setText] = useState(value);

  useEffect(() => {
    const match = value.match(/-?[\d.,]+/);
    if (!match || prefersReducedMotion) {
      setText(value);
      return;
    }

    const matched = match[0];
    const index = match.index ?? 0;
    const target = Number.parseFloat(matched.replace(/,/g, ''));
    const prefix = value.slice(0, index);
    const suffix = value.slice(index + matched.length);
    const decimals = (matched.split('.')[1] ?? '').length;

    let frame = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        const eased = target * (1 - Math.pow(1 - progress, 3));
        setText(
          prefix +
            eased.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }) +
            suffix,
        );
        if (progress < 1) frame = requestAnimationFrame(step);
        else setText(value);
      };
      frame = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, delayMs]);

  return text;
}
