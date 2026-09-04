import { useOverlays } from '@/state/OverlayContext';
import { Icon } from './Icon';

/** Opens the filter popover, anchored to itself. */
export function FilterButton() {
  const { openFilters } = useOverlays();
  return (
    <button
      type="button"
      className="icon-sq"
      aria-label="More filters"
      onClick={(event) => openFilters(event.currentTarget.getBoundingClientRect())}
    >
      <Icon name="funnel" />
    </button>
  );
}
