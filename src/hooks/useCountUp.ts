import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const DURATION_MS = 850;

/**
 * Eases a KPI value to its final figure. The formatted string is parsed so
 * prefixes and suffixes (`+`, `%`, `AED`, `pp`) survive untouched, and the
 * animation is skipped entirely under reduced motion.
 *
 * First paint counts up from zero. A later change -- which is what the
 * dashboards' range control now causes -- eases from the figure already on
 * screen instead, so re-filtering does not slam every card back to 0 and count
 * it up again.
 */
export function useCountUp(value: string, delayMs: number): string {
  const [text, setText] = useState(value);
  /** The figure currently rendered, tracked so a change can ease out of it. */
  const shown = useRef<number | null>(null);

  useEffect(() => {
    const match = value.match(/-?[\d.,]+/);
    if (!match || prefersReducedMotion) {
      shown.current = match ? Number.parseFloat(match[0].replace(/,/g, '')) : null;
      setText(value);
      return;
    }

    const matched = match[0];
    const index = match.index ?? 0;
    const target = Number.parseFloat(matched.replace(/,/g, ''));
    const prefix = value.slice(0, index);
    const suffix = value.slice(index + matched.length);
    const decimals = (matched.split('.')[1] ?? '').length;
    const from = shown.current ?? 0;

    // Recorded before the animation rather than after it: if the frames never
    // run -- a hidden tab pauses requestAnimationFrame entirely -- the card is
    // already showing `value`, and that is what the next change must ease out
    // of. Each frame overwrites this with what it actually painted.
    shown.current = target;

    // Nothing to animate, and animating anyway would flicker the card.
    if (from === target) {
      setText(value);
      return;
    }

    let frame = 0;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        const eased = from + (target - from) * (1 - Math.pow(1 - progress, 3));
        // Kept per frame, so an interrupted animation still leaves an honest
        // starting point for the next one.
        shown.current = eased;
        setText(
          prefix +
            eased.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }) +
            suffix,
        );
        if (progress < 1) frame = requestAnimationFrame(step);
        else {
          shown.current = target;
          setText(value);
        }
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
