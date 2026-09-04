import type { RouteId } from '@/routing/routeIds';

export interface SearchEntry {
  readonly icon: string;
  readonly label: string;
  readonly meta: string;
  readonly route: RouteId;
}

export interface SearchGroup {
  readonly label: string;
  readonly entries: readonly SearchEntry[];
}

export const SEARCH_INDEX: readonly SearchGroup[] = [
  {
    label: 'Recent',
    entries: [
      {
        icon: 'clock-counter-clockwise',
        label: 'iPhone 15 Pro 256GB',
        meta: 'SKU-114872',
        route: 'detail',
      },
      {
        icon: 'clock-counter-clockwise',
        label: 'Competitor intelligence',
        meta: 'Dashboard',
        route: 'c2',
      },
    ],
  },
  {
    label: 'SKUs',
    entries: [
      {
        icon: 'device-mobile',
        label: 'iPhone 15 Pro 256GB',
        meta: 'Smartphones · AED 3,749',
        route: 'detail',
      },
      {
        icon: 'device-mobile',
        label: 'Samsung Galaxy S24',
        meta: 'Smartphones · AED 3,299',
        route: 'detail',
      },
      {
        icon: 'headphones',
        label: 'AirPods Pro 2',
        meta: 'Accessories · AED 929',
        route: 'detail',
      },
      {
        icon: 'device-tablet',
        label: 'iPad Air 11 256GB',
        meta: 'Tablets · AED 2,399',
        route: 'detail',
      },
    ],
  },
  {
    label: 'Dashboards',
    entries: [
      {
        icon: 'chart-line',
        label: 'Pricing performance',
        meta: 'Deviation, volume and revenue',
        route: 'c1',
      },
      {
        icon: 'chart-line',
        label: 'Forecast accuracy',
        meta: 'MAPE and bias metrics',
        route: 'c3',
      },
      {
        icon: 'chart-line',
        label: 'Revenue impact',
        meta: 'Cumulative uplift vs baseline',
        route: 'c4',
      },
    ],
  },
  {
    label: 'Actions',
    entries: [
      {
        icon: 'list-checks',
        label: 'Review recommendations queue',
        meta: '128 pending',
        route: 'queue',
      },
      { icon: 'flask', label: 'Run scenario simulation', meta: 'What-if simulator', route: 'sim' },
      {
        icon: 'clock-counter-clockwise',
        label: 'Open decision history',
        meta: 'Full audit log',
        route: 'history',
      },
      { icon: 'chats', label: 'Ask the AI analyst', meta: 'LLM / RAG analyst', route: 'chat' },
    ],
  },
];

/** Case-insensitive filter over label and meta, dropping groups that end up empty. */
export const filterSearchIndex = (query: string): readonly SearchGroup[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return SEARCH_INDEX;
  return SEARCH_INDEX.map((group) => ({
    label: group.label,
    entries: group.entries.filter(
      (entry) =>
        entry.label.toLowerCase().includes(needle) || entry.meta.toLowerCase().includes(needle),
    ),
  })).filter((group) => group.entries.length > 0);
};
