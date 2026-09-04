import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/** The filter popover positions itself against the button that opened it. */
export type FilterAnchor = DOMRect | null;

interface OverlayValue {
  readonly notificationsOpen: boolean;
  readonly openNotifications: () => void;
  readonly closeNotifications: () => void;

  readonly searchOpen: boolean;
  readonly openSearch: () => void;
  readonly closeSearch: () => void;

  readonly filterAnchor: FilterAnchor;
  readonly openFilters: (anchor: DOMRect) => void;
  readonly closeFilters: () => void;

  /** Escape closes whatever is open, exactly like the original handler. */
  readonly closeAll: () => void;
}

const OverlayContext = createContext<OverlayValue | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<FilterAnchor>(null);

  const openNotifications = useCallback(() => setNotificationsOpen(true), []);
  const closeNotifications = useCallback(() => setNotificationsOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openFilters = useCallback((anchor: DOMRect) => setFilterAnchor(anchor), []);
  const closeFilters = useCallback(() => setFilterAnchor(null), []);

  const closeAll = useCallback(() => {
    setNotificationsOpen(false);
    setSearchOpen(false);
    setFilterAnchor(null);
  }, []);

  const value = useMemo<OverlayValue>(
    () => ({
      notificationsOpen,
      openNotifications,
      closeNotifications,
      searchOpen,
      openSearch,
      closeSearch,
      filterAnchor,
      openFilters,
      closeFilters,
      closeAll,
    }),
    [
      notificationsOpen,
      openNotifications,
      closeNotifications,
      searchOpen,
      openSearch,
      closeSearch,
      filterAnchor,
      openFilters,
      closeFilters,
      closeAll,
    ],
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlays(): OverlayValue {
  const value = useContext(OverlayContext);
  if (!value) throw new Error('useOverlays must be used inside <OverlayProvider>');
  return value;
}
