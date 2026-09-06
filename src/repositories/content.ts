import { CYCLE_DAY_STATES, SEVERITIES } from '@/data/home';
import { DECISION_STATUSES } from '@/data/queue';
import { PERMISSION_STATES } from '@/data/profile';
import { COMPARISON_TONES } from '@/data/simulator';
import { BREADCRUMB_IDS, DASHBOARD_TAB_IDS } from '@/data/navigation';
import { RULE_ENFORCEMENTS, RULE_METRICS, RULE_STAGES, RULE_STATUSES } from '@/data/rules';
import { REPORT_CATEGORIES, REPORT_FORMATS, REPORT_METRICS, RUN_STATUSES } from '@/data/reports';
import { ACCOUNT_STATUSES, ADMIN_METRICS, PORTAL_ROLES } from '@/data/admin';
import { ROUTE_IDS } from '@/routing/routeIds';
import { KPI_DIRECTIONS, KPI_TONES } from '@/data/ui';
import { readActions, readChartCopy, readKpis, readLegend, readNotice, readPagination } from './ui';
import type { Parser } from '@/hooks/useFirestore';
import type { Alert, CycleDay, HomeCopy, PlanCard, Severity } from '@/data/home';
import type { DecisionStatus, QueueCopy } from '@/data/queue';
import type { HistoryCopy } from '@/data/history';
import type {
  DetailCopy,
  FactorContribution,
  GuardrailBand,
  HistoryPreviewEntry,
} from '@/data/detail';
import {
  NOTIFICATION_TAB_IDS,
  type NotificationGroup,
  type NotificationTab,
  type NotificationTabId,
  type NotificationsCopy,
} from '@/data/notifications';
import type { ChatCopy, ChatSession } from '@/data/chat';
import type {
  DeviceSession,
  NotificationPreference,
  Permission,
  ProfileCopy,
} from '@/data/profile';
import type { SearchCopy, SearchGroup } from '@/data/search';
import type { ComparisonRow, ComparisonTone, ScenarioInput, SimulatorCopy } from '@/data/simulator';
import type {
  AccessChange,
  AccountStatus,
  AdminCopy,
  AdminKpiSpec,
  AdminMetric,
  PortalRole,
  RoleCopy,
} from '@/data/admin';
import type {
  ReportCategory,
  ReportFormat,
  ReportKpiSpec,
  ReportMetric,
  ReportRun,
  ReportsCopy,
  RunStatus,
} from '@/data/reports';
import type {
  RuleChange,
  RuleEnforcement,
  RuleKpiSpec,
  RuleMetric,
  RuleStage,
  RuleStageCopy,
  RuleStatus,
  RulesCopy,
} from '@/data/rules';
import type {
  Breadcrumb,
  BreadcrumbId,
  DashboardTab,
  DashboardTabId,
  NavEntry,
  NavigationCopy,
} from '@/data/navigation';
import type { ChromeCopy } from '@/data/chrome';
import type { UserProfile } from '@/data/identity';
import type { KpiSpec } from '@/data/ui';
import type { RouteId } from '@/routing/routeIds';

/**
 * The `content/*` documents: one per screen. Each is read whole, so it is one
 * document rather than a collection -- Firestore bills per document read and
 * none of this is queried by field.
 *
 * Every shape is the interface already declared in src/data, so screens keep
 * the types they compile against today.
 */

export interface HomeDoc {
  readonly cycleDays: readonly CycleDay[];
  readonly alerts: readonly Alert[];
  readonly copy: HomeCopy;
  readonly kpis: readonly KpiSpec[];
}

const readPlanCards = (f: FieldReaderLike): readonly PlanCard[] =>
  f.objects('planCards', (c) => ({
    // A plan card navigates, so its target has to be a route in this build.
    to: c.oneOf<RouteId>('to', ROUTE_IDS),
    icon: c.string('icon'),
    title: c.string('title'),
    subtitle: c.string('subtitle'),
  }));

