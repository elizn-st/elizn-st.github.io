import { DECISION_STATUSES } from '@/data/queue';
import type { Parser } from '@/hooks/useFirestore';
import type { Ordered } from './recommendations';
import type { AuditEntry } from '@/data/history';
import type { DecisionStatus } from '@/data/queue';
import type { FilterGroup, FiltersCopy } from '@/data/filters';

export const DECISIONS = 'decisions';

/**
 * The decision audit trail: one document per entry, so entries can be queried
 * and a new decision appended without rewriting a blob.
 */
export const parseDecision: Parser<Ordered<AuditEntry>> = (f) => ({
  order: f.number('order'),
  date: f.string('date'),
  time: f.string('time'),
  sku: f.string('sku'),
  from: f.string('from'),
  to: f.string('to'),
  reason: f.string('reason'),
  reviewer: f.string('reviewer'),
  status: f.oneOf<DecisionStatus>('status', DECISION_STATUSES),
  hasComment: f.boolean('hasComment'),
});

export interface FiltersDoc {
  readonly groups: readonly FilterGroup[];
  readonly cycleOptions: readonly string[];
  readonly copy: FiltersCopy;
}

/** `config/filters`: the filter popover's groups and the cycle switch. */
export const parseFilters: Parser<FiltersDoc> = (f) => ({
  groups: f.objects('groups', (g) => ({
    label: g.string('label'),
    options: g.objects('options', (o) => ({
      label: o.string('label'),
      checked: o.boolean('checked'),
    })),
  })),
  cycleOptions: f.strings('cycleOptions'),
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    closeLabel: c.string('closeLabel'),
    deviationLabel: c.string('deviationLabel'),
    sliderName: c.string('sliderName'),
    sliderAriaLabel: c.string('sliderAriaLabel'),
    sliderMin: c.number('sliderMin'),
    sliderMax: c.number('sliderMax'),
    sliderStep: c.number('sliderStep'),
    sliderValue: c.number('sliderValue'),
    cycleLabel: c.string('cycleLabel'),
    defaultCycle: c.string('defaultCycle'),
    resetLabel: c.string('resetLabel'),
    resetMessage: c.string('resetMessage'),
    applyLabel: c.string('applyLabel'),
    applyMessage: c.string('applyMessage'),
  })),
});
