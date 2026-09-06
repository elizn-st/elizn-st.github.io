import type { KpiDirection, KpiTone, NoticeSpec } from './ui';

/**
 * Who can get into this portal, and what they can do once they are in.
 *
 * The app has had the machinery for this since the Firebase work and has never
 * shown it: two custom claims, `portalAccess` and `admin`, set by
 * `scripts/grant-access.ts` and read by `firestore.rules` in
 * `hasPortalAccess()` and `isAdmin()`. This screen is where they become
 * visible.
 *
 * The directory is authored, but the seed reconciles it against Firebase Auth:
 * for anyone who is a real account, the claims and last sign-in shown here are
 * the account's actual ones rather than the authored guess.
 */

export const PORTAL_ROLES = [
  'administrator',
  'governance-lead',
  'reviewer',
  'analyst',
  'auditor',
] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

export const ACCOUNT_STATUSES = ['active', 'invited', 'suspended'] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface Person {
  readonly name: string;
  readonly email: string;
  readonly role: PortalRole;
  readonly department: string;
  /** The `portalAccess` custom claim: being signed in is not enough to read. */
  readonly portalAccess: boolean;
  /** The `admin` custom claim: additionally permits client writes to org data. */
  readonly admin: boolean;
  readonly status: AccountStatus;
  /** Empty when the person has been invited but has never signed in. */
  readonly lastActive: string;
  readonly invitedOn: string;
  /**
   * Whether a Firebase Auth account actually exists for this address. Set by
   * the seed from the real user list, not authored -- an invitation that was
   * never taken up is an access-governance fact worth being right about.
   */
  readonly signedUp: boolean;
}

export const PEOPLE: readonly Person[] = [
  {
    name: 'Aisha Al-Khayyat',
    email: 'aisha.alkhayyat@eand.com',
    role: 'reviewer',
    department: 'Finance',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 06, 09:12',
    invitedOn: 'Feb 12, 2026',
    signedUp: true,
  },
  {
    name: 'Mariam Haddad',
    email: 'm.haddad@eand.com',
    role: 'governance-lead',
    department: 'Pricing Governance',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 06, 08:41',
    invitedOn: 'Jan 08, 2026',
    signedUp: false,
  },
  {
    name: 'Hassan Nasser',
    email: 'h.nasser@eand.com',
    role: 'administrator',
    department: 'Platform Engineering',
    portalAccess: true,
    admin: true,
    status: 'active',
    lastActive: 'Aug 06, 07:55',
    invitedOn: 'Jan 08, 2026',
    signedUp: false,
  },
  {
    name: 'Rui Fernandes',
    email: 'r.fernandes@eand.com',
    role: 'reviewer',
    department: 'Marketing',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 05, 16:20',
    invitedOn: 'Mar 03, 2026',
    signedUp: false,
  },
  {
    name: 'Khalid Al-Rashid',
    email: 'k.alrashid@eand.com',
    role: 'reviewer',
    department: 'Category Management',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 05, 11:04',
    invitedOn: 'Mar 03, 2026',
    signedUp: false,
  },
  {
    name: 'Omar Siddiqui',
    email: 'o.siddiqui@eand.com',
    role: 'auditor',
    department: 'Internal Audit',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 04, 14:38',
    invitedOn: 'Apr 21, 2026',
    signedUp: false,
  },
  {
    name: 'Layla Mansouri',
    email: 'l.mansouri@eand.com',
    role: 'analyst',
    department: 'Commercial',
    portalAccess: true,
    admin: false,
    status: 'active',
    lastActive: 'Aug 03, 10:12',
    invitedOn: 'May 19, 2026',
    signedUp: false,
  },
  {
    name: 'Hala Karim',
    email: 'h.karim@eand.com',
    role: 'administrator',
    department: 'Platform Engineering',
    portalAccess: true,
    admin: true,
    status: 'active',
    lastActive: 'Jul 22, 09:30',
    invitedOn: 'Jan 08, 2026',
    signedUp: false,
  },
  {
    name: 'Priya Nair',
    email: 'p.nair@eand.com',
    role: 'analyst',
    department: 'Data Science',
    portalAccess: false,
    admin: false,
    status: 'invited',
    lastActive: '',
    invitedOn: 'Aug 03, 2026',
    signedUp: false,
  },
  {
    name: 'Daniel Okafor',
    email: 'd.okafor@eand.com',
    role: 'auditor',
    department: 'Legal & Regulatory',
    portalAccess: false,
    admin: false,
    status: 'invited',
    lastActive: '',
    invitedOn: 'Jul 30, 2026',
    signedUp: false,
  },
  {
    name: 'Sara Boutros',
    email: 's.boutros@eand.com',
    role: 'analyst',
    department: 'Customer Insights',
    portalAccess: false,
    admin: false,
    status: 'suspended',
    lastActive: 'Jun 11, 15:47',
    invitedOn: 'Feb 12, 2026',
    signedUp: false,
  },
];