type FieldReaderLike = Parameters<Parser<unknown>>[0];

export const parseHome: Parser<HomeDoc> = (f) => ({
  cycleDays: f.objects('cycleDays', (d) => ({
    dow: d.string('dow'),
    day: d.string('day'),
    state: d.oneOfOrEmpty('state', CYCLE_DAY_STATES),
  })),
  alerts: f.objects('alerts', (a) => ({
    severity: a.oneOf<Severity>('severity', SEVERITIES),
    icon: a.string('icon'),
    title: a.string('title'),
    time: a.string('time'),
  })),
  copy: f.object('copy', (c) => ({
    greetingPrefix: c.string('greetingPrefix'),
    cycleIntro: c.string('cycleIntro'),
    cycleRange: c.string('cycleRange'),
    cycleOutro: c.string('cycleOutro'),
    progressTitle: c.string('progressTitle'),
    progressValue: c.string('progressValue'),
    progressPercent: c.number('progressPercent'),
    planCards: readPlanCards(c),
    alertsTitle: c.string('alertsTitle'),
    alertsLink: c.string('alertsLink'),
  })),
  kpis: readKpis(f, 'kpis'),
});

export interface QueueDoc {
  readonly copy: QueueCopy;
}

export const parseQueue: Parser<QueueDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    exportLabel: c.string('exportLabel'),
    exportMessage: c.string('exportMessage'),
    approveLabel: c.string('approveLabel'),
    rejectLabel: c.string('rejectLabel'),
    emptySelectionMessage: c.string('emptySelectionMessage'),
    searchPlaceholder: c.string('searchPlaceholder'),
    searchAriaLabel: c.string('searchAriaLabel'),
    selectAllLabel: c.string('selectAllLabel'),
    appliedFilters: c.strings('appliedFilters'),
    resultsCount: c.string('resultsCount'),
    columns: c.strings('columns'),
    pagination: readPagination(c, 'pagination'),
  })),
});

export interface HistoryDoc {
  readonly copy: HistoryCopy;
  readonly kpis: readonly KpiSpec[];
}

export const parseHistoryScreen: Parser<HistoryDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    exportLabel: c.string('exportLabel'),
    exportMessage: c.string('exportMessage'),
    searchPlaceholder: c.string('searchPlaceholder'),
    searchAriaLabel: c.string('searchAriaLabel'),
    statusFilters: c.strings('statusFilters'),
    defaultStatusFilter: c.string('defaultStatusFilter'),
    appliedFilters: c.strings('appliedFilters'),
    resultsCount: c.string('resultsCount'),
    columns: c.strings('columns'),
    commentTitle: c.string('commentTitle'),
    pagination: readPagination(c, 'pagination'),
  })),
  kpis: readKpis(f, 'kpis'),
});

export interface DetailDoc {
  readonly factorContributions: readonly FactorContribution[];
  readonly historyPreview: readonly HistoryPreviewEntry[];
  readonly reasonCodes: readonly string[];
  readonly guardrails: { readonly value: number; readonly floor: number; readonly ceiling: number };
  readonly copy: DetailCopy;
}

const readGuardrailBands = (f: FieldReaderLike): readonly GuardrailBand[] =>
  f.objects('guardrailBands', (b) => ({ label: b.string('label'), color: b.string('color') }));

