import { mean } from './ranges';
import { signedPp } from './boardMetrics';
import type { CycleActivity } from './cycle';
import type { KpiDirection, KpiSpec, KpiTone } from './ui';

/**
 * Every figure the home screen shows, derived from the selected cycle day.
 *
 * The screen used to hold authored numbers beside a day strip that only moved
 * a highlight. Now that the strip filters, an authored figure would be a claim
 * about a day the reader may not have selected -- so each one is computed here
 * from `analytics/cycle`, exactly as the boards compute theirs from the
 * selected window.
 */

/** Runtime list as well as a type, so a Console-edited metric id is validated. */
export const CYCLE_METRIC_IDS = [
  'pending',
  'reviewed',
  'generated',
  'overdue',
  'anomalies',
  'uplift',
] as const;

export type CycleMetricId = (typeof CYCLE_METRIC_IDS)[number];

/**
 * A home scorecard as the copy document holds it: a label and the metric it
 * names. The figure, its movement and its colour come from the data.
 */
export interface CycleKpiSpec {
  readonly label: string;
  readonly metric: CycleMetricId;
  /** Replaces the derived movement when the card carries a note instead. */
  readonly note: string;
  readonly graph: boolean;
}

/** A day the cycle has no record for: the strip still has to render it. */
export const EMPTY_ACTIVITY: CycleActivity = {
  day: '',
  generated: 0,
  reviewed: 0,
  overdue: 0,
  anomalies: 0,
  uplift: 0,
};

export const activityFor = (days: readonly CycleActivity[], day: string): CycleActivity =>
  days.find((entry) => entry.day === day) ?? EMPTY_ACTIVITY;

const count = (value: number): string => Math.round(value).toLocaleString('en-US');

const signedCount = (value: number): string =>
  `${value > 0 ? '+' : ''}${Math.round(value).toLocaleString('en-US')}`;

const signedPct1 = (value: number): string => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

interface MetricShape {
  readonly read: (activity: CycleActivity) => number;
  readonly format: (value: number) => string;
  readonly formatMovement: (value: number) => string;
  /** Which direction is the good one -- it decides the badge colour. */
  readonly betterWhen: 'higher' | 'lower';
}

const asCount = (
  read: MetricShape['read'],
  betterWhen: MetricShape['betterWhen'],
): MetricShape => ({ read, format: count, formatMovement: signedCount, betterWhen });

const METRICS: Readonly<Record<CycleMetricId, MetricShape>> = {
  // Pending is what the batch produced minus what has been actioned, so a day
  // cannot report a backlog that contradicts its own review progress.
  pending: asCount((a) => Math.max(0, a.generated - a.reviewed), 'lower'),
  reviewed: asCount((a) => a.reviewed, 'higher'),
  generated: asCount((a) => a.generated, 'higher'),
  overdue: asCount((a) => a.overdue, 'lower'),
  anomalies: asCount((a) => a.anomalies, 'lower'),
  uplift: {
    read: (a) => a.uplift,
    format: signedPct1,
    formatMovement: signedPp,
    betterWhen: 'higher',
  },
};

/** One metric, formatted the way its scorecard would show it. */
export const cycleMetricText = (metric: CycleMetricId, activity: CycleActivity): string => {
  const shape = METRICS[metric];
  return shape.format(shape.read(activity));
};

export interface CycleProgress {
  readonly done: number;
  readonly total: number;
  readonly percent: number;
}

export const progressOf = (activity: CycleActivity): CycleProgress => ({
  done: activity.reviewed,
  total: activity.generated,
  percent:
    activity.generated === 0 ? 0 : Math.round((activity.reviewed / activity.generated) * 100),
});

/**
 * The home scorecards for one day.
 *
 * The movement is measured against the cycle's own average rather than the day
 * before, because consecutive days are not comparable: yesterday is worked
 * down and today is half-reviewed, so a day-over-day delta would report how
 * far through the queue the reviewer has got, not how the day is going.
 */
export const cycleKpis = (
  specs: readonly CycleKpiSpec[],
  activity: readonly CycleActivity[],
  day: string,
): readonly KpiSpec[] => {
  const selected = activityFor(activity, day);
  return specs.map((spec) => {
    const shape = METRICS[spec.metric];
    const value = shape.read(selected);
    const movement = value - mean(activity.map(shape.read));
    const good = shape.betterWhen === 'higher' ? movement >= 0 : movement <= 0;
    return {
      label: spec.label,
      value: shape.format(value),
      // A single day is its own average, so there is no movement to report.
      delta: spec.note || (activity.length < 2 ? '' : shape.formatMovement(movement)),
      direction: (good ? 'up' : 'down') as KpiDirection,
      tone: '' as KpiTone,
      graph: spec.graph,
    };
  });
};

export const isCycleMetricId = (value: unknown): value is CycleMetricId =>
  (CYCLE_METRIC_IDS as readonly unknown[]).includes(value);
