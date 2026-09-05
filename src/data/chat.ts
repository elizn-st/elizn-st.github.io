import type { ActionSpec } from './ui';

export interface ChatSession {
  readonly title: string;
  readonly date: string;
  readonly subtitle: string;
  readonly active: boolean;
}

export const CHAT_SESSIONS: readonly ChatSession[] = [
  {
    title: 'LLM / RAG analyst',
    date: 'Today',
    subtitle: 'Deviation from recommendation this week',
    active: true,
  },
  {
    title: 'Compare revenue by category',
    date: 'Aug 03',
    subtitle: 'Last month comparison across Electronics and Home',
    active: false,
  },
  {
    title: 'Overrides by SKU',
    date: 'Aug 01',
    subtitle: 'Which SKUs are overridden most often?',
    active: false,
  },
  {
    title: 'Forecast accuracy Q3',
    date: 'Jul 28',
    subtitle: 'Chart forecast accuracy for the quarter',
    active: false,
  },
  {
    title: 'Competitor price cuts',
    date: 'Jul 24',
    subtitle: 'Competitor B price cut impact on iPad Air 11',
    active: false,
  },
  {
    title: 'Seasonal demand dip',
    date: 'Jul 18',
    subtitle: 'Seasonal demand dip and recommendation delta',
    active: false,
  },
];

export const SUGGESTED_PROMPTS: readonly string[] = [
  'Compare revenue by category, last month',
  'Which SKUs get overridden most often?',
  'Chart forecast accuracy for the quarter',
];

/** Deviation table rendered inside the seeded assistant answer. */
export const DEVIATION_ROWS: readonly { sku: string; delta: number }[] = [
  { sku: 'iPad Air 11 256GB', delta: -7.7 },
  { sku: 'AirPods Pro 2', delta: -7.0 },
  { sku: 'Xiaomi 14 128GB', delta: -5.6 },
];

export interface ChatCopy {
  readonly question: string;
  readonly questionTime: string;
  /** The seeded answer emphasises one SKU, so the paragraph is three parts. */
  readonly answerIntro: string;
  readonly answerEmphasis: string;
  readonly answerRest: string;
  readonly deviationColumns: readonly string[];
  readonly answerActions: readonly ActionSpec[];
  readonly answerSource: string;
  readonly replyBody: string;
  readonly replySource: string;
  readonly composerPlaceholder: string;
  readonly composerAriaLabel: string;
  readonly sendAriaLabel: string;
  readonly sidebarTitle: string;
  readonly newLabel: string;
  readonly newMessage: string;
  readonly sidebarSearchPlaceholder: string;
  readonly sidebarSearchAriaLabel: string;
}

export const CHAT_COPY: ChatCopy = {
  question: 'Show me the SKUs with the largest deviation from the recommendation this week',
  questionTime: '10:42 AM',
  answerIntro: 'For the Aug 05–11 cycle, the largest deviation is',
  answerEmphasis: 'iPad Air 11 256GB',
  answerRest:
    ': the recommendation is 7% below the current price, driven by a seasonal demand dip and price cut from Competitor B.',
  deviationColumns: ['SKU', 'Δ%'],
  answerActions: [
    { label: 'Export to Excel', icon: 'microsoft-excel-logo', message: 'Excel export started' },
    { label: 'Show as chart', icon: 'chart-line', message: 'Chart opened' },
    { label: 'Export to PDF', icon: 'file-pdf', message: 'PDF export started' },
  ],
  answerSource: 'Source: Pricing Data Platform, cycle Aug 05–11',
  replyBody:
    "Pulling that from the pricing data platform for cycle Aug 05–11. The strongest signal is competitor movement in Smartphones, which drove 46% of this week's recommendations.",
  replySource: 'Source: Pricing Data Platform · generated from indexed cycle data',
  composerPlaceholder: 'Ask a question about a SKU or category',
  composerAriaLabel: 'Message',
  sendAriaLabel: 'Send',
  sidebarTitle: 'Chat history',
  newLabel: 'New',
  newMessage: 'New conversation started',
  sidebarSearchPlaceholder: 'Search',
  sidebarSearchAriaLabel: 'Search',
};
