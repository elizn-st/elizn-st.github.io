import { KpiCards } from '@/components/common/KpiCard';
import { usePortalData } from '@/state/DataContext';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { LineChart } from '@/components/charts/LineChart';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const revenueImpactMeta = dashboardMeta('c4');

const asThousands = (value: number) => `AED ${Math.round(value)}K`;

/** Which of the two series is filled; the names and colours are copy. */
const FILLED = [true, false];

export function RevenueImpactScreen() {
  const { series, boards } = usePortalData();
  const board = boards.copy.boards.c4;
  const chartData = [series.impactSeries.withAdpa, series.impactSeries.baseline];

  return (
    <DashboardShell tab="c4">
      <div className="kpi-row">
        <KpiCards kpis={board.kpis} />
      </div>

      <ChartCard
        head={
          <ChartHead
            title={board.chart.copy.title}
            subtitle={board.chart.copy.subtitle}
            padLeft={48}
            chartKey="c4-impact"
          />
        }
        xAxisLabels={series.weekLabels}
        legend={board.chart.legend}
      >
        {(hidden) => (
          <LineChart
            labels={series.weekLabels}
            format={asThousands}
            hiddenSeries={hidden}
            series={board.chart.seriesNames.map((name, index) => ({
              name,
              color: board.chart.legend[index]?.color ?? '',
              area: FILLED[index] ?? false,
              data: chartData[index] ?? [],
            }))}
          />
        )}
      </ChartCard>
    </DashboardShell>
  );
}