export const parseDetail: Parser<DetailDoc> = (f) => ({
  factorContributions: f.objects('factorContributions', (c) => ({
    name: c.string('name'),
    value: c.number('value'),
  })),
  historyPreview: f.objects('historyPreview', (h) => ({
    date: h.string('date'),
    reason: h.string('reason'),
    status: h.oneOf<DecisionStatus>('status', DECISION_STATUSES),
    hasComment: h.boolean('hasComment'),
  })),
  reasonCodes: f.strings('reasonCodes'),
  guardrails: f.object('guardrails', (g) => ({
    value: g.number('value'),
    floor: g.number('floor'),
    ceiling: g.number('ceiling'),
  })),
  copy: f.object('copy', (c) => ({
    icon: c.string('icon'),
    title: c.string('title'),
    chips: c.strings('chips'),
    currentLabel: c.string('currentLabel'),
    currentValue: c.string('currentValue'),
    recommendedLabel: c.string('recommendedLabel'),
    recommendedValue: c.string('recommendedValue'),
    deltaValue: c.string('deltaValue'),
    priceChart: readChartCopy(c, 'priceChart'),
    priceLegend: readLegend(c, 'priceLegend'),
    simCardTitle: c.string('simCardTitle'),
    simCardSubtitle: c.string('simCardSubtitle'),
    guardrailTitle: c.string('guardrailTitle'),
    guardrailBands: readGuardrailBands(c),
    factorTitle: c.string('factorTitle'),
    decisionTitle: c.string('decisionTitle'),
    reasonLabel: c.string('reasonLabel'),
    commentLabel: c.string('commentLabel'),
    commentPlaceholder: c.string('commentPlaceholder'),
    decisionActions: readActions(c, 'decisionActions'),
    historyTitle: c.string('historyTitle'),
    historyBadge: c.string('historyBadge'),
    historyAriaLabel: c.string('historyAriaLabel'),
  })),
});

export interface NotificationsDoc {
  readonly groups: readonly NotificationGroup[];
  readonly tabs: readonly NotificationTab[];
  readonly copy: NotificationsCopy;
}

export const parseNotifications: Parser<NotificationsDoc> = (f) => ({
  groups: f.objects('groups', (g) => ({
    label: g.string('label'),
    items: g.objects('items', (i) => ({
      severity: i.oneOf<Severity>('severity', SEVERITIES),
      icon: i.string('icon'),
      title: i.string('title'),
      body: i.string('body'),
      time: i.string('time'),
      unread: i.boolean('unread'),
    })),
  })),
  tabs: f.objects('tabs', (t) => ({
    // The id drives the filter, so an unknown one fails here rather than
    // quietly rendering a tab that matches nothing.
    id: t.oneOf<NotificationTabId>('id', NOTIFICATION_TAB_IDS),
    label: t.string('label'),
  })),
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    unreadLabel: c.string('unreadLabel'),
    totalLabel: c.string('totalLabel'),
    markAllLabel: c.string('markAllLabel'),
    markAllIcon: c.string('markAllIcon'),
    markAllMessage: c.string('markAllMessage'),
    emptyMessage: c.string('emptyMessage'),
    emptyIcon: c.string('emptyIcon'),
    closeLabel: c.string('closeLabel'),
  })),
});

export interface ChatDoc {
  readonly sessions: readonly ChatSession[];
  readonly suggestedPrompts: readonly string[];
  readonly deviationRows: readonly { readonly sku: string; readonly delta: number }[];
  readonly copy: ChatCopy;
}

export const parseChat: Parser<ChatDoc> = (f) => ({
  sessions: f.objects('sessions', (s) => ({
    title: s.string('title'),
    date: s.string('date'),
    subtitle: s.string('subtitle'),
    active: s.boolean('active'),
  })),
  suggestedPrompts: f.strings('suggestedPrompts'),
  deviationRows: f.objects('deviationRows', (r) => ({
    sku: r.string('sku'),
    delta: r.number('delta'),
  })),
  copy: f.object('copy', (c) => ({
    question: c.string('question'),
    questionTime: c.string('questionTime'),
    answerIntro: c.string('answerIntro'),
    answerEmphasis: c.string('answerEmphasis'),
    answerRest: c.string('answerRest'),
    deviationColumns: c.strings('deviationColumns'),
    answerActions: readActions(c, 'answerActions'),
    answerSource: c.string('answerSource'),
    replyBody: c.string('replyBody'),
    replySource: c.string('replySource'),
    composerPlaceholder: c.string('composerPlaceholder'),
    composerAriaLabel: c.string('composerAriaLabel'),
    sendAriaLabel: c.string('sendAriaLabel'),
    sidebarTitle: c.string('sidebarTitle'),
    newLabel: c.string('newLabel'),
    newMessage: c.string('newMessage'),
    sidebarSearchPlaceholder: c.string('sidebarSearchPlaceholder'),
    sidebarSearchAriaLabel: c.string('sidebarSearchAriaLabel'),
  })),
});

