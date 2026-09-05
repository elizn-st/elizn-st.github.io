import { DECISION_STATUSES } from '@/data/queue';
import type { Parser } from '@/hooks/useFirestore';
import type { DecisionStatus, QueueRow } from '@/data/queue';

export const RECOMMENDATIONS = 'recommendations';

/**
 * Firestore returns documents in no guaranteed order, and these lists are
 * authored rather than alphabetical, so position is stored explicitly and the
 * app sorts on it.
 */
export type Ordered<T> = T & { readonly order: number };

export const byOrder = <T>(rows: readonly Ordered<T>[]): readonly T[] =>
  [...rows].sort((a, b) => a.order - b.order);

/**
 * Shapes stay `QueueRow` from src/data/queue.ts, so screens keep the type they
 * already use and the mock modules remain the single definition of the domain.
 *
 * `note` is optional because it is blank for most rows, and a customer
 * clearing the field in the Console removes it rather than setting "".
 */
export const parseRecommendation: Parser<Ordered<QueueRow>> = (f) => ({
  order: f.number('order'),
  sku: f.string('sku'),
  note: f.optionalString('note', ''),
  current: f.number('current'),
  recommended: f.number('recommended'),
  delta: f.number('delta'),
  topFactor: f.string('topFactor'),
  status: f.oneOf<DecisionStatus>('status', DECISION_STATUSES),
});
