import type { KpiSpec } from './ui';

export interface ScenarioInput {
  readonly name: string;
  readonly min: number;
  readonly max: number;
  readonly value: number;
}

export const SCENARIO_INPUTS: readonly ScenarioInput[] = [
  { name: 'Price change', min: -15, max: 15, value: -4 },
  { name: 'Promo depth', min: 0, max: 30, value: 5 },
  { name: 'Competitor move', min: -20, max: 20, value: -2 },
  { name: 'Stock level', min: -10, max: 10, value: 0 },
];

export const COMPARISON_TONES = ['pos', 'neg'] as const;

/** '' is a real variant: a row rendered without a tone. */
export type ComparisonTone = (typeof COMPARISON_TONES)[number] | '';

export interface ComparisonRow {
  readonly metric: string;
  readonly current: string;
  readonly recommendation: string;
  readonly scenario: string;
  readonly recommendationTone: ComparisonTone;
  readonly scenarioTone: ComparisonTone;
}

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  {
    metric: 'Price',
    current: 'AED 3,899',
    recommendation: 'AED 3,749',
    scenario: 'AED 3,743',
    recommendationTone: '',
    scenarioTone: '',
  },
  {
    metric: 'Sales volume',
    current: 'baseline',
    recommendation: '+7.8%',
    scenario: '+9.2%',
    recommendationTone: 'pos',
    scenarioTone: 'pos',
  },
  {
    metric: 'Revenue',
    current: 'baseline',
    recommendation: '+3.4%',
    scenario: '+2.1%',
    recommendationTone: 'pos',
    scenarioTone: 'pos',
  },
  {
    metric: 'Margin',
    current: 'baseline',
    recommendation: '-0.6%',
    scenario: '-1.4%',
    recommendationTone: 'neg',
    scenarioTone: 'neg',
  },
];

export interface SimulatorCopy {
  readonly title: string;
  readonly chip: string;
  readonly submitLabel: string;
  readonly submitIcon: string;
  readonly submitMessage: string;
  readonly inputsTitle: string;
  readonly forecastTitle: string;
  readonly comparisonTitle: string;
  readonly columns: readonly string[];
}

export const SIMULATOR_COPY: SimulatorCopy = {
  title: 'Scenario simulation',
  chip: 'iPhone 15 Pro 256GB',
  submitLabel: 'Submit as alternative',
  submitIcon: 'check-circle',
  submitMessage: 'Scenario submitted as alternative recommendation',
  inputsTitle: 'Scenario inputs',
  forecastTitle: 'Forecast impact',
  comparisonTitle: 'Comparison with your scenario',
  columns: ['Metric', 'Current price', 'AI recommendation', 'Your scenario'],
};

export const SIMULATOR_KPIS: readonly KpiSpec[] = [
  {
    label: 'Sales volume',
    value: '+9.2%',
    delta: '+9.2%',
    direction: 'up',
    tone: 'pos',
    graph: false,
  },
  { label: 'Revenue', value: '+2.1%', delta: '+2.1%', direction: 'up', tone: 'pos', graph: false },
  { label: 'Margin', value: '-1.4%', delta: '-1.4%', direction: 'down', tone: 'neg', graph: false },
  {
    label: 'Market share',
    value: '+0.6pp',
    delta: '+0.6pp',
    direction: 'up',
    tone: 'pos',
    graph: false,
  },
];