export interface ProfileDoc {
  readonly permissions: readonly Permission[];
  readonly notificationPreferences: readonly NotificationPreference[];
  readonly deviceSessions: readonly DeviceSession[];
  readonly copy: ProfileCopy;
  readonly kpis: readonly KpiSpec[];
}

export const parseProfile: Parser<ProfileDoc> = (f) => ({
  permissions: f.objects('permissions', (p) => ({
    title: p.string('title'),
    subtitle: p.string('subtitle'),
    state: p.oneOf('state', PERMISSION_STATES),
  })),
  notificationPreferences: f.objects('notificationPreferences', (p) => ({
    title: p.string('title'),
    subtitle: p.string('subtitle'),
    enabled: p.boolean('enabled'),
  })),
  deviceSessions: f.objects('deviceSessions', (d) => ({
    icon: d.string('icon'),
    title: d.string('title'),
    subtitle: d.string('subtitle'),
    when: d.string('when'),
    current: d.boolean('current'),
  })),
  copy: f.object('copy', (c) => ({
    editLabel: c.string('editLabel'),
    editIcon: c.string('editIcon'),
    editMessage: c.string('editMessage'),
    signOutLabel: c.string('signOutLabel'),
    signOutIcon: c.string('signOutIcon'),
    personalTitle: c.string('personalTitle'),
    fullNameLabel: c.string('fullNameLabel'),
    jobTitleLabel: c.string('jobTitleLabel'),
    departmentLabel: c.string('departmentLabel'),
    workEmailLabel: c.string('workEmailLabel'),
    timeZoneLabel: c.string('timeZoneLabel'),
    languageLabel: c.string('languageLabel'),
    timeZones: c.strings('timeZones'),
    languages: c.strings('languages'),
    saveLabel: c.string('saveLabel'),
    saveMessage: c.string('saveMessage'),
    preferencesTitle: c.string('preferencesTitle'),
    preferencesSubtitle: c.string('preferencesSubtitle'),
    permissionsTitle: c.string('permissionsTitle'),
    permissionsSubtitle: c.string('permissionsSubtitle'),
    allowedLabel: c.string('allowedLabel'),
    deniedLabel: c.string('deniedLabel'),
    sessionsTitle: c.string('sessionsTitle'),
    revokeLabel: c.string('revokeLabel'),
    revokeMessage: c.string('revokeMessage'),
    signOutEverywhereLabel: c.string('signOutEverywhereLabel'),
    signOutEverywhereMessage: c.string('signOutEverywhereMessage'),
  })),
  kpis: readKpis(f, 'kpis'),
});

export interface SearchDoc {
  readonly groups: readonly SearchGroup[];
  readonly copy: SearchCopy;
}

export const parseSearch: Parser<SearchDoc> = (f) => ({
  groups: f.objects('groups', (g) => ({
    label: g.string('label'),
    // `route` must name a route that exists in this build; a Console typo here
    // would otherwise produce a search result that navigates nowhere.
    entries: g.objects('entries', (e) => ({
      icon: e.string('icon'),
      label: e.string('label'),
      meta: e.string('meta'),
      route: e.oneOf<RouteId>('route', ROUTE_IDS),
    })),
  })),
  copy: f.object('copy', (c) => ({
    placeholder: c.string('placeholder'),
    ariaLabel: c.string('ariaLabel'),
    escKey: c.string('escKey'),
    emptyPrefix: c.string('emptyPrefix'),
    emptyHint: c.string('emptyHint'),
    navigateHint: c.string('navigateHint'),
    openHint: c.string('openHint'),
    indexedLabel: c.string('indexedLabel'),
  })),
});

