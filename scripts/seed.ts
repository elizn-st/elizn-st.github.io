/**
 * Seeds Firestore from the mock modules in src/data.
 *
 * The mocks are imported directly rather than transcribed, so there is exactly
 * one definition of this content and the seed cannot drift from the types the
 * app compiles against. Node runs TypeScript natively, so this needs no build
 * step and no tsx.
 *
 *   npm run seed              # the local emulator (default)
 *   npm run seed -- --prod    # the project aliased `prod` in .firebaserc
 *
 * Writes are idempotent: document ids are derived from content, and every
 * write is a `set`, so re-running converges rather than duplicating.
 *
 * Against the emulator no credentials are needed. Against a real project the
 * Admin SDK needs a service account -- see the README.
 */
import { readFileSync } from 'node:fs';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

import { QUEUE_COPY, QUEUE_ROWS } from '../src/data/queue.ts';
import { AUDIT_LOG, HISTORY_COPY, HISTORY_KPIS } from '../src/data/history.ts';
import { CYCLE_DAYS, HOME_ALERTS, HOME_COPY, HOME_KPIS } from '../src/data/home.ts';
import {
  DETAIL_COPY,
  FACTOR_CONTRIBUTIONS,
  GUARDRAILS,
  HISTORY_PREVIEW,
  REASON_CODES,
} from '../src/data/detail.ts';
import {
  CATEGORY_PRICES,
  CHART_CONFIG,
  COMBO_WEEKS,
  ELASTICITY_BARS,
  FORECAST_SERIES,
  IMPACT_SERIES,
  PRICE_HISTORY,
  WEEK_LABELS,
} from '../src/data/series.ts';
import {
  CATEGORY_PERFORMANCE,
  COMPETITOR_FEED,
  FORECAST_QUALITY,
  GAP_ANALYSIS,
  SEGMENT_BEHAVIOUR,
  SOURCE_FRESHNESS,
} from '../src/data/dashboards.ts';
import {
  NOTIFICATION_GROUPS,
  NOTIFICATION_TABS,
  NOTIFICATIONS_COPY,
} from '../src/data/notifications.ts';
import { CHAT_COPY, CHAT_SESSIONS, DEVIATION_ROWS, SUGGESTED_PROMPTS } from '../src/data/chat.ts';
import {
  DEVICE_SESSIONS,
  NOTIFICATION_PREFERENCES,
  PERMISSIONS,
  PROFILE_COPY,
  PROFILE_KPIS,
} from '../src/data/profile.ts';
import { SEARCH_COPY, SEARCH_INDEX } from '../src/data/search.ts';
import {
  COMPARISON_ROWS,
  SCENARIO_INPUTS,
  SIMULATOR_COPY,
  SIMULATOR_KPIS,
} from '../src/data/simulator.ts';
import { CYCLE_FILTER_OPTIONS, FILTER_GROUPS, FILTERS_COPY } from '../src/data/filters.ts';
import { PRICING_RULES, RULES_COPY } from '../src/data/rules.ts';
import { NAVIGATION_COPY } from '../src/data/navigation.ts';
import { BOARDS_COPY } from '../src/data/boards.ts';
import { CHART_DETAILS_COPY } from '../src/data/chartDetails.ts';
import { CHROME_COPY } from '../src/data/chrome.ts';
import { SEED_USER_DISPLAY_NAME, SEED_USER_EMAIL, USER_PROFILE } from '../src/data/identity.ts';
import type { PaginationSpec } from '../src/data/ui.ts';

const EMULATOR_HOST = '127.0.0.1:8080';
const AUTH_EMULATOR_HOST = '127.0.0.1:9099';

/** Readable, stable document ids -- a customer editing in the Console sees
 *  `iphone-15-pro-256gb`, not an opaque auto-id. */
const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

const toProd = process.argv.includes('--prod');

const projectId = (() => {
  if (!toProd) return 'demo-adpa';
  const rc = JSON.parse(readFileSync(new URL('../.firebaserc', import.meta.url), 'utf8')) as {
    projects?: Record<string, string>;
  };
  const id = rc.projects?.prod;
  if (!id) throw new Error('No "prod" alias in .firebaserc. Run: firebase use --add');
  return id;
})();

