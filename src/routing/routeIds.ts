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
  'admin',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
] as const;

export type ScreenId = (typeof SCREEN_IDS)[number];

/** Every route the shell can address. Every one of them resolves to a screen. */
export const ROUTE_IDS = SCREEN_IDS;

export type RouteId = (typeof ROUTE_IDS)[number];

export const DEFAULT_ROUTE: ScreenId = 'home';

/** `#/queue` → `queue`; an empty or bare hash falls back to Home. */
export const parseHash = (hash: string): string => hash.replace(/^#\/?/, '') || DEFAULT_ROUTE;

export const toHash = (route: RouteId): string => `#/${route}`;
