import { SEGMENT_BEHAVIOUR } from '@/data/dashboards';
import { ELASTICITY_BARS } from '@/data/series';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { BarChart } from '@/components/charts/BarChart';
import { NotificationRow } from '@/components/common/NotificationRow';
import { Delta } from '@/components/common/Delta';
import { Table, uniformColumns } from '@/components/common/Table';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const customerBehaviourMeta = dashboardMeta('Customer behaviour');

const COLUMNS = uniformColumns(['Segment', 'Reach', 'Conversion', 'Δ vs base price']);

export function CustomerBehaviourScreen() {
  const rows = SEGMENT_BEHAVIOUR.map((row) => ({
    key: row.segment,
    cells: [
      { content: row.segment },
      { content: row.reach, className: 'tnum' },
      { content: row.conversion, className: 'tnum' },
      { content: <Delta value={row.deltaVsBase} /> },
    ],
  }));

  return (
    <DashboardShell
      tab="c5"
      title="Customer behaviour"
      subtitle="Personalised offer response · UM segments only"
    >
      <ChartCard
        head={
          <ChartHead
            title="Demand elasticity by segment"
            subtitle="Conversion response per customer segment"
            chartKey="c5-elasticity"
          />
        }
      >
        {() => <BarChart items={ELASTICITY_BARS} />}
      </ChartCard>

      <NotificationRow
        severity="warning"
        icon="warning"
        title="Approved, privacy-compliant use cases only. Data is aggregated by UM segment."
      />

      <Table columns={COLUMNS} rows={rows} />
    </DashboardShell>
  );
}
