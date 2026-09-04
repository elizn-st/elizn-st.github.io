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

export const NOTIFICATION_TABS: readonly string[] = ['All', 'Critical', 'Warnings', 'Updates'];
