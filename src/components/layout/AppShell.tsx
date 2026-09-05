import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cx } from '@/lib/cx';
import { vars } from '@/lib/style';
import { scrollBehavior } from '@/lib/motion';
import { navHighlightFor } from '@/data/navigation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useRouter } from '@/routing/RouterContext';
import type { RouteId } from '@/routing/routeIds';
import { isScreenId, SCREENS } from '@/routing/screenRegistry';
import { resolveMeta, type ScreenMeta, type ScreenMetaInput } from '@/routing/screens';
import { useChartFocus } from '@/state/ChartFocusContext';
import { useOverlays } from '@/state/OverlayContext';
import { usePortalData } from '@/state/DataContext';
import { NotFoundScreen, notFoundMeta } from '@/screens/NotFoundScreen';
import { NotificationsDrawer } from '@/components/overlays/NotificationsDrawer';
import { FilterPopover } from '@/components/overlays/FilterPopover';
import { SearchOverlay } from '@/components/overlays/SearchOverlay';
import { ToastStack } from '@/components/overlays/ToastStack';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { ChatSidebar } from './ChatSidebar';

const TEXT_ENTRY_TAGS = /input|textarea|select/i;

export function AppShell() {
  const { route } = useRouter();
  const { chartKey } = useChartFocus();
  const { openSearch, closeAll } = useOverlays();
  const { series, navigation, boards, chartDetails } = usePortalData();

  const [collapsed, setCollapsed] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const viewRef = useRef<HTMLElement | null>(null);

  useBodyScrollLock(navOpen);

  const resolved = useMemo(() => {
    const input: ScreenMetaInput = { chartKey, series, navigation, boards, chartDetails };
    if (!isScreenId(route)) {
      return { meta: notFoundMeta(input), screen: <NotFoundScreen key={route} route={route} /> };
    }
    const definition = SCREENS[route];
    const Screen = definition.component;
    const meta: ScreenMeta = resolveMeta(definition, input);
    return { meta, screen: <Screen key={route} /> };
  }, [route, chartKey, series, navigation, boards, chartDetails]);

  const { meta, screen } = resolved;
  const activeNav = isScreenId(route) ? navHighlightFor(route) : (route as RouteId);

  // Each navigation resets the reading position and moves focus to the view.
  useEffect(() => {
    viewRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior });
    setNavOpen(false);
  }, [route]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAll();
        return;
      }
      if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearch();
        return;
      }
      if (event.key === '/' && !TEXT_ENTRY_TAGS.test(document.activeElement?.tagName ?? '')) {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeAll, openSearch]);

  const toggleNav = useCallback(() => setNavOpen((open) => !open), []);
  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);

  return (
    <>
      <div className={cx('app', navOpen && 'nav-open', collapsed && 'is-collapsed')}>
        <Topbar section={meta.section} page={meta.page} navOpen={navOpen} onToggleNav={toggleNav} />
        <div className="body">
          <Sidebar activeNav={activeNav} onCollapseToggle={toggleCollapsed} onNavigate={closeNav} />
          <ChatSidebar hidden={!meta.chatSidebar} />
          <div className="content-area">
            <main
              ref={viewRef}
              className={cx('wrap', meta.bottom && 'is-bottom')}
              style={vars({ '--cmax': `${meta.width}px` })}
              tabIndex={-1}
            >
              {screen}
            </main>
          </div>
        </div>
      </div>

      <div className="nav-scrim" onClick={toggleNav} aria-hidden="true" />
      <FilterPopover />
      <SearchOverlay />
      <NotificationsDrawer />
      <ToastStack />
    </>
  );
}