if (!toProd) {
  // Set before initializeApp so the Admin SDK targets the emulator and skips
  // credential discovery entirely.
  process.env.FIRESTORE_EMULATOR_HOST ??= EMULATOR_HOST;
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= AUTH_EMULATOR_HOST;
} else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error(
    'Seeding a real project needs a service account key.\n' +
      '  Firebase Console -> Project settings -> Service accounts -> Generate new private key\n' +
      '  then: GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run seed -- --prod\n' +
      '(service-account*.json is gitignored -- it is a real credential, unlike the web config)',
  );
}

initializeApp(toProd ? { projectId, credential: applicationDefault() } : { projectId });
const db = getFirestore();

/**
 * Firestore arrays are typed per element, so the pager's mixed
 * `[1, 2, 'dots', 17]` is stored as strings and parsed back on read.
 */
const pagination = (spec: PaginationSpec) => ({
  pages: spec.pages.map(String),
  active: spec.active,
});

/** Firestore has no array-of-arrays, so an authored table row becomes an object. */
const tableRows = (rows: readonly (readonly string[])[]) => rows.map((cells) => ({ cells }));

/**
 * One document per row, so each can be queried and edited individually.
 *
 * `order` is added because Firestore has no inherent document order and these
 * lists are authored, not alphabetical -- the queue reads iPhone, Samsung,
 * AirPods..., and the audit log is newest-first. The app sorts on this field
 * client-side rather than with orderBy: these collections are a handful of
 * documents, and a Console edit that dropped the field would be silently
 * excluded by orderBy, where a client-side sort reports it as malformed.
 */
const perDocument = {
  recommendations: QUEUE_ROWS.map((row, order) => [slug(row.sku), { ...row, order }] as const),
  decisions: AUDIT_LOG.map(
    (entry, order) =>
      [slug(`${entry.date} ${entry.time} ${entry.sku}`), { ...entry, order }] as const,
  ),
  rules: PRICING_RULES.map((rule, order) => [slug(rule.name), { ...rule, order }] as const),
};

/**
 * Documents that are always read whole. Firestore bills per document read, and
 * nothing here is queried by field, so a chart series or a screen's copy is one
 * document rather than one per data point.
 */
const wholeDocuments = {
  'analytics/series': {
    weekLabels: WEEK_LABELS,
    comboWeeks: COMBO_WEEKS,
    categoryPrices: CATEGORY_PRICES,
    priceHistory: PRICE_HISTORY,
    forecastSeries: FORECAST_SERIES,
    impactSeries: IMPACT_SERIES,
    elasticityBars: ELASTICITY_BARS,
    chartConfig: CHART_CONFIG,
  },
  'analytics/dashboards': {
    categoryPerformance: CATEGORY_PERFORMANCE,
    competitorFeed: COMPETITOR_FEED,
    sourceFreshness: SOURCE_FRESHNESS,
    gapAnalysis: GAP_ANALYSIS,
    forecastQuality: FORECAST_QUALITY,
    segmentBehaviour: SEGMENT_BEHAVIOUR,
  },
  'content/home': {
    cycleDays: CYCLE_DAYS,
    alerts: HOME_ALERTS,
    copy: HOME_COPY,
    kpis: HOME_KPIS,
  },
  'content/queue': {
    copy: { ...QUEUE_COPY, pagination: pagination(QUEUE_COPY.pagination) },
  },
  'content/history': {
    copy: { ...HISTORY_COPY, pagination: pagination(HISTORY_COPY.pagination) },
    kpis: HISTORY_KPIS,
  },
  'content/detail': {
    factorContributions: FACTOR_CONTRIBUTIONS,
    historyPreview: HISTORY_PREVIEW,
    reasonCodes: REASON_CODES,
    guardrails: GUARDRAILS,
    copy: DETAIL_COPY,
  },
  'content/notifications': {
    groups: NOTIFICATION_GROUPS,
    tabs: NOTIFICATION_TABS,
    copy: NOTIFICATIONS_COPY,
  },
  'content/chat': {
    sessions: CHAT_SESSIONS,
    suggestedPrompts: SUGGESTED_PROMPTS,
    deviationRows: DEVIATION_ROWS,
    copy: CHAT_COPY,
  },
  'content/profile': {
    permissions: PERMISSIONS,
    notificationPreferences: NOTIFICATION_PREFERENCES,
    deviceSessions: DEVICE_SESSIONS,
    copy: PROFILE_COPY,
    kpis: PROFILE_KPIS,
  },
  'content/search': { groups: SEARCH_INDEX, copy: SEARCH_COPY },
  'content/simulator': {
    scenarioInputs: SCENARIO_INPUTS,
    comparisonRows: COMPARISON_ROWS,
    copy: SIMULATOR_COPY,
    kpis: SIMULATOR_KPIS,
  },
  'content/rules': { copy: RULES_COPY },
  'content/navigation': { copy: NAVIGATION_COPY },
  'content/boards': { copy: BOARDS_COPY },
  'content/chartDetails': {
    copy: {
      ...CHART_DETAILS_COPY,
      charts: Object.fromEntries(
        Object.entries(CHART_DETAILS_COPY.charts).map(([key, chart]) => [
          key,
          { ...chart, rows: tableRows(chart.rows) },
        ]),
      ),
    },
  },
  'content/chrome': { copy: CHROME_COPY },
  'config/filters': {
    groups: FILTER_GROUPS,
    cycleOptions: CYCLE_FILTER_OPTIONS,
    copy: FILTERS_COPY,
  },
};

