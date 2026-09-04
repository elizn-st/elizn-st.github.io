import { useState } from 'react';
import { cx } from '@/lib/cx';
import { signedPct, toneOf } from '@/lib/format';

export interface SliderProps {
  readonly name: string;
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
  readonly step?: number;
  readonly ariaLabel?: string;
}

const FILL_COLORS = { up: 'var(--ok)', down: 'var(--bad)', flat: 'var(--n40)' } as const;

/**
 * Range input drawn from the zero mark outwards, so a negative move fills to
 * the left in red and a positive one to the right in green.
 */
export function Slider({ name, min, max, defaultValue, step = 0.1, ariaLabel }: SliderProps) {
  const [value, setValue] = useState(defaultValue);

  const position = (candidate: number) => ((candidate - min) / (max - min)) * 100;
  const zero = position(0);
  const current = position(value);
  const tone = toneOf(value);

  return (
    <div className="slider-block">
      <div className="slider-head">
        <span className="slider-name">{name}</span>
        <span className={cx('pct', tone, 'tnum')}>{signedPct(value)}</span>
      </div>
      <div className="slider-wrap">
        <div className="slider-track">
          <div className="slider-zero" style={{ left: `${zero}%` }} />
          <div
            className="slider-fill"
            style={{
              left: `${Math.min(zero, current)}%`,
              width: `${Math.abs(current - zero)}%`,
              background: FILL_COLORS[tone],
            }}
          />
        </div>
        <input
          className="slider-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={ariaLabel ?? name}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
    </div>
  );
}
