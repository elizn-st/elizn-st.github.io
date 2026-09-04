/** Every route that resolves to a real screen in this build. */
export type ScreenId =
  | 'home'
  | 'queue'
  | 'detail'
  | 'sim'
  | 'chat'
  | 'history'
  | 'chartd'
  | 'profile'
  | 'rules'
  | 'c1'
  | 'c2'
  | 'c3'
  | 'c4'
  | 'c5';

/**
 * Routes that can be addressed from the shell. `reports` and `admin` are
 * present in the sidebar but disabled this cycle, so they have no screen.
 */
export type RouteId = ScreenId | 'reports' | 'admin';

export const DEFAULT_ROUTE: ScreenId = 'home';

/** `#/queue` → `queue`; an empty or bare hash falls back to Home. */
export const parseHash = (hash: string): string => hash.replace(/^#\/?/, '') || DEFAULT_ROUTE;

export const toHash = (route: RouteId): string => `#/${route}`;