/** What a role is allowed to do, in the portal's own vocabulary. */
export interface RoleCopy {
  readonly key: PortalRole;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

/** A change to somebody's access, as the audit trail records it. */
export interface AccessChange {
  readonly date: string;
  readonly person: string;
  readonly change: string;
  readonly actor: string;
  readonly status: AccountStatus;
}

export const ADMIN_METRICS = ['access', 'administrators', 'pending', 'suspended'] as const;

export type AdminMetric = (typeof ADMIN_METRICS)[number];

export interface AdminKpiSpec {
  readonly metric: AdminMetric;
  readonly label: string;
  readonly delta: string;
  readonly direction: KpiDirection;
  readonly tone: KpiTone;
}

export interface AdminCopy {
  readonly title: string;
  readonly chip: string;
  readonly exportLabel: string;
  readonly exportIcon: string;
  readonly exportMessage: string;
  readonly requestLabel: string;
  readonly requestIcon: string;
  readonly requestMessage: string;
  /** Chosen by the signed-in session's real `admin` claim. */
  readonly noticeMember: NoticeSpec;
  readonly noticeAdmin: NoticeSpec;
  readonly kpis: readonly AdminKpiSpec[];

  readonly directoryTitle: string;
  readonly directorySubtitle: string;
  readonly searchPlaceholder: string;
  readonly searchAriaLabel: string;
  /** First entry is the "no status filter" option. */
  readonly statusFilters: readonly string[];
  readonly statusChipPrefix: string;
  readonly roleChipPrefix: string;
  readonly searchChipPrefix: string;
  readonly columns: readonly string[];
  readonly resultsOf: string;
  readonly peopleUnit: string;
  readonly peopleUnitOne: string;
  readonly emptyMessage: string;
  readonly emptyIcon: string;

  readonly roleLabels: Readonly<Record<PortalRole, string>>;
  readonly statusLabels: Readonly<Record<AccountStatus, string>>;
  readonly portalClaimLabel: string;
  readonly adminClaimLabel: string;
  readonly noClaimLabel: string;
  readonly neverLabel: string;
  readonly youLabel: string;
  readonly invitedNotSignedUp: string;

  readonly accessTitle: string;
  readonly accessSubtitle: string;
  readonly accessUnknown: string;
  readonly accessPortalTitle: string;
  readonly accessPortalNote: string;
  readonly accessAdminTitle: string;
  readonly accessAdminNote: string;
  readonly accessGranted: string;
  readonly accessWithheld: string;

  readonly rolesTitle: string;
  readonly rolesSubtitle: string;
  readonly roles: readonly RoleCopy[];

  readonly departmentsTitle: string;
  readonly departmentsSubtitle: string;

