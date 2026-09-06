import { KpiCards } from '@/components/common/KpiCard';
import { usePortalData } from '@/state/DataContext';
import { boardKpis, categoryPerformance } from '@/data/boardMetrics';
import { windowOf } from '@/data/ranges';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { ComboChart } from '@/components/charts/ComboChart';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const pricingPerformanceMeta = dashboardMeta('c1');

export function PricingPerformanceScreen() {
  const { series, boards } = usePortalData();
  const board = boards.copy.boards.c1;

  return (
    <DashboardShell tab="c1">
      {(range) => {
        const weeks = windowOf(series.comboWeeks, range);
        const rows = categoryPerformance(series, range).map((row) => ({
          key: row.category,
          cells: [
            { content: row.category },
            { content: <Delta value={row.priceVsBaseline} /> },
            { content: <Delta value={row.revenue} /> },
            { content: row.conversion, className: 'tnum' },
          ],
        }));

        return (
          <>
            <div className="kpi-row">
              <KpiCards kpis={boardKpis(board.kpis, range, series)} />
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
              {(hidden) => <ComboChart weeks={weeks} hiddenSeries={hidden} />}
            </ChartCard>

            <Table columns={uniformColumns(board.columns)} rows={rows} />
          </>
        );
      }}
    </DashboardShell>
  );
}