export interface SimulatorDoc {
  readonly scenarioInputs: readonly ScenarioInput[];
  readonly comparisonRows: readonly ComparisonRow[];
  readonly copy: SimulatorCopy;
  readonly kpis: readonly KpiSpec[];
}

export const parseSimulator: Parser<SimulatorDoc> = (f) => ({
  scenarioInputs: f.objects('scenarioInputs', (s) => ({
    name: s.string('name'),
    min: s.number('min'),
    max: s.number('max'),
    value: s.number('value'),
  })),
  comparisonRows: f.objects('comparisonRows', (r) => ({
    metric: r.string('metric'),
    current: r.string('current'),
    recommendation: r.string('recommendation'),
    scenario: r.string('scenario'),
    recommendationTone: r.oneOfOrEmpty<ComparisonTone>('recommendationTone', COMPARISON_TONES),
    scenarioTone: r.oneOfOrEmpty<ComparisonTone>('scenarioTone', COMPARISON_TONES),
  })),
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    submitLabel: c.string('submitLabel'),
    submitIcon: c.string('submitIcon'),
    submitMessage: c.string('submitMessage'),
    inputsTitle: c.string('inputsTitle'),
    forecastTitle: c.string('forecastTitle'),
    comparisonTitle: c.string('comparisonTitle'),
    columns: c.strings('columns'),
  })),
  kpis: readKpis(f, 'kpis'),
});

export interface RulesDoc {
  readonly copy: RulesCopy;
}

/** A label per member of a small union, read as a required entry each. */
const readLabels = <T extends string>(
  f: FieldReaderLike,
  field: string,
  keys: readonly T[],
): Record<T, string> =>
  f.object(field, (o) => {
    const labels = {} as Record<T, string>;
    for (const key of keys) labels[key] = o.string(key);
    return labels;
  });

const readRuleKpis = (f: FieldReaderLike): readonly RuleKpiSpec[] =>
  f.objects('kpis', (k) => ({
    // The value is counted from the rules collection; `metric` picks which count.
    metric: k.oneOf<RuleMetric>('metric', RULE_METRICS),
    label: k.string('label'),
    delta: k.optionalString('delta', ''),
    direction: k.oneOfOrEmpty('direction', KPI_DIRECTIONS),
    tone: k.oneOfOrEmpty('tone', KPI_TONES),
  }));

const readStages = (f: FieldReaderLike): readonly RuleStageCopy[] =>
  f.objects('stages', (s) => ({
    key: s.oneOf<RuleStage>('key', RULE_STAGES),
    title: s.string('title'),
    description: s.string('description'),
  }));

const readChangeLog = (f: FieldReaderLike): readonly RuleChange[] =>
  f.objects('changeLog', (c) => ({
    date: c.string('date'),
    rule: c.string('rule'),
    change: c.string('change'),
    requester: c.string('requester'),
    status: c.oneOf<DecisionStatus>('status', DECISION_STATUSES),
  }));

