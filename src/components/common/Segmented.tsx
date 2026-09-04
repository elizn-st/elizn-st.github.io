import { useState } from 'react';
import type { CSSProperties } from 'react';

export interface SegmentedProps {
  readonly options: readonly string[];
  readonly defaultValue: string;
  readonly style?: CSSProperties;
  /** Applies `flex:1` to each button, as the filter popover does. */
  readonly stretch?: boolean;
}

/** Self-contained segmented control (`[data-seg]` in the original). */
export function Segmented({ options, defaultValue, style, stretch = false }: SegmentedProps) {
  const [active, setActive] = useState(defaultValue);

  return (
    <div className="segmented" style={style}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={option === active ? 'is-active' : undefined}
          style={stretch ? { flex: 1 } : undefined}
          onClick={() => setActive(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
