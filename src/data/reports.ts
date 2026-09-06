import type { KpiDirection, KpiTone, NoticeSpec } from './ui';

/**
 * Reports are the scheduled, distributable artefacts the portal produces: the
 * weekly cycle report, the audit extract, the regulatory filing pack.
 *
 * They are deliberately not dashboards. A dashboard is live and personal; a
 * report is a point-in-time document with a format, a cadence, a distribution
 * list and a retention window -- the things an auditor asks about.
 *
 * One document per report, like `rules`, so a customer edits a schedule or a
 * recipient count on its own and every count on the screen follows.
 */

export const REPORT_CATEGORIES = ['governance', 'compliance', 'commercial', 'operational'] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export const REPORT_FORMATS = ['pdf', 'xlsx', 'csv'] as const;

export type ReportFormat = (typeof REPORT_FORMATS)[number];

export const REPORT_CADENCES = ['weekly', 'monthly', 'quarterly', 'on-demand'] as const;

export type ReportCadence = (typeof REPORT_CADENCES)[number];

export const RUN_STATUSES = ['completed', 'running', 'queued', 'failed'] as const;

export type RunStatus = (typeof RUN_STATUSES)[number];

export interface ReportDefinition {
  readonly name: string;
  /** One line on what the report contains, as the queue does for a SKU. */
  readonly note: string;
  readonly icon: string;
  readonly category: ReportCategory;
  readonly format: ReportFormat;
  readonly cadence: ReportCadence;
  /** Display form of the schedule, e.g. `Mondays 08:00 GST`. */
  readonly schedule: string;
  /** Empty for an on-demand report, which has nothing queued. */
  readonly nextRun: string;
  readonly lastRun: string;
  readonly lastStatus: RunStatus;
  readonly size: string;
  readonly duration: string;
  readonly owner: string;
  /** How many people are on the distribution list. */
  readonly recipients: number;
  /** How long a produced artefact is kept before it is purged. */
  readonly retention: string;
}

export const REPORTS: readonly ReportDefinition[] = [
  {
    name: 'Weekly pricing cycle report',
    note: 'Decisions and realised impact for the closed cycle',
    icon: 'file-text',
    category: 'governance',
    format: 'pdf',
    cadence: 'weekly',
    schedule: 'Mondays 08:00 GST',
    nextRun: 'Aug 10, 08:00',
    lastRun: 'Aug 05, 08:00',
    lastStatus: 'completed',
    size: '2.4 MB',
    duration: '38s',
    owner: 'Pricing Governance',
    recipients: 24,
    retention: '24 months',
  },
  {
    name: 'Margin and guardrail compliance',
    note: 'Recommendations tested against the guardrails',
    icon: 'shield-check',
    category: 'governance',
    format: 'pdf',
    cadence: 'monthly',
    schedule: '1st of month 07:00 GST',
    nextRun: 'Sep 01, 07:00',
    lastRun: 'Aug 01, 07:00',
    lastStatus: 'completed',
    size: '1.1 MB',
    duration: '52s',
    owner: 'Finance',
    recipients: 12,
    retention: '7 years',
  },
  {
    name: 'Rule change log export',
    note: 'Proposed and approved pricing rule changes',
    icon: 'sliders-horizontal',
    category: 'governance',
    format: 'csv',
    cadence: 'weekly',
    schedule: 'Mondays 08:30 GST',
    nextRun: 'Aug 10, 08:30',
    lastRun: 'Aug 05, 08:30',
    lastStatus: 'completed',
    size: '48 KB',
    duration: '4s',
    owner: 'Pricing Governance',
    recipients: 9,
    retention: '7 years',
  },
  {
    name: 'Decision audit extract',
    note: 'Reviewer-level trail, one row per decision',
    icon: 'clock-counter-clockwise',
    category: 'compliance',
    format: 'xlsx',
    cadence: 'weekly',
    schedule: 'Mondays 09:00 GST',
    nextRun: 'Aug 10, 09:00',
    lastRun: 'Aug 05, 09:00',
    lastStatus: 'completed',
    size: '6.8 MB',
    duration: '2m 11s',
    owner: 'Internal Audit',
    recipients: 6,
    retention: '7 years',
  },
  {
    name: 'Regulatory filing pack',
    note: 'Evidence bundle for filed price commitments',
    icon: 'gavel',
    category: 'compliance',
    format: 'pdf',
    cadence: 'quarterly',
    schedule: 'Quarter start 06:00 GST',
    nextRun: 'Oct 01, 06:00',
    lastRun: 'Jul 01, 06:00',
    lastStatus: 'completed',
    size: '14.2 MB',
    duration: '6m 40s',
    owner: 'Legal & Regulatory',
    recipients: 5,
    retention: '7 years',
  },
  {
    name: 'Customer segment response',
    note: 'Offer response by UM segment, aggregated only',
    icon: 'users-three',
    category: 'compliance',
    format: 'pdf',
    cadence: 'quarterly',
    schedule: 'Quarter start 09:00 GST',
    nextRun: 'Oct 01, 09:00',
    lastRun: 'Jul 01, 09:00',
    lastStatus: 'completed',
    size: '3.6 MB',
    duration: '1m 18s',
    owner: 'Customer Insights',
    recipients: 11,
    retention: '24 months',
  },
  {
    name: 'Competitor price movement digest',
    note: 'Tracked competitor moves and the gap they opened',
    icon: 'scales',
    category: 'commercial',
    format: 'pdf',
    cadence: 'weekly',
    schedule: 'Thursdays 17:00 GST',
    nextRun: 'Aug 06, 17:00',
    lastRun: 'Jul 30, 17:00',
    lastStatus: 'completed',
    size: '1.8 MB',
    duration: '27s',
    owner: 'Commercial',
    recipients: 31,
    retention: '12 months',
  },
  {
    name: 'Revenue impact statement',
    note: 'Cumulative uplift against the no-ADPA baseline',
    icon: 'chart-line-up',
    category: 'commercial',
    format: 'xlsx',
    cadence: 'monthly',
    schedule: '1st of month 08:00 GST',
    nextRun: 'Sep 01, 08:00',
    lastRun: 'Aug 01, 08:00',
    lastStatus: 'completed',
    size: '920 KB',
    duration: '44s',
    owner: 'Finance',
    recipients: 18,
    retention: '24 months',
  },
  {
    name: 'Forecast accuracy review',
    note: 'MAPE and bias per category, with the outliers',
    icon: 'target',
    category: 'operational',
    format: 'xlsx',
    cadence: 'monthly',
    schedule: '1st of month 09:00 GST',
    nextRun: 'Sep 01, 09:00',
    lastRun: 'Aug 01, 09:00',
    lastStatus: 'failed',
    size: '—',
    duration: '1m 02s',
    owner: 'Data Science',
    recipients: 8,
    retention: '12 months',
  },
  {
    name: 'Recommendation queue snapshot',
    note: 'The open queue exactly as it stands',
    icon: 'list-checks',
    category: 'operational',
    format: 'csv',
    cadence: 'on-demand',
    schedule: 'On demand',
    nextRun: '',
    lastRun: 'Aug 06, 09:12',
    lastStatus: 'running',
    size: '—',
    duration: '—',
    owner: 'Pricing Governance',
    recipients: 3,
    retention: '90 days',
  },
];

