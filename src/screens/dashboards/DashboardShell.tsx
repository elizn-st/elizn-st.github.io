import type { ReactNode } from 'react';
import type { DashboardTabId } from '@/data/navigation';
import { isRangeId, type RangeId } from '@/data/ranges';
import { usePortalData } from '@/state/DataContext';
import { useDashboardRange } from '@/state/RangeContext';
import { DashboardTabs } from '@/components/common/DashboardTabs';
import { ToastButton } from '@/components/common/ToastButton';
import { Segmented } from '@/components/common/Segmented';
import { Icon } from '@/components/common/Icon';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export interface DashboardShellProps {
  readonly tab: DashboardTabId;
  /**
   * Given the selected window, because every figure below the title bar is
   * derived from it -- a board cannot render before it knows the range.
   */
  readonly children: (range: RangeId) => ReactNode;
}

/** Tabs plus title bar shared by all five dashboard boards. */
export function DashboardShell({ tab, children }: DashboardShellProps) {
  const { boards } = usePortalData();
  const copy = boards.copy;
  const board = copy.boards[tab];
  const { chosen, choose } = useDashboardRange();
  const range = chosen ?? copy.defaultRange;

  return (
    <>
      <DashboardTabs active={tab} />
      <div className="dash-head">
        <div className="title-block">
          <h1 className="page-title">{board.title}</h1>
          <p className="page-sub">{board.subtitle}</p>
        </div>
        <div className="dash-actions">
          <ToastButton className="btn" message={copy.exportMessage}>
            <Icon name={copy.exportIcon} /> {copy.exportLabel}
          </ToastButton>
          <Segmented
            items={copy.rangeOptions}
            defaultValue={copy.defaultRange}
            value={range}
            onChange={(next) => {
              // The ids came through the parser's runtime union, so this only
              // rejects a value that never came from the control at all.
              if (isRangeId(next)) choose(next);
            }}
          />
        </div>
      </div>
      {children(range)}
    </>
  );
}

/** Every board sits under the Dashboards breadcrumb at the standard width. */
export const dashboardMeta =
  (tab: DashboardTabId) =>
  ({ boards }: ScreenMetaInput): ScreenMeta => ({
    section: boards.copy.section,
    page: boards.copy.boards[tab].title,
    width: 892,
  });
