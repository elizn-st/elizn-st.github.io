import { useState } from 'react';
import type { CSSProperties } from 'react';

/** A choice whose label is copy but whose value is a stable id. */
export interface SegmentedItem {
  readonly id: string;
  readonly label: string;
}

export interface SegmentedProps {
  /** Labels that are also their own value. */
  readonly options?: readonly string[];
  /** Takes precedence over `options` when the value differs from the label. */
  readonly items?: readonly SegmentedItem[];
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
  items,
  defaultValue,
  style,
  stretch = false,
  value,
  onChange,
}: SegmentedProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;
  const choices: readonly SegmentedItem[] =
    items ?? (options ?? []).map((option) => ({ id: option, label: option }));

  const select = (option: string) => {
    if (onChange) onChange(option);
    else setInternal(option);
  };

  return (
    <div className="segmented" style={style}>
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className={choice.id === active ? 'is-active' : undefined}
          style={stretch ? { flex: 1 } : undefined}
          onClick={() => select(choice.id)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
