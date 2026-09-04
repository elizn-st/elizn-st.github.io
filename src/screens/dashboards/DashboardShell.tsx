import type { ReactNode } from 'react';
import type { DashboardTabId } from '@/data/navigation';
import { DashboardTabs } from '@/components/common/DashboardTabs';
import { ToastButton } from '@/components/common/ToastButton';
import { Segmented } from '@/components/common/Segmented';
import { Icon } from '@/components/common/Icon';
import type { ScreenMeta } from '@/routing/screens';

export interface DashboardShellProps {
  readonly tab: DashboardTabId;
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}

const RANGE_OPTIONS = ['1W', '4W', '8W', 'ALL'];

/** Tabs plus title bar shared by all five dashboard boards. */
export function DashboardShell({ tab, title, subtitle, children }: DashboardShellProps) {
  return (
    <>
      <DashboardTabs active={tab} />
      <div className="dash-head">
        <div className="title-block">
          <h1 className="page-title">{title}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        <div className="dash-actions">
          <ToastButton className="btn" message="Export started">
            <Icon name="export" /> Export
          </ToastButton>
          <Segmented options={RANGE_OPTIONS} defaultValue="8W" />
        </div>
      </div>
      {children}
    </>
  );
}

/** Every board sits under the Dashboards breadcrumb at the standard width. */
export const dashboardMeta = (page: string): ScreenMeta => ({
  section: 'Dashboards',
  page,
  width: 892,
});
