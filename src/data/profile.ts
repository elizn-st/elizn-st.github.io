import type { KpiSpec } from './ui';

export const PERMISSION_STATES = ['allowed', 'denied'] as const;

export type PermissionState = (typeof PERMISSION_STATES)[number];

export interface Permission {
  readonly title: string;
  readonly subtitle: string;
  readonly state: PermissionState;
}

export const PERMISSIONS: readonly Permission[] = [
  { title: 'Recommendations', subtitle: 'Review, approve and reject', state: 'allowed' },
  { title: 'Dashboards', subtitle: 'Read-only across all five boards', state: 'allowed' },
  { title: 'Pricing rules', subtitle: 'Configure guardrails and floors', state: 'denied' },
  { title: 'Reports', subtitle: 'Schedule and distribute', state: 'denied' },
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

export interface ProfileCopy {
  readonly editLabel: string;
  readonly editIcon: string;
  readonly editMessage: string;
  readonly signOutLabel: string;
  readonly signOutIcon: string;
  readonly personalTitle: string;
  readonly fullNameLabel: string;
  readonly jobTitleLabel: string;
  readonly departmentLabel: string;
  readonly workEmailLabel: string;
  readonly timeZoneLabel: string;
  readonly languageLabel: string;
  readonly timeZones: readonly string[];
  readonly languages: readonly string[];
  readonly saveLabel: string;
  readonly saveMessage: string;
  readonly preferencesTitle: string;
  readonly preferencesSubtitle: string;
  readonly permissionsTitle: string;
  readonly permissionsSubtitle: string;
  readonly allowedLabel: string;
  readonly deniedLabel: string;
  readonly sessionsTitle: string;
  readonly revokeLabel: string;
  readonly revokeMessage: string;
  readonly signOutEverywhereLabel: string;
  readonly signOutEverywhereMessage: string;
}

export const PROFILE_COPY: ProfileCopy = {
  editLabel: 'Edit profile',
  editIcon: 'pencil-simple',
  editMessage: 'Profile editor opened',
  signOutLabel: 'Sign out',
  signOutIcon: 'sign-out',
  personalTitle: 'Personal details',
  fullNameLabel: 'Full name',
  jobTitleLabel: 'Job title',
  departmentLabel: 'Department',
  workEmailLabel: 'Work email',
  timeZoneLabel: 'Time zone',
  languageLabel: 'Language',
  timeZones: ['Gulf Standard Time (GST, +4)', 'UTC'],
  languages: ['English', 'العربية — not in scope this phase'],
  saveLabel: 'Save changes',
  saveMessage: 'Profile details saved',
  preferencesTitle: 'Notification preferences',
  preferencesSubtitle: 'Applies to the bell in the top bar and to email digests.',
  permissionsTitle: 'Role and permissions',
  permissionsSubtitle: 'Granted by the DLA governance matrix. Contact Admin to change.',
  allowedLabel: 'Allowed',
  deniedLabel: 'No access',
  sessionsTitle: 'Active sessions',
  revokeLabel: 'Revoke',
  revokeMessage: 'Session revoked',
  signOutEverywhereLabel: 'Sign out everywhere else',
  signOutEverywhereMessage: 'All other sessions signed out',
};

export const PROFILE_KPIS: readonly KpiSpec[] = [
  {
    label: 'Decisions this cycle',
    value: '42',
    delta: '+18',
    direction: 'up',
    tone: '',
    graph: false,
  },
  {
    label: 'Approval rate',
    value: '88.1%',
    delta: '+1.4pp',
    direction: 'up',
    tone: 'pos',
    graph: false,
  },
  {
    label: 'Avg review time',
    value: '2m 14s',
    delta: '-22s',
    direction: 'up',
    tone: '',
    graph: false,
  },
  { label: 'Overrides used', value: '3', delta: '-1', direction: 'up', tone: '', graph: false },
];
