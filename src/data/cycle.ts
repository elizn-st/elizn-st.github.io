/**
 * What each day of the repricing cycle did.
 *
 * The day strip on the home screen is a filter, so every figure below it
 * describes one day. Those figures are measurements, not copy: the labels live
 * in `content/home` and the counters here, seeded to `analytics/cycle`.
 *
 * Kept apart from the derivations in `cycleMetrics.ts` for the same reason
 * `series.ts` is kept apart from `boardMetrics.ts`: the seed script imports
 * this module directly, and Node cannot resolve an extensionless value import
 * between `src/data` modules. Nothing here may import a value.
 */
export interface CycleActivity {
  /** Joins to `CycleDay.day` in the home copy document. */
  readonly day: string;
  /** Recommendations the batch produced for that day. */
  readonly generated: number;
  /** How many of them have been actioned. */
  readonly reviewed: number;
  /** Unreviewed items past their SLA -- nothing can be overdue before its day. */
  readonly overdue: number;
  readonly anomalies: number;
  /** Revenue uplift attributed to the day's decisions, in percent. */
  readonly uplift: number;
}

/**
 * Aug 05 - Aug 11. Wednesday is worked down to a handful of stragglers,
 * Thursday is today and mid-review, and the rest of the cycle is generated but
 * untouched -- which is why their `reviewed` is zero rather than missing.
 */
export const CYCLE_ACTIVITY: readonly CycleActivity[] = [
  { day: '05', generated: 164, reviewed: 158, overdue: 6, anomalies: 9, uplift: 2.4 },
  { day: '06', generated: 170, reviewed: 42, overdue: 6, anomalies: 14, uplift: 3.4 },
  { day: '07', generated: 164, reviewed: 0, overdue: 0, anomalies: 18, uplift: 3.3 },
  { day: '08', generated: 142, reviewed: 0, overdue: 0, anomalies: 15, uplift: 2.6 },
  { day: '09', generated: 136, reviewed: 0, overdue: 0, anomalies: 14, uplift: 2.4 },
  { day: '10', generated: 184, reviewed: 0, overdue: 0, anomalies: 22, uplift: 3.6 },
  { day: '11', generated: 176, reviewed: 0, overdue: 0, anomalies: 20, uplift: 3.7 },
];
