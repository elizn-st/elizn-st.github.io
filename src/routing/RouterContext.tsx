import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_ROUTE, parseHash, sameLocation, toHash, type RouteId } from './routeIds';

interface RouterValue {
  /** Raw route slug from the hash — may not resolve to a screen. */
  readonly route: string;
  /** Second hash segment, for screens that render one of several records. */
  readonly param: string | null;
  readonly navigate: (route: RouteId, param?: string) => void;
  readonly back: () => void;
}

const RouterContext = createContext<RouterValue | null>(null);

/**
 * How many in-app steps deep this history entry is, stored on the entry itself.
 *
 * A trail kept on the side drifts, because the browser's own back button moves
 * the hash without telling us it went backwards: the trail then describes a
 * position the user has already left, and the back arrow spends a press
 * returning to where it already is. An entry cannot lie about its own depth —
 * the browser hands back the value that was current when it was pushed.
 */
const DEPTH_KEY = 'portalDepth';

const depthOf = (state: unknown): number => {
  const depth = (state as Record<string, unknown> | null)?.[DEPTH_KEY];
  return typeof depth === 'number' ? depth : 0;
};

export function RouterProvider({ children }: { children: ReactNode }) {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    // `popstate` covers the browser's back and forward buttons; `hashchange`
    // covers anything that writes the hash directly. Stepping between two of
    // our own entries fires both, which is harmless: the second call stores an
    // identical string and React skips the re-render.
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const navigate = useCallback((route: RouteId, param?: string) => {
    const next = toHash(route, param);
    // Re-selecting the screen already on display would leave a history entry
    // that goes nowhere, costing the back arrow a press for no movement.
    if (sameLocation(parseHash(window.location.hash), parseHash(next))) return;
    window.history.pushState({ [DEPTH_KEY]: depthOf(window.history.state) + 1 }, '', next);
    // pushState fires no event, so the app has to be told about its own moves.
    setHash(next);
  }, []);

  const back = useCallback(() => {
    if (depthOf(window.history.state) > 0) {
      // A real history step, so the forward button keeps working afterwards.
      window.history.back();
      return;
    }
    // Opened straight onto this screen: stepping back would leave the portal.
    navigate(DEFAULT_ROUTE);
  }, [navigate]);

  const { route, param } = useMemo(() => parseHash(hash), [hash]);

  const value = useMemo<RouterValue>(
    () => ({ route, param, navigate, back }),
    [route, param, navigate, back],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>');
  return value;
}
