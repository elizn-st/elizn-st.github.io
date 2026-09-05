import { KpiCards } from '@/components/common/KpiCard';
import { usePortalData } from '@/state/DataContext';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { ComboChart } from '@/components/charts/ComboChart';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const pricingPerformanceMeta = dashboardMeta('c1');

export function PricingPerformanceScreen() {
  const { dashboards, boards } = usePortalData();
  const board = boards.copy.boards.c1;
  const rows = dashboards.categoryPerformance.map((row) => ({
    key: row.category,
    cells: [
      { content: row.category },
      { content: <Delta value={row.priceVsBaseline} /> },
      { content: <Delta value={row.revenue} /> },
      { content: row.conversion, className: 'tnum' },
    ],
  }));

  return (
    <DashboardShell tab="c1">
      <div className="kpi-row">
        <KpiCards kpis={board.kpis} />
      </div>

      <ChartCard
        head={
          <ChartHead
            title={board.chart.copy.title}
            subtitle={board.chart.copy.subtitle}
            padLeft={40}
            chartKey="c1-combo"
          />
        }
        legend={board.chart.legend}
      >
        {(hidden) => <ComboChart hiddenSeries={hidden} />}
      </ChartCard>

      <Table columns={uniformColumns(board.columns)} rows={rows} />
    </DashboardShell>
  );
}
