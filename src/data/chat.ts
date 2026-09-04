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