export const parseRules: Parser<RulesDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    exportLabel: c.string('exportLabel'),
    exportIcon: c.string('exportIcon'),
    exportMessage: c.string('exportMessage'),
    proposeLabel: c.string('proposeLabel'),
    proposeIcon: c.string('proposeIcon'),
    proposeMessage: c.string('proposeMessage'),
    notice: readNotice(c, 'notice'),
    kpis: readRuleKpis(c),

    tableTitle: c.string('tableTitle'),
    tableSubtitle: c.string('tableSubtitle'),
    searchPlaceholder: c.string('searchPlaceholder'),
    searchAriaLabel: c.string('searchAriaLabel'),
    statusFilters: c.strings('statusFilters'),
    statusChipPrefix: c.string('statusChipPrefix'),
    searchChipPrefix: c.string('searchChipPrefix'),
    columns: c.strings('columns'),
    resultsOf: c.string('resultsOf'),
    rulesUnit: c.string('rulesUnit'),
    rulesUnitOne: c.string('rulesUnitOne'),
    emptyMessage: c.string('emptyMessage'),
    emptyIcon: c.string('emptyIcon'),

    enforcementLabels: readLabels<RuleEnforcement>(c, 'enforcementLabels', RULE_ENFORCEMENTS),
    enforcementIcons: readLabels<RuleEnforcement>(c, 'enforcementIcons', RULE_ENFORCEMENTS),
    statusLabels: readLabels<RuleStatus>(c, 'statusLabels', RULE_STATUSES),

    bindingTitle: c.string('bindingTitle'),
    bindingSubtitle: c.string('bindingSubtitle'),

    stagesTitle: c.string('stagesTitle'),
    stagesSubtitle: c.string('stagesSubtitle'),
    stages: readStages(c),

    coverageTitle: c.string('coverageTitle'),
    coverageSubtitle: c.string('coverageSubtitle'),
    coverageHardTitle: c.string('coverageHardTitle'),
    coverageSoftTitle: c.string('coverageSoftTitle'),

    changeLogTitle: c.string('changeLogTitle'),
    changeLogSubtitle: c.string('changeLogSubtitle'),
    changeLog: readChangeLog(c),
  })),
});

export interface NavigationDoc {
  readonly copy: NavigationCopy;
}

export const parseNavigation: Parser<NavigationDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    // Labels and icons are free text; ids name routes and tabs that must exist
    // in the bundle, so both are validated against the build's own lists.
    navItems: c.objects<NavEntry>('navItems', (n) => ({
      id: n.oneOf<RouteId>('id', ROUTE_IDS),
      label: n.string('label'),
      icon: n.string('icon'),
      disabled: n.optionalBoolean('disabled', false),
    })),
    dashboardTabs: c.objects<DashboardTab>('dashboardTabs', (t) => ({
      id: t.oneOf<DashboardTabId>('id', DASHBOARD_TAB_IDS),
      label: t.string('label'),
    })),
    breadcrumbs: c.object('breadcrumbs', (all) => {
      const crumbs = {} as Record<BreadcrumbId, Breadcrumb>;
      for (const id of BREADCRUMB_IDS) {
        crumbs[id] = all.object(id, (b) => ({
          section: b.optionalString('section', ''),
          page: b.string('page'),
        }));
      }
      return crumbs;
    }),
    notFound: c.object('notFound', (n) => ({
      page: n.string('page'),
      titlePrefix: n.string('titlePrefix'),
      titleSuffix: n.string('titleSuffix'),
      bodyPrefix: n.string('bodyPrefix'),
      bodySuffix: n.string('bodySuffix'),
      homeLabel: n.string('homeLabel'),
      reloadLabel: n.string('reloadLabel'),
    })),
    logoMark: c.string('logoMark'),
    logoWord: c.string('logoWord'),
    collapseLabel: c.string('collapseLabel'),
    openMenuLabel: c.string('openMenuLabel'),
    backLabel: c.string('backLabel'),
    searchLabel: c.string('searchLabel'),
    analystLabel: c.string('analystLabel'),
    notificationsLabel: c.string('notificationsLabel'),
  })),
});

export interface ChromeDoc {
  readonly copy: ChromeCopy;
}

export const parseChrome: Parser<ChromeDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    scoreLabel: c.string('scoreLabel'),
    lastUpdated: c.string('lastUpdated'),
    expandLabel: c.string('expandLabel'),
    moreFiltersLabel: c.string('moreFiltersLabel'),
    legendLead: c.string('legendLead'),
    removeLabel: c.string('removeLabel'),
    previousLabel: c.string('previousLabel'),
    nextLabel: c.string('nextLabel'),
    ellipsis: c.string('ellipsis'),
  })),
});

export interface ReportsDoc {
  readonly copy: ReportsCopy;
}

