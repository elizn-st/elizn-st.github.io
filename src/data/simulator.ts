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

export type ComparisonTone = 'pos' | 'neg' | '';

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