/** One entry in the recent-run feed. */
export interface ReportRun {
  readonly report: string;
  readonly when: string;
  readonly status: RunStatus;
  /** Size and duration, or the reason a run failed. */
  readonly detail: string;
  readonly trigger: string;
}

/**
 * Scorecard values are counted from the catalogue and the run feed, so a
 * `metric` key selects the derivation and the document supplies label and trend.
 */
export const REPORT_METRICS = ['available', 'scheduled', 'runs', 'failed'] as const;

export type ReportMetric = (typeof REPORT_METRICS)[number];

export interface ReportKpiSpec {
  readonly metric: ReportMetric;
  readonly label: string;
  readonly delta: string;
  readonly direction: KpiDirection;
  readonly tone: KpiTone;
}

export interface ReportsCopy {
  readonly title: string;
  readonly chip: string;
  readonly exportLabel: string;
  readonly exportIcon: string;
  readonly exportMessage: string;
  readonly requestLabel: string;
  readonly requestIcon: string;
  readonly requestMessage: string;
  readonly notice: NoticeSpec;
  readonly kpis: readonly ReportKpiSpec[];

  readonly catalogueTitle: string;
  readonly catalogueSubtitle: string;
  readonly searchPlaceholder: string;
  readonly searchAriaLabel: string;
  /** First entry is the "no category filter" option. */
  readonly categoryFilters: readonly string[];
  readonly categoryChipPrefix: string;
  readonly searchChipPrefix: string;
  readonly columns: readonly string[];
  readonly resultsOf: string;
  readonly reportsUnit: string;
  readonly reportsUnitOne: string;
  readonly emptyMessage: string;
  readonly emptyIcon: string;

  readonly categoryLabels: Readonly<Record<ReportCategory, string>>;
  readonly formatLabels: Readonly<Record<ReportFormat, string>>;
  readonly formatIcons: Readonly<Record<ReportFormat, string>>;
  readonly statusLabels: Readonly<Record<RunStatus, string>>;
  /** Accessible name for the per-row delivery switch, joined with the name. */
  readonly deliveryAriaPrefix: string;
  readonly subscribeMessage: string;
  readonly unsubscribeMessage: string;
  readonly subscribeFailed: string;

  readonly deliveredTitle: string;
  readonly deliveredSubtitle: string;
  readonly deliveredEmpty: string;

  readonly upcomingTitle: string;
  readonly upcomingSubtitle: string;
  readonly recipientsUnit: string;

