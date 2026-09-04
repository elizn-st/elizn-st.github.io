import { CATEGORY_PERFORMANCE } from '@/data/dashboards';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { ComboChart } from '@/components/charts/ComboChart';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const pricingPerformanceMeta = dashboardMeta('Pricing performance');

const COLUMNS = uniformColumns(['Category', 'Price vs baseline', 'Revenue', 'Conversion']);

export function PricingPerformanceScreen() {
  const rows = CATEGORY_PERFORMANCE.map((row) => ({
    key: row.category,
    cells: [
      { content: row.category },
      { content: <Delta value={row.priceVsBaseline} /> },
      { content: <Delta value={row.revenue} /> },
      { content: row.conversion, className: 'tnum' },
    ],
  }));

  return (
    <DashboardShell
      tab="c1"
      title="Pricing performance"
      subtitle="Deviation, volume and revenue · approved decisions impact"
    >
      <div className="kpi-row">
        <KpiCard
          index={0}
          label="Avg price vs baseline"
          value="-4.1%"
          delta="-0.5pp"
          direction="down"
          tone="neg"
        />
        <KpiCard
          index={1}
          label="Sales volume"
          value="+7.8%"
          delta="+1.2pp"
          direction="up"
          tone="pos"
        />
        <KpiCard index={2} label="Revenue" value="+3.4%" delta="+0.4pp" direction="up" tone="pos" />
        <KpiCard
          index={3}
          label="Margin"
          value="-0.6%"
          delta="-0.2pp"
          direction="down"
          tone="neg"
        />
      </div>

      <ChartCard
        head={
          <ChartHead
            title="Approved decisions vs actual revenue"
            subtitle="Approval volume rose 48% over 8 weeks while revenue climbed from AED 410K to 495K"
            padLeft={40}
            chartKey="c1-combo"
          />
        }
        legend={[
          { label: 'Rejected', color: 'var(--dv-rej)', series: 1 },
          { label: 'Approved', color: 'var(--dv-app-lbl)', series: 0 },
          { label: 'Revenue', color: 'var(--dv-rev)', series: 2 },
        ]}
      >
        {(hidden) => <ComboChart hiddenSeries={hidden} />}
      </ChartCard>

      <Table columns={COLUMNS} rows={rows} />
    </DashboardShell>
  );
}
