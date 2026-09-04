import { FORECAST_QUALITY } from '@/data/dashboards';
import { FORECAST_SERIES, WEEK_LABELS } from '@/data/series';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { LineChart } from '@/components/charts/LineChart';
import { StatusBadge } from '@/components/common/Badge';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const forecastAccuracyMeta = dashboardMeta('Forecast accuracy');

const COLUMNS = uniformColumns(['Category', 'MAPE', 'Bias', 'Quality']);
const asUnits = (value: number) => Math.round(value).toLocaleString();

export function ForecastAccuracyScreen() {
  const rows = FORECAST_QUALITY.map((row) => ({
    key: row.category,
    cells: [
      { content: row.category },
      { content: row.mape, className: 'tnum' },
      { content: row.bias, className: 'tnum' },
      { content: <StatusBadge status={row.quality} /> },
    ],
  }));

  return (
    <DashboardShell
      tab="c3"
      title="Forecast accuracy"
      subtitle="MAPE and bias metrics for demand and revenue models"
    >
      <div className="kpi-row">
        <KpiCard index={0} label="MAPE (demand)" value="6.8%" />
        <KpiCard index={1} label="MAPE (revenue)" value="5.1%" />
        <KpiCard index={2} label="Confidence interval" value="4.2%" />
      </div>

      <ChartCard
        head={
          <ChartHead
            title="Forecast vs actual weekly demand"
            subtitle="Model output tracked against realised units per week"
            padLeft={40}
            chartKey="c3-forecast"
          />
        }
        xAxisLabels={WEEK_LABELS}
        legend={[
          { label: 'Forecast', color: 'var(--dv2)' },
          { label: 'Actual', color: 'var(--dv1)' },
        ]}
      >
        {(hidden) => (
          <LineChart
            labels={WEEK_LABELS}
            format={asUnits}
            hiddenSeries={hidden}
            series={[
              { name: 'Forecast', color: 'var(--dv2)', data: FORECAST_SERIES.forecast },
              { name: 'Actual', color: 'var(--dv1)', area: true, data: FORECAST_SERIES.actual },
            ]}
          />
        )}
      </ChartCard>

      <Table columns={COLUMNS} rows={rows} />
    </DashboardShell>
  );
}
