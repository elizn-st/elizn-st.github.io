import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { parseHash, toHash, type RouteId } from './routeIds';

interface RouterValue {
  /** Raw route slug from the hash — may not resolve to a screen. */
  readonly route: string;
  readonly navigate: (route: RouteId) => void;
  readonly back: () => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  /** Explicit trail of in-app navigations, so the back arrow is predictable. */
  const trail = useRef<string[]>([]);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: RouteId) => {
    trail.current.push(window.location.hash);
    window.location.hash = toHash(next);
  }, []);

  const back = useCallback(() => {
    const previous = trail.current.pop();
    if (previous !== undefined) {
      window.location.hash = previous;
    } else {
      window.history.back();
    }
  }, []);

  const value = useMemo<RouterValue>(() => ({ route, navigate, back }), [route, navigate, back]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>');
  return value;
}
