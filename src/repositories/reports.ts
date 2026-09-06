import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firestore/db';
import { REPORT_CADENCES, REPORT_CATEGORIES, REPORT_FORMATS, RUN_STATUSES } from '@/data/reports';
import type { Parser } from '@/hooks/useFirestore';
import type { Ordered } from './recommendations';
import type {
  ReportCadence,
  ReportCategory,
  ReportDefinition,
  ReportFormat,
  RunStatus,
} from '@/data/reports';

export const REPORTS = 'reports';

/**
 * A report as stored: its definition plus the document id, which is both the
 * readable slug a customer sees in the Console and the key a delivery
 * subscription is recorded against.
 */
export type ReportRecord = ReportDefinition & { readonly id: string };

/**
 * `category`, `format`, `cadence` and `lastStatus` are validated against the
 * build's own lists: they drive filtering, grouping and which pill is drawn, so
 * a Console typo has to fail loudly rather than silently drop a report out of
 * its category.
 */
export const parseReport: Parser<Ordered<ReportRecord>> = (f, id) => ({
  id,
  order: f.number('order'),
  name: f.string('name'),
  note: f.optionalString('note', ''),
  icon: f.string('icon'),
  category: f.oneOf<ReportCategory>('category', REPORT_CATEGORIES),
  format: f.oneOf<ReportFormat>('format', REPORT_FORMATS),
  cadence: f.oneOf<ReportCadence>('cadence', REPORT_CADENCES),
  schedule: f.string('schedule'),
  // Empty for an on-demand report, which has nothing queued.
  nextRun: f.optionalString('nextRun', ''),
  lastRun: f.string('lastRun'),
  lastStatus: f.oneOf<RunStatus>('lastStatus', RUN_STATUSES),
  size: f.string('size'),
  duration: f.string('duration'),
  owner: f.string('owner'),
  recipients: f.number('recipients'),
  retention: f.string('retention'),
});

/**
 * Records which reports the signed-in person wants delivered.
 *
 * This is the only write the portal makes. It is scoped to the user's own
 * document, which `firestore.rules` has always allowed
 * (`allow read, write: if isOwner(uid)`), and it merges rather than replaces so
 * the organisational fields alongside it are left alone.
 *
 * No optimistic state is needed at the call site: Firestore applies the write
 * to its local cache first and fires the document listener immediately, so the
 * switch moves at once and the server confirms behind it. If the write is
 * rejected the cache rolls back, the listener fires again and the switch
 * returns to its previous position on its own.
 */
export const saveReportSubscriptions = (uid: string, reportIds: readonly string[]): Promise<void> =>
  setDoc(doc(db, 'users', uid), { reportSubscriptions: [...reportIds] }, { merge: true });
