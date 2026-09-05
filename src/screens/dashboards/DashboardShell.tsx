import type { ReactNode } from 'react';
import type { DashboardTabId } from '@/data/navigation';
import { usePortalData } from '@/state/DataContext';
import { DashboardTabs } from '@/components/common/DashboardTabs';
import { ToastButton } from '@/components/common/ToastButton';
import { Segmented } from '@/components/common/Segmented';
import { Icon } from '@/components/common/Icon';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export interface DashboardShellProps {
  readonly tab: DashboardTabId;
  readonly children: ReactNode;
}

/** Tabs plus title bar shared by all five dashboard boards. */
export function DashboardShell({ tab, children }: DashboardShellProps) {
  const { boards } = usePortalData();
  const copy = boards.copy;
  const board = copy.boards[tab];

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
          <Segmented options={copy.rangeOptions} defaultValue={copy.defaultRange} />
        </div>
      </div>
      {children}
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
