import { collection, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createConverter } from '@/lib/firestore/converter';
import { useFirestoreCollection } from '@/hooks/useFirestore';
import { DECISION_STATUSES } from '@/data/queue';
import type { DecisionStatus, QueueRow } from '@/data/queue';
import type { CollectionState, Parser } from '@/hooks/useFirestore';

export const RECOMMENDATIONS = 'recommendations';

/**
 * Reference implementation for the mock migration: the shape stays `QueueRow`
 * from src/data/queue.ts, so screens keep the type they already use and the
 * mocks stay the single definition of the domain.
 *
 * `note` is optional because it is blank for most rows, and a customer
 * clearing a field in the Console removes it rather than setting "".
 */
export const parseRecommendation: Parser<QueueRow> = (fields) => ({
  sku: fields.string('sku'),
  note: fields.optionalString('note', ''),
  current: fields.number('current'),
  recommended: fields.number('recommended'),
  delta: fields.number('delta'),
  topFactor: fields.string('topFactor'),
  status: fields.oneOf<DecisionStatus>('status', DECISION_STATUSES),
});

/** Read-only on purpose: authored by the seed script and the Firebase Console. */
export const recommendationConverter = createConverter<QueueRow>({
  parse: parseRecommendation,
});

/**
 * Live recommendations, optionally narrowed to one status.
 *
 * The `orderBy('sku')` plus a `where` on status needs no composite index
 * (Firestore covers single-field-equality + one order-by automatically). Adding
 * a second filter later will, and the emulator prints the exact index to paste
 * into firestore.indexes.json.
 */
export function useRecommendations(status?: DecisionStatus): CollectionState<QueueRow> {
  return useFirestoreCollection(
    () => {
      const base = collection(db, RECOMMENDATIONS);
      return status
        ? query(base, where('status', '==', status), orderBy('sku'))
        : query(base, orderBy('sku'));
    },
    parseRecommendation,
    [status],
  );
}
