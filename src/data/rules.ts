import type { DecisionStatus } from './queue';
import type { KpiDirection, KpiTone, NoticeSpec } from './ui';

/**
 * Pricing rules are the guardrails the engine must satisfy before a
 * recommendation reaches the review queue. They are the reason a recommendation
 * carries "Margin protection guardrail" as a reason code, and the reason the
 * detail screen's gauge has a floor and a ceiling at all.
 *
 * One document per rule, like `recommendations` and `decisions`: a rule is an
 * individually addressable thing a customer edits on its own in the Console,
 * and the whole page -- table, stage counts, coverage, binding bars and every
 * scorecard -- is derived from the collection, so one edit moves all of them
 * together.
 */

/**
 * The engine's constraint pipeline, in the order it is applied. Precedence is
 * the governance point: a regulatory floor beats a margin floor, which beats a
 * competitor parity target, so a rule cannot be understood without knowing
 * where in this list it sits.
 *
 * A runtime list as well as a type, so a Console-edited stage can be validated.
 */
export const RULE_STAGES = [
  'legal',
  'margin',
  'band',
  'velocity',
  'parity',
  'promo',
  'rounding',
] as const;

export type RuleStage = (typeof RULE_STAGES)[number];

/** Hard rules cannot be overridden by a reviewer; soft rules can. */
export const RULE_ENFORCEMENTS = ['hard', 'soft'] as const;

export type RuleEnforcement = (typeof RULE_ENFORCEMENTS)[number];

export const RULE_STATUSES = ['active', 'draft', 'paused'] as const;

export type RuleStatus = (typeof RULE_STATUSES)[number];

export interface PricingRule {
  readonly name: string;
  /** Short qualifier under the name, as the queue does for a SKU. */
  readonly note: string;
  readonly icon: string;
  readonly stage: RuleStage;
  /** Categories or SKUs the rule applies to; counted individually for coverage. */
  readonly scopes: readonly string[];
  /** Display form of the constraint, e.g. `>= 12.0% margin`. */
  readonly threshold: string;
  readonly enforcement: RuleEnforcement;
  readonly status: RuleStatus;
  /** Recommendations this rule constrained this cycle. */
  readonly bindings: number;
  /**
   * Recommendations it rejected outright. Summed across rules this counts
   * block *events*, not distinct recommendations -- two rules can block the
   * same one -- which is why the scorecard says "Guardrail blocks".
   */
  readonly blocked: number;
  readonly owner: string;
  readonly updated: string;
}