/** Firestore rejects `undefined` and readonly arrays need copying to plain ones. */
const plain = <T>(value: T): unknown => JSON.parse(JSON.stringify(value)) as unknown;

async function run(): Promise<void> {
  console.log(`Seeding ${projectId}${toProd ? '' : ' (emulator)'}\n`);

  const batch = db.batch();
  let writes = 0;

  for (const [collection, entries] of Object.entries(perDocument)) {
    for (const [id, value] of entries) {
      batch.set(db.collection(collection).doc(id), plain(value) as Record<string, unknown>);
      writes += 1;
    }
    console.log(`  ${collection.padEnd(24)} ${entries.length} documents`);
  }

  for (const [path, value] of Object.entries(wholeDocuments)) {
    batch.set(db.doc(path), plain(value) as Record<string, unknown>);
    writes += 1;
    const fields = Object.keys(value).length;
    console.log(`  ${path.padEnd(24)} 1 document, ${fields} fields`);
  }

  await batch.commit();
  console.log(`\nCommitted ${writes} writes.`);

  await seedUser();
}

/**
 * The portal reads the signed-in person's name and email from Firebase Auth
 * and everything else from `users/{uid}`, so this needs the account to exist
 * first. It is not fatal if it does not: the app renders those fields blank
 * and this can be re-run once the account is created.
 */
async function seedUser(): Promise<void> {
  const auth = getAuth();
  const user = await auth.getUserByEmail(SEED_USER_EMAIL).catch(() => null);

  if (!user) {
    console.log(
      `\nSkipped users/{uid}: no account for ${SEED_USER_EMAIL} on ${projectId}.\n` +
        '  Create it (Console -> Authentication -> Add user), then re-run this seed.',
    );
    return;
  }

  // Auth owns the display name; the document owns the rest.
  if (user.displayName !== SEED_USER_DISPLAY_NAME) {
    await auth.updateUser(user.uid, { displayName: SEED_USER_DISPLAY_NAME });
    console.log(`\nSet Auth displayName for ${SEED_USER_EMAIL} to "${SEED_USER_DISPLAY_NAME}".`);
  }

  await db.doc(`users/${user.uid}`).set(plain(USER_PROFILE) as Record<string, unknown>);
  console.log(
    `  users/${user.uid.slice(0, 8)}…        1 document, ${Object.keys(USER_PROFILE).length} fields`,
  );
}

await run();
