/**
 * Copy belonging to the shared components rather than to any one screen: the
 * scorecard footers, the pager, the legend lead, the expand and remove
 * buttons. Kept in one document because it is edited as a set.
 */
export interface ChromeCopy {
  readonly scoreLabel: string;
  readonly lastUpdated: string;
  readonly expandLabel: string;
  readonly moreFiltersLabel: string;
  readonly legendLead: string;
  readonly removeLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly ellipsis: string;
}

export const CHROME_COPY: ChromeCopy = {
  scoreLabel: 'Since last week',
  lastUpdated: 'Last updated: 16:53 05-08-2026',
  expandLabel: 'Open full view',
  moreFiltersLabel: 'More filters',
  legendLead: 'Show:',
  removeLabel: 'Remove',
  previousLabel: 'Previous',
  nextLabel: 'Next',
  ellipsis: '...',
};