export const PRICING_RULES: readonly PricingRule[] = [
  {
    name: 'Regulatory price commitment',
    note: 'Filed positions may not move without a new filing',
    icon: 'gavel',
    stage: 'legal',
    scopes: ['All categories'],
    threshold: 'Filing required',
    enforcement: 'hard',
    status: 'active',
    bindings: 4,
    blocked: 4,
    owner: 'Legal & Regulatory',
    updated: 'Jun 02, 2026',
  },
  {
    name: 'Category margin floor — Smartphones',
    note: 'Blended net margin after promotional cost',
    icon: 'percent',
    stage: 'margin',
    scopes: ['Smartphones'],
    threshold: '≥ 12.0% margin',
    enforcement: 'hard',
    status: 'active',
    bindings: 11,
    blocked: 3,
    owner: 'Finance',
    updated: 'Jul 28, 2026',
  },
  {
    name: 'Category margin floor — Accessories',
    note: 'Blended net margin after promotional cost',
    icon: 'percent',
    stage: 'margin',
    scopes: ['Accessories'],
    threshold: '≥ 22.0% margin',
    enforcement: 'hard',
    status: 'active',
    bindings: 6,
    blocked: 1,
    owner: 'Finance',
    updated: 'Jul 28, 2026',
  },
  {
    name: 'Portfolio margin guardrail',
    note: 'Cycle level, across every approved decision',
    icon: 'chart-pie-slice',
    stage: 'margin',
    scopes: ['All categories'],
    threshold: '≥ 15.5% blended',
    enforcement: 'soft',
    status: 'active',
    bindings: 2,
    blocked: 0,
    owner: 'Finance',
    updated: 'Aug 01, 2026',
  },
  {
    name: 'Absolute price band — flagship handsets',
    note: 'Matches the guardrail gauge on recommendation detail',
    icon: 'arrows-out-line-vertical',
    stage: 'band',
    scopes: ['Smartphones'],
    threshold: 'AED 3,400 – 4,100',
    enforcement: 'hard',
    status: 'active',
    bindings: 9,
    blocked: 2,
    owner: 'Category Management',
    updated: 'Jul 15, 2026',
  },
  {
    name: 'Absolute price band — wearables',
    note: 'Floor protects the entry price point',
    icon: 'arrows-out-line-vertical',
    stage: 'band',
    scopes: ['Wearables'],
    threshold: 'AED 690 – 1,450',
    enforcement: 'hard',
    status: 'active',
    bindings: 3,
    blocked: 0,
    owner: 'Category Management',
    updated: 'Jul 15, 2026',
  },
  {
    name: 'Maximum move per cycle',
    note: 'Protects customers from week-to-week price whiplash',
    icon: 'speedometer',
    stage: 'velocity',
    scopes: ['All categories'],
    threshold: '±8.0% per cycle',
    enforcement: 'hard',
    status: 'active',
    bindings: 7,
    blocked: 2,
    owner: 'Pricing Governance',
    updated: 'May 20, 2026',
  },
  {
    name: 'Consecutive decrease limit',
    note: 'No more than two cuts in successive cycles',
    icon: 'trend-down',
    stage: 'velocity',
    scopes: ['All categories'],
    threshold: '≤ 2 cycles',
    enforcement: 'soft',
    status: 'active',
    bindings: 3,
    blocked: 0,
    owner: 'Pricing Governance',
    updated: 'May 20, 2026',
  },
  {
    name: 'Competitor parity band',
    note: 'Target position against Competitor A and Competitor B',
    icon: 'scales',
    stage: 'parity',
    scopes: ['Smartphones', 'Tablets'],
    threshold: '−2.0% to +5.0%',
    enforcement: 'soft',
    status: 'active',
    bindings: 12,
    blocked: 1,
    owner: 'Commercial',
    updated: 'Aug 03, 2026',
  },
  {
    name: 'Match-on-stockout suppression',
    note: 'Ignore competitor prices on lines they cannot fulfil',
    icon: 'plugs',
    stage: 'parity',
    scopes: ['All categories'],
    threshold: 'Competitor stock > 0',
    enforcement: 'soft',
    status: 'paused',
    bindings: 0,
    blocked: 0,
    owner: 'Commercial',
    updated: 'Jul 09, 2026',
  },
  {
    name: 'Promotional depth cap',
    note: 'Total stacked discount against list price',
    icon: 'tag',
    stage: 'promo',
    scopes: ['All categories'],
    threshold: '≤ 25.0%',
    enforcement: 'hard',
    status: 'active',
    bindings: 5,
    blocked: 1,
    owner: 'Marketing',
    updated: 'Jul 22, 2026',
  },
  {
    name: 'Bundle price protection',
    note: 'A handset may not undercut its own bundle component',
    icon: 'package',
    stage: 'promo',
    scopes: ['Smartphones'],
    threshold: '≥ bundle component',
    enforcement: 'hard',
    status: 'draft',
    bindings: 0,
    blocked: 0,
    owner: 'Commercial',
    updated: 'Aug 04, 2026',
  },
  {
    name: 'Charm price points',
    note: 'Applied last, after every other constraint has been satisfied',
    icon: 'coins',
    stage: 'rounding',
    scopes: ['All categories'],
    threshold: 'Nearest .99',
    enforcement: 'soft',
    status: 'active',
    bindings: 26,
    blocked: 0,
    owner: 'Pricing Governance',
    updated: 'Apr 11, 2026',
  },
];

