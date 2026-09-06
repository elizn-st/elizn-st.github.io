import { useState } from 'react';

export interface SwitchProps {
  readonly defaultChecked: boolean;
  readonly label?: string;
  /**
   * Supply both to drive the toggle from the parent -- the reports screen does,
   * because its position comes from Firestore rather than from local state.
   * Left out, the switch tracks its own value and nothing observes it.
   */
  readonly checked?: boolean;
  readonly onChange?: (checked: boolean) => void;
}

/** Track-and-knob toggle used by the notification preferences list. */
export function Switch({ defaultChecked, label, checked, onChange }: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const value = checked ?? internal;

  return (
    <span className="switch">
      <input
        type="checkbox"
        checked={value}
        aria-label={label}
        onChange={(event) => {
          if (onChange) onChange(event.target.checked);
          else setInternal(event.target.checked);
        }}
      />
      <span className="switch-track" />
    </span>
  );
}
