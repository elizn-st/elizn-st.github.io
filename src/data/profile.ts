export type PermissionState = 'allowed' | 'denied';

export interface Permission {
  readonly title: string;
  readonly subtitle: string;
  readonly state: PermissionState;
}

export const PERMISSIONS: readonly Permission[] = [
  { title: 'Recommendations', subtitle: 'Review, approve and reject', state: 'allowed' },
  { title: 'Dashboards', subtitle: 'Read-only across all five boards', state: 'allowed' },
  { title: 'Pricing rules', subtitle: 'Configure guardrails and floors', state: 'denied' },
  { title: 'Reports', subtitle: 'Schedule and export', state: 'denied' },
  { title: 'Admin', subtitle: 'User and role management', state: 'denied' },
];

export interface NotificationPreference {
  readonly title: string;
  readonly subtitle: string;
  readonly enabled: boolean;
}

export const NOTIFICATION_PREFERENCES: readonly NotificationPreference[] = [
  {
    title: 'Critical alerts',
    subtitle: 'Stale data, feed failures, breached guardrails',
    enabled: true,
  },
  {
    title: 'Competitor movements',
    subtitle: 'Price cuts above 5% in tracked categories',
    enabled: true,
  },
  { title: 'Cycle summaries', subtitle: 'Digest when a repricing cycle completes', enabled: true },
  { title: 'Model updates', subtitle: 'New engine versions and reason codes', enabled: false },
  { title: 'Weekly report', subtitle: 'Every Monday at 08:00 GST', enabled: false },
];

export interface DeviceSession {
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly when: string;
  readonly current: boolean;
}

export const DEVICE_SESSIONS: readonly DeviceSession[] = [
  {
    icon: 'laptop',
    title: 'MacBook Pro · Chrome',
    subtitle: 'Dubai, UAE · current session',
    when: 'Active now',
    current: true,
  },
  {
    icon: 'device-mobile',
    title: 'iPhone 15 · Safari',
    subtitle: 'Dubai, UAE',
    when: '2 hours ago',
    current: false,
  },
  {
    icon: 'desktop-tower',
    title: 'Windows · Edge',
    subtitle: 'Abu Dhabi, UAE',
    when: 'Aug 04, 09:12',
    current: false,
  },
];