/** One step of the constraint pipeline, in `RULE_STAGES` order. */
export interface RuleStageCopy {
  readonly key: RuleStage;
  readonly title: string;
  readonly description: string;
}

/** A proposed or applied change to a rule, pending an approval decision. */
export interface RuleChange {
  readonly date: string;
  readonly rule: string;
  readonly change: string;
  readonly requester: string;
  readonly status: DecisionStatus;
}

/**
 * Scorecard values are counted from the rules themselves, so a `metric` key
 * selects the derivation and the document supplies only the label and trend.
 */
export const RULE_METRICS = ['active', 'hard', 'blocks', 'pending'] as const;

export type RuleMetric = (typeof RULE_METRICS)[number];

export interface RuleKpiSpec {
  readonly metric: RuleMetric;
  readonly label: string;
  readonly delta: string;
  readonly direction: KpiDirection;
  readonly tone: KpiTone;
}

export interface RulesCopy {
  readonly title: string;
  readonly chip: string;
  readonly exportLabel: string;
  readonly exportIcon: string;
  readonly exportMessage: string;
  readonly proposeLabel: string;
  readonly proposeIcon: string;
  readonly proposeMessage: string;
  readonly notice: NoticeSpec;
  readonly kpis: readonly RuleKpiSpec[];

  readonly tableTitle: string;
  readonly tableSubtitle: string;
  readonly searchPlaceholder: string;
  readonly searchAriaLabel: string;
  /** First entry is the "no status filter" option. */
  readonly statusFilters: readonly string[];
  readonly statusChipPrefix: string;
  readonly searchChipPrefix: string;
  readonly columns: readonly string[];
  readonly resultsOf: string;
  readonly rulesUnit: string;
  readonly rulesUnitOne: string;
  readonly emptyMessage: string;
  readonly emptyIcon: string;

  readonly enforcementLabels: Readonly<Record<RuleEnforcement, string>>;
  readonly enforcementIcons: Readonly<Record<RuleEnforcement, string>>;
  readonly statusLabels: Readonly<Record<RuleStatus, string>>;

  readonly bindingTitle: string;
  readonly bindingSubtitle: string;

  readonly stagesTitle: string;
  readonly stagesSubtitle: string;
  readonly stages: readonly RuleStageCopy[];

  readonly coverageTitle: string;
  readonly coverageSubtitle: string;
  readonly coverageHardTitle: string;
  readonly coverageSoftTitle: string;

  readonly changeLogTitle: string;
  readonly changeLogSubtitle: string;
  readonly changeLog: readonly RuleChange[];
}