const readReportKpis = (f: FieldReaderLike): readonly ReportKpiSpec[] =>
  f.objects('kpis', (k) => ({
    // The value is counted from the catalogue; `metric` picks which count.
    metric: k.oneOf<ReportMetric>('metric', REPORT_METRICS),
    label: k.string('label'),
    delta: k.optionalString('delta', ''),
    direction: k.oneOfOrEmpty('direction', KPI_DIRECTIONS),
    tone: k.oneOfOrEmpty('tone', KPI_TONES),
  }));

const readRuns = (f: FieldReaderLike): readonly ReportRun[] =>
  f.objects('runs', (r) => ({
    report: r.string('report'),
    when: r.string('when'),
    status: r.oneOf<RunStatus>('status', RUN_STATUSES),
    detail: r.string('detail'),
    trigger: r.string('trigger'),
  }));

export const parseReports: Parser<ReportsDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    exportLabel: c.string('exportLabel'),
    exportIcon: c.string('exportIcon'),
    exportMessage: c.string('exportMessage'),
    requestLabel: c.string('requestLabel'),
    requestIcon: c.string('requestIcon'),
    requestMessage: c.string('requestMessage'),
    notice: readNotice(c, 'notice'),
    kpis: readReportKpis(c),

    catalogueTitle: c.string('catalogueTitle'),
    catalogueSubtitle: c.string('catalogueSubtitle'),
    searchPlaceholder: c.string('searchPlaceholder'),
    searchAriaLabel: c.string('searchAriaLabel'),
    categoryFilters: c.strings('categoryFilters'),
    categoryChipPrefix: c.string('categoryChipPrefix'),
    searchChipPrefix: c.string('searchChipPrefix'),
    columns: c.strings('columns'),
    resultsOf: c.string('resultsOf'),
    reportsUnit: c.string('reportsUnit'),
    reportsUnitOne: c.string('reportsUnitOne'),
    emptyMessage: c.string('emptyMessage'),
    emptyIcon: c.string('emptyIcon'),

    categoryLabels: readLabels<ReportCategory>(c, 'categoryLabels', REPORT_CATEGORIES),
    formatLabels: readLabels<ReportFormat>(c, 'formatLabels', REPORT_FORMATS),
    formatIcons: readLabels<ReportFormat>(c, 'formatIcons', REPORT_FORMATS),
    statusLabels: readLabels<RunStatus>(c, 'statusLabels', RUN_STATUSES),
    deliveryAriaPrefix: c.string('deliveryAriaPrefix'),
    subscribeMessage: c.string('subscribeMessage'),
    unsubscribeMessage: c.string('unsubscribeMessage'),
    subscribeFailed: c.string('subscribeFailed'),

    deliveredTitle: c.string('deliveredTitle'),
    deliveredSubtitle: c.string('deliveredSubtitle'),
    deliveredEmpty: c.string('deliveredEmpty'),

    upcomingTitle: c.string('upcomingTitle'),
    upcomingSubtitle: c.string('upcomingSubtitle'),
    recipientsUnit: c.string('recipientsUnit'),

    retentionTitle: c.string('retentionTitle'),
    retentionSubtitle: c.string('retentionSubtitle'),

    runsTitle: c.string('runsTitle'),
    runsSubtitle: c.string('runsSubtitle'),
    runs: readRuns(c),
  })),
});

export interface AdminDoc {
  readonly copy: AdminCopy;
}

const readAdminKpis = (f: FieldReaderLike): readonly AdminKpiSpec[] =>
  f.objects('kpis', (k) => ({
    // The value is counted from the directory; `metric` picks which count.
    metric: k.oneOf<AdminMetric>('metric', ADMIN_METRICS),
    label: k.string('label'),
    delta: k.optionalString('delta', ''),
    direction: k.oneOfOrEmpty('direction', KPI_DIRECTIONS),
    tone: k.oneOfOrEmpty('tone', KPI_TONES),
  }));

const readRoles = (f: FieldReaderLike): readonly RoleCopy[] =>
  f.objects('roles', (r) => ({
    key: r.oneOf<PortalRole>('key', PORTAL_ROLES),
    title: r.string('title'),
    description: r.string('description'),
    icon: r.string('icon'),
  }));

