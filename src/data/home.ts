import type { RouteId } from '@/routing/routeIds';
import type { KpiSpec } from './ui';

export const CYCLE_DAY_STATES = ['past', 'today'] as const;

/** '' is a real variant: a day that is neither past nor today. */
export type CycleDayState = (typeof CYCLE_DAY_STATES)[number] | '';

export interface CycleDay {
  readonly dow: string;
  readonly day: string;
  readonly state: CycleDayState;
}

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
  readonly severity: Severity;
  readonly icon: string;
  readonly title: string;
  readonly time: string;
}

export const HOME_ALERTS: readonly Alert[] = [
  {
    severity: 'critical',
    icon: 'warning-octagon',
    title: 'Stale data from CSS source > 6h',
    time: '35 minutes ago',
  },
  {
    severity: 'warning',
    icon: 'warning',
    title: 'Competitor cut price by 12%',
    time: '1 h 12 minutes ago',
  },
  {
    severity: 'warning',
    icon: 'warning',
    title: 'Competitor cut price by 12%',
    time: '1 h 12 minutes ago',
  },
  {
    severity: 'success',
    icon: 'check-circle',
    title: 'Batch cycle completed successfully',
    time: '2 h 5 minutes ago',
  },
];

export interface PlanCard {
  readonly to: RouteId;
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface HomeCopy {
  /** Joined with the signed-in user's first name, which comes from Auth. */
  readonly greetingPrefix: string;
  /** The cycle line is three parts because the range is emphasised. */
  readonly cycleIntro: string;
  readonly cycleRange: string;
  readonly cycleOutro: string;
  readonly progressTitle: string;
  readonly progressValue: string;
  readonly progressPercent: number;
  readonly planCards: readonly PlanCard[];
  readonly alertsTitle: string;
  readonly alertsLink: string;
}

export const HOME_COPY: HomeCopy = {
  greetingPrefix: 'Good morning',
  cycleIntro: 'Repricing cycle',
  cycleRange: 'Aug 05 – Aug 11',
  cycleOutro: 'completed',
  progressTitle: 'Cycle review progress',
  progressValue: '42 of 128',
  progressPercent: 33,
  planCards: [
    {
      to: 'queue',
      icon: 'list-checks',
      title: 'Recommendations',
      subtitle: '128 pending approval',
    },
    { to: 'c1', icon: 'chart-line', title: 'Dashboards', subtitle: 'Pricing & Forecast' },
  ],
  alertsTitle: 'Alerts (3)',
  alertsLink: 'See all',
};

export const HOME_KPIS: readonly KpiSpec[] = [
  {
    label: 'Pending approval',
    value: '128',
    delta: '+9.3%',
    direction: 'up',
    tone: '',
    graph: true,
  },
  { label: 'Overdue', value: '6', delta: '-2', direction: 'up', tone: '', graph: true },
  { label: 'Anomaly flags', value: '14', delta: '+5', direction: 'down', tone: '', graph: true },
  {
    label: 'Revenue uplift, week',
    value: '+3.4%',
    delta: '+0.8pp',
    direction: 'up',
    tone: '',
    graph: true,
  },
];