export const RULES_COPY: RulesCopy = {
  title: 'Pricing rules',
  chip: 'Rule set v4.2 · effective Aug 05',
  exportLabel: 'Export rule set',
  exportIcon: 'export',
  exportMessage: 'Rule set exported',
  proposeLabel: 'Propose change',
  proposeIcon: 'git-pull-request',
  proposeMessage: 'Change proposal opened for review',
  notice: {
    severity: 'info',
    icon: 'lock-key',
    title: 'Read-only for the Finance role. Proposed changes are applied by Admin after approval.',
  },
  kpis: [
    { metric: 'active', label: 'Active rules', delta: '+2', direction: 'up', tone: '' },
    { metric: 'hard', label: 'Hard guardrails', delta: '+1', direction: 'up', tone: '' },
    { metric: 'blocks', label: 'Guardrail blocks', delta: '+3', direction: 'down', tone: '' },
    { metric: 'pending', label: 'Awaiting approval', delta: '+1', direction: 'down', tone: '' },
  ],

  tableTitle: 'Guardrail rules',
  tableSubtitle: 'Applied in evaluation order before a recommendation reaches the queue.',
  searchPlaceholder: 'Search by rule, scope, threshold or owner',
  searchAriaLabel: 'Search rules',
  statusFilters: ['All', 'Active', 'Draft', 'Paused'],
  statusChipPrefix: 'Status: ',
  searchChipPrefix: 'Search: ',
  columns: ['Rule', 'Scope', 'Threshold', 'Enforcement', 'Bindings', 'Status'],
  resultsOf: 'of',
  rulesUnit: 'rules',
  rulesUnitOne: 'rule',
  emptyMessage: 'No rules match these filters. Clear one to widen the search.',
  emptyIcon: 'magnifying-glass',

  enforcementLabels: { hard: 'Hard', soft: 'Soft' },
  enforcementIcons: { hard: 'lock-simple', soft: 'lock-simple-open' },
  statusLabels: { active: 'Active', draft: 'Draft', paused: 'Paused' },

  bindingTitle: 'Most binding rules this cycle',
  bindingSubtitle: 'How often each rule actually constrained a recommendation.',

  stagesTitle: 'Evaluation order',
  stagesSubtitle: 'Earlier stages win. A regulatory floor is never traded away for parity.',
  stages: [
    {
      key: 'legal',
      title: 'Legal and regulatory',
      description: 'Filed price commitments and advertising rules. Never overridden.',
    },
    {
      key: 'margin',
      title: 'Margin protection',
      description: 'Category and portfolio margin floors set by Finance.',
    },
    {
      key: 'band',
      title: 'Absolute price band',
      description: 'Hard floor and ceiling per category or SKU.',
    },
    {
      key: 'velocity',
      title: 'Change velocity',
      description: 'Caps how far and how often a price may move in one cycle.',
    },
    {
      key: 'parity',
      title: 'Competitor parity',
      description: 'Target position against the tracked competitor set.',
    },
    {
      key: 'promo',
      title: 'Promotional depth',
      description: 'Limits stacked discounting before a price is published.',
    },
    {
      key: 'rounding',
      title: 'Rounding and price points',
      description: 'Presentation only, applied after every constraint is satisfied.',
    },
  ],

  coverageTitle: 'Coverage',
  coverageSubtitle: 'A scope with no hard guardrail is governed by soft targets alone.',
  coverageHardTitle: 'Covered by at least one active hard guardrail',
  coverageSoftTitle: 'Soft targets only — no active hard guardrail',

  changeLogTitle: 'Recent rule changes',
  changeLogSubtitle: 'Every change to the rule set is proposed, reviewed and logged.',
  changeLog: [
    {
      date: 'Aug 04, 2026',
      rule: 'Bundle price protection',
      change: 'New rule — drafted for review',
      requester: 'H. Nasser',
      status: 'pending',
    },
    {
      date: 'Aug 03, 2026',
      rule: 'Competitor parity band',
      change: 'Upper bound +4.0% → +5.0%',
      requester: 'M. Haddad',
      status: 'pending',
    },
    {
      date: 'Aug 01, 2026',
      rule: 'Portfolio margin guardrail',
      change: 'Threshold 15.0% → 15.5%',
      requester: 'Aisha Al-Khayyat',
      status: 'approved',
    },
    {
      date: 'Jul 28, 2026',
      rule: 'Category margin floor — Smartphones',
      change: 'Threshold 11.5% → 12.0%',
      requester: 'Aisha Al-Khayyat',
      status: 'approved',
    },
    {
      date: 'Jul 22, 2026',
      rule: 'Promotional depth cap',
      change: 'Cap 30.0% → 25.0%',
      requester: 'R. Fernandes',
      status: 'approved',
    },
    {
      date: 'Jul 09, 2026',
      rule: 'Match-on-stockout suppression',
      change: 'Paused pending a competitor feed fix',
      requester: 'M. Haddad',
      status: 'overridden',
    },
  ],
};