  readonly retentionTitle: string;
  readonly retentionSubtitle: string;

  readonly runsTitle: string;
  readonly runsSubtitle: string;
  readonly runs: readonly ReportRun[];
}

export const REPORTS_COPY: ReportsCopy = {
  title: 'Reports',
  chip: 'Cycle Aug 05–11 · rule set v4.2',
  exportLabel: 'Export catalogue',
  exportIcon: 'export',
  exportMessage: 'Report catalogue exported',
  requestLabel: 'Request a report',
  requestIcon: 'paper-plane-tilt',
  requestMessage: 'Request sent to Pricing Governance',
  notice: {
    severity: 'info',
    icon: 'lock-key',
    title:
      'Schedules, distribution lists and retention are managed by Admin. You can change your own delivery below.',
  },
  kpis: [
    { metric: 'available', label: 'Reports available', delta: '+1', direction: 'up', tone: '' },
    { metric: 'scheduled', label: 'Scheduled', delta: '+1', direction: 'up', tone: '' },
    { metric: 'runs', label: 'Runs this cycle', delta: '+4', direction: 'up', tone: '' },
    { metric: 'failed', label: 'Failed runs', delta: '-2', direction: 'up', tone: '' },
  ],

  catalogueTitle: 'Report catalogue',
  catalogueSubtitle:
    'Every artefact the platform produces, what it contains and when it is generated.',
  searchPlaceholder: 'Search by report, owner, format or schedule',
  searchAriaLabel: 'Search reports',
  categoryFilters: ['All', 'Governance', 'Compliance', 'Commercial', 'Operational'],
  categoryChipPrefix: 'Category: ',
  searchChipPrefix: 'Search: ',
  columns: ['Report', 'Category', 'Format', 'Schedule', 'Last run', 'Status', 'Delivery'],
  resultsOf: 'of',
  reportsUnit: 'reports',
  reportsUnitOne: 'report',
  emptyMessage: 'No reports match these filters. Clear one to widen the search.',
  emptyIcon: 'magnifying-glass',

  categoryLabels: {
    governance: 'Governance',
    compliance: 'Compliance',
    commercial: 'Commercial',
    operational: 'Operational',
  },
  formatLabels: { pdf: 'PDF', xlsx: 'XLSX', csv: 'CSV' },
  formatIcons: { pdf: 'file-pdf', xlsx: 'microsoft-excel-logo', csv: 'file-csv' },
  statusLabels: {
    completed: 'Completed',
    running: 'Running',
    queued: 'Queued',
    failed: 'Failed',
  },
  deliveryAriaPrefix: 'Deliver ',
  subscribeMessage: 'Added to your delivery list',
  unsubscribeMessage: 'Removed from your delivery list',
  subscribeFailed: 'Could not save your delivery preference',

  deliveredTitle: 'Delivered to you',
  deliveredSubtitle: 'Your own subscriptions. Everyone else on the list is set by Admin.',
  deliveredEmpty: 'Nothing is delivered to you yet. Turn on Delivery for any report above.',

  upcomingTitle: 'Upcoming runs',
  upcomingSubtitle: 'The next scheduled generation for each report.',
  recipientsUnit: 'recipients',

  retentionTitle: 'Retention',
  retentionSubtitle: 'How long a produced artefact is kept before it is purged.',

  runsTitle: 'Recent runs',
  runsSubtitle: 'The last generations across the whole catalogue.',
  runs: [
    {
      report: 'Recommendation queue snapshot',
      when: 'Aug 06, 09:12',
      status: 'running',
      detail: 'Requested by Aisha Al-Khayyat',
      trigger: 'On demand',
    },
    {
      report: 'Rule change log export',
      when: 'Aug 05, 08:30',
      status: 'completed',
      detail: '48 KB · 4s',
      trigger: 'Scheduled',
    },
    {
      report: 'Decision audit extract',
      when: 'Aug 05, 09:00',
      status: 'completed',
      detail: '6.8 MB · 2m 11s',
      trigger: 'Scheduled',
    },
    {
      report: 'Weekly pricing cycle report',
      when: 'Aug 05, 08:00',
      status: 'completed',
      detail: '2.4 MB · 38s',
      trigger: 'Scheduled',
    },
    {
      report: 'Forecast accuracy review',
      when: 'Aug 01, 09:00',
      status: 'failed',
      detail: 'Demand feed incomplete for W31',
      trigger: 'Scheduled',
    },
    {
      report: 'Revenue impact statement',
      when: 'Aug 01, 08:00',
      status: 'completed',
      detail: '920 KB · 44s',
      trigger: 'Scheduled',
    },
    {
      report: 'Margin and guardrail compliance',
      when: 'Aug 01, 07:00',
      status: 'completed',
      detail: '1.1 MB · 52s',
      trigger: 'Scheduled',
    },
  ],
};
