export type CycleDayState = 'past' | 'today' | '';

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

export type Severity = 'critical' | 'warning' | 'success' | 'info';

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
