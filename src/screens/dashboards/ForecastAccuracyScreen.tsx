import { KpiCards } from '@/components/common/KpiCard';
import { usePortalData } from '@/state/DataContext';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { LineChart } from '@/components/charts/LineChart';
import { StatusBadge } from '@/components/common/Badge';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const forecastAccuracyMeta = dashboardMeta('c3');

const asUnits = (value: number) => Math.round(value).toLocaleString();

/** Which of the two series is filled; the names and colours are copy. */
const FILLED = [false, true];

export function ForecastAccuracyScreen() {
  const { dashboards, series, boards } = usePortalData();
  const board = boards.copy.boards.c3;
  const chartData = [series.forecastSeries.forecast, series.forecastSeries.actual];
  const rows = dashboards.forecastQuality.map((row) => ({
    key: row.category,
    cells: [
      { content: row.category },
      { content: row.mape, className: 'tnum' },
      { content: row.bias, className: 'tnum' },
      { content: <StatusBadge status={row.quality} /> },
    ],
  }));

  return (
    <DashboardShell tab="c3">
      <div className="kpi-row">
        <KpiCards kpis={board.kpis} />
      </div>

      <ChartCard
        head={
          <ChartHead
            title={board.chart.copy.title}
            subtitle={board.chart.copy.subtitle}
            padLeft={40}
            chartKey="c3-forecast"
          />
        }
        xAxisLabels={series.weekLabels}
        legend={board.chart.legend}
      >
        {(hidden) => (
          <LineChart
            labels={series.weekLabels}
            format={asUnits}
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

      <Table columns={uniformColumns(board.columns)} rows={rows} />
    </DashboardShell>
  );
}
