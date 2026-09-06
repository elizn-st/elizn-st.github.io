import type { RouteId } from '@/routing/routeIds';
import type { CycleKpiSpec, CycleMetricId } from './cycleMetrics';

export const CYCLE_DAY_STATES = ['past', 'today'] as const;

/** '' is a real variant: a day that is neither past nor today. */
export type CycleDayState = (typeof CYCLE_DAY_STATES)[number] | '';

export interface CycleDay {
  readonly dow: string;
  readonly day: string;
  readonly state: CycleDayState;
}

/**
 * The strip at the top of the home screen. Only the labels and the state live
 * here -- what each day actually did is in `analytics/cycle`, joined on `day`.
 */
export const CYCLE_DAYS: readonly CycleDay[] = [
  { dow: 'Wed', day: '05', state: 'past' },
  { dow: 'Thu', day: '06', state: 'today' },
  { dow: 'Fri', day: '07', state: '' },
  { dow: 'Sat', day: '08', state: '' },
  { dow: 'Sun', day: '09', state: '' },
  { dow: 'Mon', day: '10', state: '' },
  { dow: 'Tue', day: '11', state: '' },
];

export const SEVERITIES = ['critical', 'warning', 'success', 'info'] as const;

export type Severity = (typeof SEVERITIES)[number];

export interface Alert {
  /** The cycle day this was raised on; the strip filters the panel by it. */
  readonly day: string;
  readonly severity: Severity;
  readonly icon: string;
  readonly title: string;
  readonly time: string;
}

/**
 * Alerts across the whole cycle, not just today.
 *
 * Today's read as elapsed time because that is how a reader sees them; the
 * other days carry a clock time, because "35 minutes ago" is meaningless on a
 * day that has not happened. Sat 08 and Tue 11 have none, which is a state the
 * panel has to render rather than an omission.
 */
export const HOME_ALERTS: readonly Alert[] = [
  {
    day: '05',
    severity: 'warning',
    icon: 'warning',
    title: 'Competitor B undercut Tablets by 6%',
    time: 'Wed 15:40',
  },
  {
    day: '05',
    severity: 'success',
    icon: 'check-circle',
    title: 'Cycle batch for Wed 05 closed with 158 of 164 reviewed',
    time: 'Wed 19:05',
  },
  {
    day: '06',
    severity: 'critical',
    icon: 'warning-octagon',
    title: 'Stale data from CSS source > 6h',
    time: '35 minutes ago',
  },
  {
    day: '06',
    severity: 'warning',
    icon: 'warning',
    title: 'Competitor cut price by 12%',
    time: '1 h 12 minutes ago',
  },
  {
    day: '06',
    severity: 'warning',
    icon: 'warning',
    title: 'Six recommendations passed their approval SLA',
    time: '1 h 40 minutes ago',
  },
  {
    day: '06',
    severity: 'success',
    icon: 'check-circle',
    title: 'Batch cycle completed successfully',
    time: '2 h 5 minutes ago',
  },
  {
    day: '07',
    severity: 'warning',
    icon: 'warning',
    title: 'Margin floor review due for Accessories',
    time: 'Fri 09:00',
  },
  {
    day: '09',
    severity: 'info',
    icon: 'info',
    title: 'Weekend feeds run on a reduced cadence',
    time: 'Sun 08:00',
  },
  {
    day: '10',
    severity: 'warning',
    icon: 'warning',
    title: "Competitor A's promo window opens",
    time: 'Mon 10:30',
  },
];

export interface PlanCard {
  readonly to: RouteId;
  readonly icon: string;
  readonly title: string;
  /**
   * Prefixed to the subtitle when set, so the card counts the selected day
   * rather than repeating a number authored for one particular day.
   */
  readonly metric: CycleMetricId | '';
  readonly subtitle: string;
}

export interface HomeCopy {
  /** Joined with the signed-in user's first name, which comes from Auth. */
  readonly greetingPrefix: string;
  /** The cycle line is assembled in parts because the range is emphasised. */
  readonly cycleIntro: string;
  readonly cycleRange: string;
  /** How the selected day is described, chosen by its state. */
  readonly dayPastLabel: string;
  readonly dayTodayLabel: string;
  readonly dayUpcomingLabel: string;
  /** Accessible name for the day strip, which is a control and not a legend. */
  readonly cycleDaysLabel: string;
  readonly progressTitle: string;
  /** Joins the two halves of "42 of 170". */
  readonly progressJoin: string;
  /** What the scorecards measure the selected day against. */
  readonly compareLabel: string;
  readonly planCards: readonly PlanCard[];
  readonly alertsTitle: string;
  /** Shown on a day that raised nothing. */
  readonly alertsEmpty: string;
  readonly alertsLink: string;
}

export const HOME_COPY: HomeCopy = {
  greetingPrefix: 'Good morning',
  cycleIntro: 'Repricing cycle',
  cycleRange: 'Aug 05 – Aug 11',
  dayPastLabel: 'completed',
  dayTodayLabel: 'in progress',
  dayUpcomingLabel: 'scheduled',
  cycleDaysLabel: 'Cycle days',
  progressTitle: 'Cycle review progress',
  progressJoin: 'of',
  compareLabel: 'vs cycle average',
  planCards: [
    {
      to: 'queue',
      icon: 'list-checks',
      title: 'Recommendations',
      metric: 'pending',
      subtitle: 'pending approval',
    },
    {
      to: 'c1',
      icon: 'chart-line',
      title: 'Dashboards',
      metric: '',
      subtitle: 'Pricing & Forecast',
    },
  ],
  alertsTitle: 'Alerts',
  alertsEmpty: 'No alerts for this day',
  alertsLink: 'See all',
};

export const HOME_KPIS: readonly CycleKpiSpec[] = [
  { label: 'Pending approval', metric: 'pending', note: '', graph: true },
  { label: 'Overdue', metric: 'overdue', note: '', graph: true },
  { label: 'Anomaly flags', metric: 'anomalies', note: '', graph: true },
  { label: 'Revenue uplift', metric: 'uplift', note: '', graph: true },
];
