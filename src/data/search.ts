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
      {
        icon: 'sliders-horizontal',
        label: 'Review pricing rules',
        meta: 'Guardrails, floors and ceilings',
        route: 'rules',
      },
      {
        icon: 'file-text',
        label: 'Browse the report catalogue',
        meta: 'Schedules, formats and delivery',
        route: 'reports',
      },
      {
        icon: 'user-gear',
        label: 'Review portal access',
        meta: 'People, roles and claims',
        route: 'admin',
      },
    ],
  },
  {
    label: 'People',
    entries: [
      {
        icon: 'user-gear',
        label: 'Hassan Nasser',
        meta: 'Administrator · Platform Engineering',
        route: 'admin',
      },
      {
        icon: 'shield-check',
        label: 'Mariam Haddad',
        meta: 'Governance lead · Pricing Governance',
        route: 'admin',
      },
      {
        icon: 'clock-counter-clockwise',
        label: 'Omar Siddiqui',
        meta: 'Auditor · Internal Audit',
        route: 'admin',
      },
    ],
  },
  {
    label: 'Reports',
    entries: [
      {
        icon: 'file-text',
        label: 'Weekly pricing cycle report',
        meta: 'PDF · Mondays 08:00 GST',
        route: 'reports',
      },
      {
        icon: 'clock-counter-clockwise',
        label: 'Decision audit extract',
        meta: 'XLSX · Mondays 09:00 GST',
        route: 'reports',
      },
      {
        icon: 'shield-check',
        label: 'Margin and guardrail compliance',
        meta: 'PDF · 1st of month',
        route: 'reports',
      },
      {
        icon: 'gavel',
        label: 'Regulatory filing pack',
        meta: 'PDF · quarterly',
        route: 'reports',
      },
    ],
  },
  {
    label: 'Rules',
    entries: [
      {
        icon: 'percent',
        label: 'Category margin floor — Smartphones',
        meta: 'Margin protection · ≥ 12.0%',
        route: 'rules',
      },
      {
        icon: 'arrows-out-line-vertical',
        label: 'Absolute price band — flagship handsets',
        meta: 'Price band · AED 3,400 – 4,100',
        route: 'rules',
      },
      {
        icon: 'speedometer',
        label: 'Maximum move per cycle',
        meta: 'Change velocity · ±8.0%',
        route: 'rules',
      },
      {
        icon: 'scales',
        label: 'Competitor parity band',
        meta: 'Parity · −2.0% to +5.0%',
        route: 'rules',
      },
    ],
  },
];

/**
 * Case-insensitive filter over label and meta, dropping groups that end up
 * empty. Takes the index as an argument rather than closing over
 * SEARCH_INDEX, so the same pure function serves the Firestore-backed index.
 */
export const filterSearchIndex = (
  groups: readonly SearchGroup[],
  query: string,
): readonly SearchGroup[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return groups;
  return groups
    .map((group) => ({
      label: group.label,
      entries: group.entries.filter(
        (entry) =>
          entry.label.toLowerCase().includes(needle) || entry.meta.toLowerCase().includes(needle),
      ),
    }))
    .filter((group) => group.entries.length > 0);
};

export interface SearchCopy {
  readonly placeholder: string;
  readonly ariaLabel: string;
  readonly escKey: string;
  /** Wraps the query in the empty state: `${emptyPrefix}“query”`. */
  readonly emptyPrefix: string;
  readonly emptyHint: string;
  readonly navigateHint: string;
  readonly openHint: string;
  readonly indexedLabel: string;
}

export const SEARCH_COPY: SearchCopy = {
  placeholder: 'Search SKUs, dashboards or actions',
  ariaLabel: 'Search',
  escKey: 'Esc',
  emptyPrefix: 'Nothing matches ',
  emptyHint: 'Try a SKU code, a category or a dashboard name',
  navigateHint: 'navigate',
  openHint: 'open',
  indexedLabel: 'Indexed 2,500 SKUs',
};
