import type { RouteId } from '@/routing/routeIds';

export interface NavEntry {
  readonly id: RouteId;
  readonly label: string;
  readonly icon: string;
  readonly disabled?: boolean;
}

export const NAV_ITEMS: readonly NavEntry[] = [
  { id: 'home', label: 'Home', icon: 'house' },
  { id: 'c1', label: 'Dashboards', icon: 'chart-line' },
  { id: 'queue', label: 'Recommendations', icon: 'list-checks' },
  { id: 'rules', label: 'Rules', icon: 'sliders-horizontal' },
  { id: 'reports', label: 'Reports', icon: 'file-text' },
  { id: 'admin', label: 'Admin', icon: 'user-gear', disabled: true },
];

/** Runtime list as well as a type, so a Console-edited tab id can be validated. */
export const DASHBOARD_TAB_IDS = ['c1', 'c2', 'c3', 'c4', 'c5'] as const;

export type DashboardTabId = (typeof DASHBOARD_TAB_IDS)[number];

export interface DashboardTab {
  readonly id: DashboardTabId;
  readonly label: string;
}

export const DASHBOARD_TABS: readonly DashboardTab[] = [
  { id: 'c1', label: 'Pricing performance' },
  { id: 'c2', label: 'Competitor intelligence' },
  { id: 'c3', label: 'Forecast accuracy' },
  { id: 'c4', label: 'Revenue impact' },
  { id: 'c5', label: 'Customer behaviour' },
];

/**
 * Sidebar highlighting groups several routes under one entry, mirroring the
 * original `na` lookup in the router.
 */
export const navHighlightFor = (route: RouteId): RouteId => {
  if ((DASHBOARD_TAB_IDS as readonly string[]).includes(route)) return 'c1';
  if (['queue', 'detail', 'sim'].includes(route)) return 'queue';
  return route;
};

/** Screens whose breadcrumb is a fixed pair rather than derived from data. */
export const BREADCRUMB_IDS = [
  'home',
  'queue',
  'detail',
  'sim',
  'chat',
  'history',
  'profile',
  'rules',
  'reports',
] as const;

export type BreadcrumbId = (typeof BREADCRUMB_IDS)[number];

/** `section` is empty for a top-level screen, which renders no section. */
export interface Breadcrumb {
  readonly section: string;
  readonly page: string;
}

export interface NotFoundCopy {
  readonly page: string;
  readonly titlePrefix: string;
  readonly titleSuffix: string;
  readonly bodyPrefix: string;
  readonly bodySuffix: string;
  readonly homeLabel: string;
  readonly reloadLabel: string;
}

export interface NavigationCopy {
  readonly navItems: readonly NavEntry[];
  readonly dashboardTabs: readonly DashboardTab[];
  readonly breadcrumbs: Readonly<Record<BreadcrumbId, Breadcrumb>>;
  readonly notFound: NotFoundCopy;
  readonly logoMark: string;
  readonly logoWord: string;
  readonly collapseLabel: string;
  readonly openMenuLabel: string;
  readonly backLabel: string;
  readonly searchLabel: string;
  readonly analystLabel: string;
  readonly notificationsLabel: string;
}

/**
 * Labels and icons are content; the `ids are not -- they name routes that
 * must exist in the bundle, so the parser validates them against ROUTE_IDS
 * and a typo in the Console fails loudly instead of producing a dead link.
 */
export const NAVIGATION_COPY: NavigationCopy = {
  navItems: NAV_ITEMS,
  dashboardTabs: DASHBOARD_TABS,
  breadcrumbs: {
    home: { section: '', page: 'Home' },
    queue: { section: 'Recommendations', page: 'Recommendations review queue' },
    detail: { section: 'Recommendations', page: 'Recommendation detail' },
    sim: { section: 'Recommendations', page: 'What-if simulator' },
    chat: { section: '', page: 'AI analyst' },
    history: { section: 'Recommendations', page: 'Decision history' },
    profile: { section: '', page: 'Profile' },
    rules: { section: '', page: 'Rules' },
    reports: { section: '', page: 'Reports' },
  },
  notFound: {
    page: 'Screen not found',
    titlePrefix: 'Screen \u201c',
    titleSuffix: '\u201d is not in this build',
    bodyPrefix: 'Build',
    bodySuffix:
      'does not contain this route. If you expected it, the browser is serving a cached bundle \u2014 reload with cache disabled.',
    homeLabel: 'Go to Home',
    reloadLabel: 'Reload without cache',
  },
  logoMark: 'e&',
  logoWord: 'ADPA',
  collapseLabel: 'Collapse panel',
  openMenuLabel: 'Open menu',
  backLabel: 'Go back',
  searchLabel: 'Search',
  analystLabel: 'AI analyst',
  notificationsLabel: 'Notifications',
};
