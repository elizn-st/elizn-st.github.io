import { useState } from 'react';
import type { CSSProperties } from 'react';

export interface SegmentedProps {
  readonly options: readonly string[];
  readonly defaultValue: string;
  readonly style?: CSSProperties;
  /** Applies `flex:1` to each button, as the filter popover does. */
  readonly stretch?: boolean;
  /**
   * Supply both to drive the control from the parent. Left out, it tracks its
   * own selection and nothing observes it.
   */
  readonly value?: string;
  readonly onChange?: (value: string) => void;
}

/** Self-contained segmented control (`[data-seg]` in the original). */
export function Segmented({
  options,
  defaultValue,
  style,
  stretch = false,
  value,
  onChange,
}: SegmentedProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;

  const select = (option: string) => {
    if (onChange) onChange(option);
    else setInternal(option);
  };

  return (
    <div className="segmented" style={style}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={option === active ? 'is-active' : undefined}
          style={stretch ? { flex: 1 } : undefined}
          onClick={() => select(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