const readAccessChanges = (f: FieldReaderLike): readonly AccessChange[] =>
  f.objects('changes', (c) => ({
    date: c.string('date'),
    person: c.string('person'),
    change: c.string('change'),
    actor: c.string('actor'),
    status: c.oneOf<AccountStatus>('status', ACCOUNT_STATUSES),
  }));

export const parseAdmin: Parser<AdminDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    title: c.string('title'),
    chip: c.string('chip'),
    exportLabel: c.string('exportLabel'),
    exportIcon: c.string('exportIcon'),
    exportMessage: c.string('exportMessage'),
    requestLabel: c.string('requestLabel'),
    requestIcon: c.string('requestIcon'),
    requestMessage: c.string('requestMessage'),
    noticeMember: readNotice(c, 'noticeMember'),
    noticeAdmin: readNotice(c, 'noticeAdmin'),
    kpis: readAdminKpis(c),

    directoryTitle: c.string('directoryTitle'),
    directorySubtitle: c.string('directorySubtitle'),
    searchPlaceholder: c.string('searchPlaceholder'),
    searchAriaLabel: c.string('searchAriaLabel'),
    statusFilters: c.strings('statusFilters'),
    statusChipPrefix: c.string('statusChipPrefix'),
    roleChipPrefix: c.string('roleChipPrefix'),
    searchChipPrefix: c.string('searchChipPrefix'),
    columns: c.strings('columns'),
    resultsOf: c.string('resultsOf'),
    peopleUnit: c.string('peopleUnit'),
    peopleUnitOne: c.string('peopleUnitOne'),
    emptyMessage: c.string('emptyMessage'),
    emptyIcon: c.string('emptyIcon'),

    roleLabels: readLabels<PortalRole>(c, 'roleLabels', PORTAL_ROLES),
    statusLabels: readLabels<AccountStatus>(c, 'statusLabels', ACCOUNT_STATUSES),
    portalClaimLabel: c.string('portalClaimLabel'),
    adminClaimLabel: c.string('adminClaimLabel'),
    noClaimLabel: c.string('noClaimLabel'),
    neverLabel: c.string('neverLabel'),
    youLabel: c.string('youLabel'),
    invitedNotSignedUp: c.string('invitedNotSignedUp'),

    accessTitle: c.string('accessTitle'),
    accessSubtitle: c.string('accessSubtitle'),
    accessUnknown: c.string('accessUnknown'),
    accessPortalTitle: c.string('accessPortalTitle'),
    accessPortalNote: c.string('accessPortalNote'),
    accessAdminTitle: c.string('accessAdminTitle'),
    accessAdminNote: c.string('accessAdminNote'),
    accessGranted: c.string('accessGranted'),
    accessWithheld: c.string('accessWithheld'),

    rolesTitle: c.string('rolesTitle'),
    rolesSubtitle: c.string('rolesSubtitle'),
    roles: readRoles(c),

    departmentsTitle: c.string('departmentsTitle'),
    departmentsSubtitle: c.string('departmentsSubtitle'),

    changesTitle: c.string('changesTitle'),
    changesSubtitle: c.string('changesSubtitle'),
    changes: readAccessChanges(c),
  })),
});

/** `users/{uid}`: the signed-in person's own organisational details. */
/**
 * Every field is optional. The document is created the first time someone
 * changes a delivery preference, which can happen before anyone has filled in
 * their organisational details -- so a document holding only subscriptions has
 * to parse, and the blank fields simply render blank.
 */
export const parseUserProfile: Parser<UserProfile> = (f) => ({
  initials: f.optionalString('initials', ''),
  jobTitle: f.optionalString('jobTitle', ''),
  department: f.optionalString('department', ''),
  focus: f.optionalString('focus', ''),
  employeeId: f.optionalString('employeeId', ''),
  location: f.optionalString('location', ''),
  reportSubscriptions: f.optionalStrings('reportSubscriptions'),
});
