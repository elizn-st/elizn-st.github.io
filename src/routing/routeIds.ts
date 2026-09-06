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

/**
 * A parsed hash.
 *
 * The optional second segment is what a screen needs when it renders one of
 * several records -- `#/chartd/c5-elasticity` rather than `#/chartd` plus a
 * remembered selection, so the address survives a reload and a paste.
 */
export interface RouteLocation {
  /** Raw slug -- may not resolve to a screen. */
  readonly route: string;
  /** The second segment, or `null` when the hash carries none. */
  readonly param: string | null;
}

/** `#/chartd/c5-elasticity` -> `{ chartd, c5-elasticity }`; a bare hash is Home. */
export const parseHash = (hash: string): RouteLocation => {
  const [route = '', param = ''] = hash.replace(/^#\/?/, '').split('/');
  return { route: route || DEFAULT_ROUTE, param: param || null };
};

export const toHash = (route: RouteId, param?: string): string =>
  param ? `#/${route}/${param}` : `#/${route}`;

export const sameLocation = (a: RouteLocation, b: RouteLocation): boolean =>
  a.route === b.route && a.param === b.param;
