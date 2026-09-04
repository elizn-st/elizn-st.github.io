import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import { CYCLE_FILTER_OPTIONS, FILTER_GROUPS } from '@/data/filters';
import { useOverlays } from '@/state/OverlayContext';
import { useToast } from '@/state/ToastContext';
import { Icon } from '@/components/common/Icon';
import { Segmented } from '@/components/common/Segmented';
import { Slider } from '@/components/common/Slider';

const MARGIN = 16;
const PANEL_WIDTH = 340;
const ANCHOR_GAP = 8;

interface Placement {
  readonly style: CSSProperties;
  /** True when the panel opens upwards because there is more room above. */
  readonly flipped: boolean;
}

/** Mirrors the original measure-then-place pass, including the upward flip. */
const place = (anchor: DOMRect, measuredHeight: number): Placement => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const height = Math.min(measuredHeight, viewportHeight - MARGIN * 2);
  const below = viewportHeight - anchor.bottom - MARGIN;
  const above = anchor.top - MARGIN;
  const flipped = below < height && above > below;
  const available = flipped ? above : below;

  return {
    flipped,
    style: {
      maxHeight: `${Math.min(height, available)}px`,
      left: `${Math.max(MARGIN, Math.min(anchor.right - PANEL_WIDTH, viewportWidth - PANEL_WIDTH - MARGIN))}px`,
      top: flipped ? undefined : `${anchor.bottom + ANCHOR_GAP}px`,
      bottom: flipped ? `${viewportHeight - anchor.top + ANCHOR_GAP}px` : undefined,
    },
  };
};

const checkboxId = (group: string, option: string) => `fp-${group}-${option}`;

export function FilterPopover() {
  const { filterAnchor, closeFilters } = useOverlays();
  const toast = useToast();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [checked, setChecked] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        FILTER_GROUPS.flatMap((group) =>
          group.options
            .filter((option) => option.checked)
            .map((option) => checkboxId(group.label, option.label)),
        ),
      ),
  );

  useLayoutEffect(() => {
    if (!filterAnchor) {
      setPlacement(null);
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;

    // Measure with the inline max-height dropped, so the stylesheet's own
    // clamp (min(560px, 80vh)) is what the panel is sized against.
    const previous = panel.style.maxHeight;
    panel.style.maxHeight = '';
    const measuredHeight = panel.scrollHeight;
    panel.style.maxHeight = previous;

    setPlacement(place(filterAnchor, measuredHeight));
  }, [filterAnchor]);

  const open = Boolean(filterAnchor && placement);

  const toggle = (id: string) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className={cx('pop-scrim', open && 'is-on')} onClick={closeFilters} aria-hidden="true" />
      <div
        ref={panelRef}
        className={cx('filter-pop', open && 'is-open', placement?.flipped && 'is-flipped')}
        style={placement?.style}
      >
        <div className="fp-head">
          <span className="fp-title">Filters</span>
          <button type="button" className="icon-sq sm" aria-label="Close" onClick={closeFilters}>
            <Icon name="x" />
          </button>
        </div>

        <div className="fp-body">
          {FILTER_GROUPS.map((group) => (
            <div key={group.label} className="fp-group">
              <div className="fp-label">{group.label}</div>
              {group.options.map((option) => {
                const id = checkboxId(group.label, option.label);
                return (
                  <label key={option.label} className="fp-row">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={checked.has(id)}
                      onChange={() => toggle(id)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          ))}

          <div className="fp-group">
            <div className="fp-label">Deviation from recommendation</div>
            <div className="fp-range">
              <Slider
                name="Minimum Δ%"
                min={-20}
                max={20}
                step={0.5}
                defaultValue={-8}
                ariaLabel="Minimum deviation"
              />
            </div>
          </div>

          <div className="fp-group">
            <div className="fp-label">Cycle</div>
            <Segmented
              options={CYCLE_FILTER_OPTIONS}
              defaultValue="Current"
              style={{ width: '100%' }}
              stretch
            />
          </div>
        </div>

        <div className="fp-foot">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setChecked(new Set());
              toast('Filters reset');
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary grow"
            onClick={() => {
              closeFilters();
              toast('Filters applied');
            }}
          >
            Apply filters
          </button>
        </div>
      </div>
    </>
  );
}
