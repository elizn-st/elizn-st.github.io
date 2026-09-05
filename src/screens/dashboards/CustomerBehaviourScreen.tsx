import { ChartCard } from '@/components/common/ChartCard';
import { usePortalData } from '@/state/DataContext';
import { ChartHead } from '@/components/common/ChartHead';
import { BarChart } from '@/components/charts/BarChart';
import { NotificationRow } from '@/components/common/NotificationRow';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const customerBehaviourMeta = dashboardMeta('c5');

export function CustomerBehaviourScreen() {
  const { dashboards, series, boards } = usePortalData();
  const board = boards.copy.boards.c5;
  const rows = dashboards.segmentBehaviour.map((row) => ({
    key: row.segment,
    cells: [
      { content: row.segment },
      { content: row.reach, className: 'tnum' },
      { content: row.conversion, className: 'tnum' },
      { content: <Delta value={row.deltaVsBase} /> },
    ],
  }));

  return (
    <DashboardShell tab="c5">
      <ChartCard
        head={
          <ChartHead
            title={board.chart.copy.title}
            subtitle={board.chart.copy.subtitle}
            chartKey="c5-elasticity"
          />
        }
      >
        {() => <BarChart items={series.elasticityBars} />}
      </ChartCard>

      {board.notices.map((notice) => (
        <NotificationRow
          key={notice.title}
          severity={notice.severity}
          icon={notice.icon}
          title={notice.title}
        />
      ))}

      <Table columns={uniformColumns(board.columns)} rows={rows} />
    </DashboardShell>
  );
}
