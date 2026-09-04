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
  { id: 'rules', label: 'Rules', icon: 'sliders-horizontal', disabled: true },
  { id: 'reports', label: 'Reports', icon: 'file-text', disabled: true },
  { id: 'admin', label: 'Admin', icon: 'user-gear', disabled: true },
];

export type DashboardTabId = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';

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
  if (['c1', 'c2', 'c3', 'c4', 'c5'].includes(route)) return 'c1';
  if (['queue', 'detail', 'sim'].includes(route)) return 'queue';
  return route;
};
