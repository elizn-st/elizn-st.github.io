import { useOverlays } from '@/state/OverlayContext';
import { usePortalData } from '@/state/DataContext';
import { Icon } from './Icon';

/** Opens the filter popover, anchored to itself. */
export function FilterButton() {
  const { openFilters } = useOverlays();
  const { chrome } = usePortalData();
  return (
    <button
      type="button"
      className="icon-sq"
      aria-label={chrome.copy.moreFiltersLabel}
      onClick={(event) => openFilters(event.currentTarget.getBoundingClientRect())}
    >
      <Icon name="funnel" />
    </button>
  );
}
