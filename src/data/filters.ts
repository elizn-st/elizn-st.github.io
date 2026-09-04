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
