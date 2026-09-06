/** Every route that resolves to a real screen in this build. */
export const SCREEN_IDS = [
  'home',
  'queue',
  'detail',
  'sim',
  'chat',
  'history',
  'chartd',
  'profile',
  'rules',
  'reports',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];

/**
 * Routes that can be addressed from the shell. `admin` is present in the
 * sidebar but disabled this cycle, so it has no screen.
 */
export const ROUTE_IDS = [...SCREEN_IDS, 'admin'] as const;

export type RouteId = (typeof ROUTE_IDS)[number];

export const DEFAULT_ROUTE: ScreenId = 'home';

/** `#/queue` → `queue`; an empty or bare hash falls back to Home. */
export const parseHash = (hash: string): string => hash.replace(/^#\/?/, '') || DEFAULT_ROUTE;

export const toHash = (route: RouteId): string => `#/${route}`;
