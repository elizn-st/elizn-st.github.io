import { CATEGORY_FONT_SIZE, type CategoryLabelLayout } from './geometry';

export interface CategoryLabelProps {
  readonly layout: CategoryLabelLayout;
  /** Index of the label within the layout. */
  readonly index: number;
  readonly x: number;
  /** Baseline of the first line. */
  readonly y: number;
}

/** A bar's category caption, on one or two lines depending on the fit. */
export function CategoryLabel({ layout, index, x, y }: CategoryLabelProps) {
  const lines = layout.lines[index] ?? [];
  return (
    <text
      className="cat-label"
      x={x}
      y={y}
      textAnchor="middle"
      // Inline, not a presentation attribute: `.cat-label` sets font-size in
      // CSS, which would win over an attribute.
      style={layout.fontSize === CATEGORY_FONT_SIZE ? undefined : { fontSize: layout.fontSize }}
    >
      {lines.length > 1
        ? lines.map((line, lineIndex) => (
            <tspan key={line + lineIndex} x={x} dy={lineIndex === 0 ? 0 : layout.fontSize + 1}>
              {line}
            </tspan>
          ))
        : lines[0]}
    </text>
  );
}