  readonly changesTitle: string;
  readonly changesSubtitle: string;
  readonly changes: readonly AccessChange[];
}

export const ADMIN_COPY: AdminCopy = {
  title: 'Admin',
  chip: 'Portal access · 11 accounts',
  exportLabel: 'Export directory',
  exportIcon: 'export',
  exportMessage: 'Access directory exported',
  requestLabel: 'Request access change',
  requestIcon: 'user-gear',
  requestMessage: 'Access request sent to Platform Engineering',
  noticeMember: {
    severity: 'info',
    icon: 'lock-key',
    title:
      'You are signed in without the admin claim, so this directory is read-only. Access changes are made by a portal administrator.',
  },
  noticeAdmin: {
    severity: 'warning',
    icon: 'shield-check',
    title:
      'Your session carries the admin claim. Changes made here take effect for everyone on the portal.',
  },
  kpis: [
    { metric: 'access', label: 'People with access', delta: '+2', direction: 'up', tone: '' },
    { metric: 'administrators', label: 'Administrators', delta: '0', direction: 'up', tone: '' },
    {
      metric: 'pending',
      label: 'Awaiting first sign-in',
      delta: '+2',
      direction: 'down',
      tone: '',
    },
    { metric: 'suspended', label: 'Suspended', delta: '+1', direction: 'down', tone: '' },
  ],

  directoryTitle: 'Access directory',
  directorySubtitle:
    'Everyone invited to the portal, the claims their account carries and when they were last here.',
  searchPlaceholder: 'Search by name, email, role or department',
  searchAriaLabel: 'Search the directory',
  statusFilters: ['All', 'Active', 'Invited', 'Suspended'],
  statusChipPrefix: 'Status: ',
  roleChipPrefix: 'Role: ',
  searchChipPrefix: 'Search: ',
  columns: ['Person', 'Role', 'Department', 'Access', 'Last active', 'Status'],
  resultsOf: 'of',
  peopleUnit: 'people',
  peopleUnitOne: 'person',
  emptyMessage: 'Nobody matches these filters. Clear one to widen the search.',
  emptyIcon: 'magnifying-glass',

  roleLabels: {
    administrator: 'Administrator',
    'governance-lead': 'Governance lead',
    reviewer: 'Reviewer',
    analyst: 'Analyst',
    auditor: 'Auditor',
  },
  statusLabels: { active: 'Active', invited: 'Invited', suspended: 'Suspended' },
  portalClaimLabel: 'Portal',
  adminClaimLabel: 'Admin',
  noClaimLabel: 'No access',
  neverLabel: 'Never',
  youLabel: 'You',
  invitedNotSignedUp: 'Invited, no account created yet',

  accessTitle: 'Your access',
  accessSubtitle: 'Read from the ID token this session is actually using.',
  accessUnknown: 'Reading your session…',
  accessPortalTitle: 'Portal access',
  accessPortalNote: 'Required to read any pricing data. Being signed in is not enough.',
  accessAdminTitle: 'Administrator',
  accessAdminNote: 'Permits changes to rules, reports and other people’s access.',
  accessGranted: 'Granted',
  accessWithheld: 'Not granted',

  rolesTitle: 'Roles',
  rolesSubtitle: 'What each role may do. Select one to filter the directory.',
  roles: [
    {
      key: 'administrator',
      title: 'Administrator',
      description: 'Manages accounts, roles, pricing rules and report distribution.',
      icon: 'user-gear',
    },
    {
      key: 'governance-lead',
      title: 'Governance lead',
      description: 'Approves rule changes and owns the repricing cycle.',
      icon: 'shield-check',
    },
    {
      key: 'reviewer',
      title: 'Reviewer',
      description: 'Reviews, approves and rejects recommendations. Dashboards read-only.',
      icon: 'list-checks',
    },
    {
      key: 'analyst',
      title: 'Analyst',
      description: 'Reads dashboards and subscribed reports. Makes no decisions.',
      icon: 'chart-line',
    },
    {
      key: 'auditor',
      title: 'Auditor',
      description: 'Reads the decision trail and the compliance extracts.',
      icon: 'clock-counter-clockwise',
    },
  ],

  departmentsTitle: 'Access by department',
  departmentsSubtitle: 'Where the people holding portal access sit.',

  changesTitle: 'Recent access changes',
  changesSubtitle: 'Every grant, revocation and role change is logged.',
  changes: [
    {
      date: 'Aug 03, 2026',
      person: 'Priya Nair',
      change: 'Invited as Analyst — awaiting first sign-in',
      actor: 'H. Nasser',
      status: 'invited',
    },
    {
      date: 'Jul 30, 2026',
      person: 'Daniel Okafor',
      change: 'Invited as Auditor — awaiting first sign-in',
      actor: 'H. Karim',
      status: 'invited',
    },
    {
      date: 'Jun 12, 2026',
      person: 'Sara Boutros',
      change: 'Portal access revoked — extended leave',
      actor: 'H. Nasser',
      status: 'suspended',
    },
    {
      date: 'May 19, 2026',
      person: 'Layla Mansouri',
      change: 'Granted portal access as Analyst',
      actor: 'H. Karim',
      status: 'active',
    },
    {
      date: 'Apr 21, 2026',
      person: 'Omar Siddiqui',
      change: 'Granted portal access as Auditor',
      actor: 'H. Nasser',
      status: 'active',
    },
    {
      date: 'Mar 03, 2026',
      person: 'Khalid Al-Rashid',
      change: 'Role changed from Analyst to Reviewer',
      actor: 'M. Haddad',
      status: 'active',
    },
  ],
};
