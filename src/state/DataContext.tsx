import { createContext, useContext, useMemo } from 'react';
import { collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firestore/db';
import { useFirestoreCollection, useFirestoreDoc } from '@/hooks/useFirestore';
import { byOrder, parseRecommendation, RECOMMENDATIONS } from '@/repositories/recommendations';
import { DECISIONS, parseDecision, parseFilters } from '@/repositories/decisions';
import { parseDashboards, parseSeries } from '@/repositories/analytics';
import { parseBoards, parseChartDetails } from '@/repositories/boards';
import { parsePricingRule, RULES } from '@/repositories/rules';
import { parseReport, REPORTS } from '@/repositories/reports';
import { parsePerson, PEOPLE } from '@/repositories/admin';
import {
  parseChat,
  parseChrome,
  parseDetail,
  parseHistoryScreen,
  parseHome,
  parseNavigation,
  parseNotifications,
  parseProfile,
  parseAdmin,
  parseQueue,
  parseReports,
  parseRules,
  parseSearch,
  parseSimulator,
  parseUserProfile,
} from '@/repositories/content';
import { useAuth } from '@/state/AuthContext';
import { Icon } from '@/components/common/Icon';
import { NotificationRow } from '@/components/common/NotificationRow';
import type { ReactNode } from 'react';
import type { DocumentState } from '@/hooks/useFirestore';
import type { QueueRow } from '@/data/queue';
import type { AuditEntry } from '@/data/history';
import type { RuleRecord } from '@/repositories/rules';
import type { ReportRecord } from '@/repositories/reports';
import type { PersonRecord } from '@/repositories/admin';
import type { AuthClaims } from '@/auth/types';
import type { DashboardsDoc, SeriesDoc } from '@/repositories/analytics';
import type { BoardsDoc, ChartDetailsDoc } from '@/repositories/boards';
import type { FiltersDoc } from '@/repositories/decisions';
import type {
  ChatDoc,
  ChromeDoc,
  DetailDoc,
  HistoryDoc,
  HomeDoc,
  NavigationDoc,
  NotificationsDoc,
  ProfileDoc,
  AdminDoc,
  QueueDoc,
  ReportsDoc,
  RulesDoc,
  SearchDoc,
  SimulatorDoc,
} from '@/repositories/content';

/**
 * Every screen's content, loaded once and provided synchronously.
 *
 * The alternative -- each screen owning its own request and skeleton -- would
 * mean a dozen independent loading states for a few kilobytes of data, and
 * would change what every screen renders. Gating once here keeps screens
 * reading plain values, so their markup is unchanged from the version that
 * read the static modules.
 */
export interface PortalData {
  readonly recommendations: readonly QueueRow[];
  readonly decisions: readonly AuditEntry[];
  /** The guardrail rules themselves; `rules` below is the screen's copy. */
  readonly pricingRules: readonly RuleRecord[];
  /** The report catalogue; `reports` below is the screen's copy. */
  readonly catalogue: readonly ReportRecord[];
  /** The access directory; `admin` below is the screen's copy. */
  readonly people: readonly PersonRecord[];
  readonly series: SeriesDoc;
  readonly dashboards: DashboardsDoc;
  readonly home: HomeDoc;
  readonly queue: QueueDoc;
  readonly history: HistoryDoc;
  readonly detail: DetailDoc;
  readonly notifications: NotificationsDoc;
  readonly chat: ChatDoc;
  readonly profile: ProfileDoc;
  readonly search: SearchDoc;
  readonly simulator: SimulatorDoc;
  readonly rules: RulesDoc;
  readonly reports: ReportsDoc;
  readonly admin: AdminDoc;
  readonly navigation: NavigationDoc;
  readonly boards: BoardsDoc;
  readonly chartDetails: ChartDetailsDoc;
  readonly chrome: ChromeDoc;
  readonly filters: FiltersDoc;
  readonly identity: Identity;
}

/**
 * Who is signed in, assembled from the two places that know.
 *
 * Firebase Auth owns the account -- uid, email, display name -- and
 * `users/{uid}` owns the organisational details Auth has no field for. The
 * derived lines are composed here so no screen has to know the format.
 */
export interface Identity {
  readonly uid: string;
  readonly email: string;
  readonly fullName: string;
  readonly firstName: string;
  readonly initials: string;
  readonly jobTitle: string;
  readonly department: string;
  /** "Finance · Senior Analyst" */
  readonly roleLine: string;
  /** "Finance · Senior Analyst · Pricing governance" */
  readonly headline: string;
  readonly employeeId: string;
  readonly location: string;
  /** Report ids this person has chosen to receive. */
  readonly reportSubscriptions: readonly string[];
  /**
   * The custom claims on this session's ID token -- the same ones the security
   * rules evaluate. `null` until the token has been read.
   */
  readonly claims: AuthClaims | null;
}

/** First letters of the first two words: the fallback when no profile exists. */
const initialsFrom = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const DataContext = createContext<PortalData | null>(null);

const isPermissionDenied = (error: Error | null): boolean =>
  (error as { code?: string } | null)?.code === 'permission-denied';

export function DataProvider({ children }: { readonly children: ReactNode }) {
  const { state } = useAuth();
  const user = state.user;
  const uid = user?.uid ?? '';

  // Collections come back unordered and are sorted on their stored `order`.
  const recommendations = useFirestoreCollection(
    () => collection(db, RECOMMENDATIONS),
    parseRecommendation,
    [],
  );
  const decisions = useFirestoreCollection(() => collection(db, DECISIONS), parseDecision, []);
  const pricingRules = useFirestoreCollection(() => collection(db, RULES), parsePricingRule, []);
  const catalogue = useFirestoreCollection(() => collection(db, REPORTS), parseReport, []);
  const people = useFirestoreCollection(() => collection(db, PEOPLE), parsePerson, []);

  const series = useFirestoreDoc(() => doc(db, 'analytics/series'), parseSeries, []);
  const dashboards = useFirestoreDoc(() => doc(db, 'analytics/dashboards'), parseDashboards, []);
  const home = useFirestoreDoc(() => doc(db, 'content/home'), parseHome, []);
  const queue = useFirestoreDoc(() => doc(db, 'content/queue'), parseQueue, []);
  const history = useFirestoreDoc(() => doc(db, 'content/history'), parseHistoryScreen, []);
  const detail = useFirestoreDoc(() => doc(db, 'content/detail'), parseDetail, []);
  const notifications = useFirestoreDoc(
    () => doc(db, 'content/notifications'),
    parseNotifications,
    [],
  );
  const chat = useFirestoreDoc(() => doc(db, 'content/chat'), parseChat, []);
  const profile = useFirestoreDoc(() => doc(db, 'content/profile'), parseProfile, []);
  const search = useFirestoreDoc(() => doc(db, 'content/search'), parseSearch, []);
  const simulator = useFirestoreDoc(() => doc(db, 'content/simulator'), parseSimulator, []);
  const rules = useFirestoreDoc(() => doc(db, 'content/rules'), parseRules, []);
  const reports = useFirestoreDoc(() => doc(db, 'content/reports'), parseReports, []);
  const admin = useFirestoreDoc(() => doc(db, 'content/admin'), parseAdmin, []);
  const navigation = useFirestoreDoc(() => doc(db, 'content/navigation'), parseNavigation, []);
  const boards = useFirestoreDoc(() => doc(db, 'content/boards'), parseBoards, []);
  const chartDetails = useFirestoreDoc(
    () => doc(db, 'content/chartDetails'),
    parseChartDetails,
    [],
  );
  const chrome = useFirestoreDoc(() => doc(db, 'content/chrome'), parseChrome, []);
  const filters = useFirestoreDoc(() => doc(db, 'config/filters'), parseFilters, []);

  // Keyed on the uid so signing in as someone else resubscribes.
  const userProfile = useFirestoreDoc(() => doc(db, 'users', uid), parseUserProfile, [uid]);

  const documents = useMemo(
    () =>
      ({
        'analytics/series': series,
        'analytics/dashboards': dashboards,
        'content/home': home,
        'content/queue': queue,
        'content/history': history,
        'content/detail': detail,
        'content/notifications': notifications,
        'content/chat': chat,
        'content/profile': profile,
        'content/search': search,
        'content/simulator': simulator,
        'content/rules': rules,
        'content/reports': reports,
        'content/admin': admin,
        'content/navigation': navigation,
        'content/boards': boards,
        'content/chartDetails': chartDetails,
        'content/chrome': chrome,
        'config/filters': filters,
      }) as Record<string, DocumentState<unknown>>,
    [
      series,
      dashboards,
      home,
      queue,
      history,
      detail,
      notifications,
      chat,
      profile,
      search,
      simulator,
      rules,
      reports,
      admin,
      navigation,
      boards,
      chartDetails,
      chrome,
      filters,
    ],
  );

  /**
   * The signed-in user's own document is optional: a newly provisioned account
   * has none until someone fills it in, and that should show blank fields
   * rather than block the portal or borrow another person's details.
   */
  const identity = useMemo<Identity>(() => {
    const fullName = user?.displayName ?? '';
    const own = userProfile.data;
    const department = own?.department ?? '';
    const jobTitle = own?.jobTitle ?? '';
    const focus = own?.focus ?? '';
    const roleLine = [department, jobTitle].filter(Boolean).join(' · ');
    return {
      uid,
      email: user?.email ?? '',
      fullName,
      firstName: fullName.split(/\s+/)[0] ?? '',
      // `||`, not `??`: an absent field parses to '' rather than undefined,
      // and an empty stored value should still fall back to the derived one.
      initials: own?.initials || initialsFrom(fullName),
      jobTitle,
      department,
      roleLine,
      headline: [roleLine, focus].filter(Boolean).join(' · '),
      employeeId: own?.employeeId ?? '',
      location: own?.location ?? '',
      reportSubscriptions: own?.reportSubscriptions ?? [],
      claims: user?.claims ?? null,
    };
  }, [uid, user?.displayName, user?.email, user?.claims, userProfile.data]);

  const diagnosis = useMemo(() => {
    const everything = [
      recommendations,
      decisions,
      pricingRules,
      catalogue,
      people,
      ...Object.values(documents),
      userProfile,
    ];

    const denied = everything.some((s) => s.status === 'error' && isPermissionDenied(s.error));
    if (denied) return { kind: 'denied' as const };

    const errors = everything
      .filter((s) => s.status === 'error')
      .map((s) => s.error?.message ?? 'unknown error');

    // A document that resolves but does not exist is a seeding problem, not a
    // transient one -- worth naming, because the screen would otherwise render
    // blank with no explanation. The per-user document is exempt: absent is a
    // valid state for it.
    const absent = Object.entries(documents)
      .filter(([, s]) => s.status === 'ready' && s.missing)
      .map(([path]) => `${path} does not exist`);

    const problems = [...errors, ...absent];
    if (problems.length) return { kind: 'error' as const, problems };
    if (everything.some((s) => s.status === 'loading')) return { kind: 'loading' as const };
    return { kind: 'ready' as const };
  }, [recommendations, decisions, pricingRules, catalogue, people, documents, userProfile]);

  const value = useMemo<PortalData | null>(() => {
    if (diagnosis.kind !== 'ready') return null;
    return {
      recommendations: byOrder(recommendations.data),
      decisions: byOrder(decisions.data),
      pricingRules: byOrder(pricingRules.data),
      catalogue: byOrder(catalogue.data),
      people: byOrder(people.data),
      series: series.data!,
      dashboards: dashboards.data!,
      home: home.data!,
      queue: queue.data!,
      history: history.data!,
      detail: detail.data!,
      notifications: notifications.data!,
      chat: chat.data!,
      profile: profile.data!,
      search: search.data!,
      simulator: simulator.data!,
      rules: rules.data!,
      reports: reports.data!,
      admin: admin.data!,
      navigation: navigation.data!,
      boards: boards.data!,
      chartDetails: chartDetails.data!,
      chrome: chrome.data!,
      filters: filters.data!,
      identity,
    };
  }, [
    diagnosis.kind,
    recommendations.data,
    decisions.data,
    pricingRules.data,
    catalogue.data,
    people.data,
    series.data,
    dashboards.data,
    home.data,
    queue.data,
    history.data,
    detail.data,
    notifications.data,
    chat.data,
    profile.data,
    search.data,
    simulator.data,
    rules.data,
    reports.data,
    admin.data,
    navigation.data,
    boards.data,
    chartDetails.data,
    chrome.data,
    filters.data,
    identity,
  ]);

  if (diagnosis.kind === 'denied') return <NotProvisioned />;
  if (diagnosis.kind === 'error') return <DataUnavailable problems={diagnosis.problems} />;

  // Reuses the auth splash: same role, the moment before the app can render.
  if (!value) {
    return (
      <div className="auth-splash">
        <span className="logo auth-splash-mark">
          <span className="logo-mark">e&amp;</span>
          <span className="logo-word">ADPA</span>
        </span>
      </div>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Signed in, but without the `portalAccess` claim the rules require. This is
 * the expected state for a newly registered account: sign-up is open, access
 * is granted separately.
 */
function NotProvisioned() {
  const { state, signOut } = useAuth();
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <span className="logo">
            <span className="logo-mark">e&amp;</span>
            <span className="logo-word">ADPA</span>
          </span>
        </div>
        <div className="auth-head">
          <h1 className="page-title">Access pending</h1>
          <p className="page-sub">
            {state.user?.email} is signed in but has not been granted access to the portal.
          </p>
        </div>
        <div className="auth-alert">
          <NotificationRow
            severity="warning"
            icon="lock-key"
            title="Ask your administrator to provision this account."
          />
        </div>
        <button
          className="btn btn-primary auth-submit"
          type="button"
          onClick={() => void signOut()}
        >
          <Icon name="sign-out" /> Sign out
        </button>
      </div>
    </div>
  );
}

function DataUnavailable({ problems }: { readonly problems: readonly string[] }) {
  const { signOut } = useAuth();
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <span className="logo">
            <span className="logo-mark">e&amp;</span>
            <span className="logo-word">ADPA</span>
          </span>
        </div>
        <div className="auth-head">
          <h1 className="page-title">Content unavailable</h1>
          <p className="page-sub">The portal could not load its content.</p>
        </div>
        <div className="auth-alert">
          {problems.slice(0, 3).map((problem) => (
            <NotificationRow
              key={problem}
              severity="critical"
              icon="warning-octagon"
              title={problem}
            />
          ))}
        </div>
        <button
          className="btn btn-primary auth-submit"
          type="button"
          onClick={() => void signOut()}
        >
          <Icon name="sign-out" /> Sign out
        </button>
      </div>
    </div>
  );
}

/** Always returns loaded data: DataProvider does not render children until it has. */
export function usePortalData(): PortalData {
  const value = useContext(DataContext);
  if (!value) throw new Error('usePortalData must be used inside <DataProvider>');
  return value;
}
