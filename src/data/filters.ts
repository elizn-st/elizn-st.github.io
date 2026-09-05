export interface FilterOption {
  readonly label: string;
  readonly checked: boolean;
}

export interface FilterGroup {
  readonly label: string;
  readonly options: readonly FilterOption[];
}

export const FILTER_GROUPS: readonly FilterGroup[] = [
  {
    label: 'Category',
    options: [
      { label: 'Smartphones', checked: true },
      { label: 'Accessories', checked: true },
      { label: 'Wearables', checked: false },
      { label: 'Tablets', checked: false },
      { label: 'Laptops', checked: false },
    ],
  },
  {
    label: 'Status',
    options: [
      { label: 'Pending', checked: true },
      { label: 'Flagged', checked: false },
      { label: 'Approved', checked: false },
      { label: 'Rejected', checked: false },
    ],
  },
  {
    label: 'Brand',
    options: [
      { label: 'Apple', checked: false },
      { label: 'Samsung', checked: false },
      { label: 'Xiaomi', checked: false },
      { label: 'Google', checked: false },
    ],
  },
];

export const CYCLE_FILTER_OPTIONS: readonly string[] = ['Current', 'Previous', 'All'];

export interface FiltersCopy {
  readonly title: string;
  readonly closeLabel: string;
  readonly deviationLabel: string;
  readonly sliderName: string;
  readonly sliderAriaLabel: string;
  readonly sliderMin: number;
  readonly sliderMax: number;
  readonly sliderStep: number;
  readonly sliderValue: number;
  readonly cycleLabel: string;
  readonly defaultCycle: string;
  readonly resetLabel: string;
  readonly resetMessage: string;
  readonly applyLabel: string;
  readonly applyMessage: string;
}

export const FILTERS_COPY: FiltersCopy = {
  title: 'Filters',
  closeLabel: 'Close',
  deviationLabel: 'Deviation from recommendation',
  sliderName: 'Minimum Δ%',
  sliderAriaLabel: 'Minimum deviation',
  sliderMin: -20,
  sliderMax: 20,
  sliderStep: 0.5,
  sliderValue: -8,
  cycleLabel: 'Cycle',
  defaultCycle: 'Current',
  resetLabel: 'Reset',
  resetMessage: 'Filters reset',
  applyLabel: 'Apply filters',
  applyMessage: 'Filters applied',
};
