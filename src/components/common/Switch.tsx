import { useState } from 'react';

/** Track-and-knob toggle used by the notification preferences list. */
export function Switch({
  defaultChecked,
  label,
}: {
  readonly defaultChecked: boolean;
  readonly label?: string;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <span className="switch">
      <input
        type="checkbox"
        checked={checked}
        aria-label={label}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <span className="switch-track" />
    </span>
  );
}
