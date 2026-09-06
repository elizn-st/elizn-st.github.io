import type { Severity } from './home';

export interface NotificationItem {
  readonly severity: Severity;
  readonly icon: string;
  readonly title: string;
  readonly body: string;
  readonly time: string;
  readonly unread: boolean;
}

export interface NotificationGroup {
  readonly label: string;
  readonly items: readonly NotificationItem[];
}

export const NOTIFICATION_GROUPS: readonly NotificationGroup[] = [
  {
    label: 'Today',
    items: [
      {
        severity: 'critical',
        icon: 'warning-octagon',
        title: 'Stale data from CSS source > 6h',
        body: 'Competitor feed has not refreshed since 03:10. Recommendations may be based on old prices.',
        time: '35 minutes ago',
        unread: true,
      },
      {
        severity: 'warning',
        icon: 'warning',
        title: 'Competitor cut price by 12% — Smartphones',
        body: 'Competitor A dropped iPhone 15 Pro by 12%. 14 SKUs affected.',
        time: '1 h 12 minutes ago',
        unread: true,
      },
      {
        severity: 'success',
        icon: 'check-circle',
        title: 'Batch cycle completed successfully',
        body: '128 recommendations generated for cycle Aug 05–11.',
        time: '2 h 5 minutes ago',
        unread: false,
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        severity: 'info',
        icon: 'info',
        title: 'Update ready',
        body: 'Pricing engine v2.4 is available with improved elasticity modelling.',
        time: '1 day ago',
        unread: false,
      },
      {
        severity: 'warning',
        icon: 'warning',
        title: 'Licensed feed is 5 h stale',
        body: 'Source freshness dropped below the 4 h threshold.',
        time: '1 day ago',
        unread: false,
      },
    ],
  },
  {
    label: 'Earlier',
    items: [
      {
        severity: 'success',
        icon: 'check-circle',
        title: 'Guardrails updated',
        body: 'Margin floor raised to 18% for Accessories.',
        time: 'Aug 03',
        unread: false,
      },
      {
        severity: 'info',
        icon: 'info',
        title: 'New reason code added',
        body: '“Seasonal clearance” is now available in the decision panel.',
        time: 'Aug 01',
        unread: false,
      },
    ],
  },
];

/** Runtime list as well as a type, so a Console-edited tab id can be validated. */
export const NOTIFICATION_TAB_IDS = ['all', 'critical', 'warnings', 'updates'] as const;

export type NotificationTabId = (typeof NOTIFICATION_TAB_IDS)[number];

export interface NotificationTab {
  readonly id: NotificationTabId;
  readonly label: string;
}

export const NOTIFICATION_TABS: readonly NotificationTab[] = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'warnings', label: 'Warnings' },
  { id: 'updates', label: 'Updates' },
];

export const DEFAULT_NOTIFICATION_TAB: NotificationTabId = 'all';

/**
 * Which severities each tab admits, `null` meaning "no restriction".
 *
 * The grouping is logic, not copy: renaming "Updates" in the Console must not
 * silently change what the tab shows, which is why the tab carries an id and
 * only its label is editable. `all` is a null rather than a copy of SEVERITIES
 * so that a new severity joins it without an edit here -- and so that this file
 * keeps importing `Severity` as a type only, which is what lets `npm run seed`
 * load it under Node's extensionless resolution.
 */
const TAB_SEVERITIES: Readonly<Record<NotificationTabId, readonly Severity[] | null>> = {
  all: null,
  critical: ['critical'],
  warnings: ['warning'],
  updates: ['info', 'success'],
};

export const matchesTab = (item: NotificationItem, tab: NotificationTabId): boolean => {
  const allowed = TAB_SEVERITIES[tab];
  return allowed === null || allowed.includes(item.severity);
};

/**
 * The groups a tab shows, in their authored order.
 *
 * A day that has nothing for the selected tab drops out with its label, rather
 * than leaving an "Earlier" heading standing over nothing.
 */
export const filterGroups = (
  groups: readonly NotificationGroup[],
  tab: NotificationTabId,
): readonly NotificationGroup[] =>
  groups
    .map((group) => ({ ...group, items: group.items.filter((item) => matchesTab(item, tab)) }))
    .filter((group) => group.items.length > 0);

export const countItems = (groups: readonly NotificationGroup[]): number =>
  groups.reduce((total, group) => total + group.items.length, 0);

export const countUnread = (groups: readonly NotificationGroup[]): number =>
  groups.reduce((total, group) => total + group.items.filter((item) => item.unread).length, 0);

export interface NotificationsCopy {
  readonly title: string;
  /** Subtitle reads `${n} ${unreadLabel} · ${m} ${totalLabel}`, both counted. */
  readonly unreadLabel: string;
  readonly totalLabel: string;
  readonly markAllLabel: string;
  readonly markAllIcon: string;
  readonly markAllMessage: string;
  readonly emptyMessage: string;
  readonly emptyIcon: string;
  readonly closeLabel: string;
}

export const NOTIFICATIONS_COPY: NotificationsCopy = {
  title: 'Notifications',
  unreadLabel: 'unread',
  totalLabel: 'total',
  markAllLabel: 'Mark all read',
  markAllIcon: 'checks',
  markAllMessage: 'All notifications marked as read',
  emptyMessage: 'Nothing in this tab right now.',
  emptyIcon: 'check-circle',
  closeLabel: 'Close',
};
