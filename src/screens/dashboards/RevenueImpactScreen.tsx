import { IMPACT_SERIES, WEEK_LABELS } from '@/data/series';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { LineChart } from '@/components/charts/LineChart';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const revenueImpactMeta = dashboardMeta('Revenue impact');

const asThousands = (value: number) => `AED ${Math.round(value)}K`;

export function RevenueImpactScreen() {
  return (
    <DashboardShell
      tab="c4"
      title="Revenue impact"
      subtitle="Cumulative AED uplift vs the no-ADPA baseline"
    >
      <div className="kpi-row">
        <KpiCard
          index={0}
          label="Revenue uplift"
          value="+AED 612K"
          delta="+8.4%"
          direction="up"
          tone="pos"
        />
        <KpiCard
          index={1}
          label="Markdown cost"
          value="-AED 84K"
          delta="planned"
          direction="down"
          tone="neg"
        />
        <KpiCard index={2} label="Incremental units" value="1,240" delta="+310" direction="up" />
        <KpiCard
          index={3}
          label="Margin delta"
          value="+2.1%"
          delta="+0.3pp"
          direction="up"
          tone="pos"
        />
      </div>

      <ChartCard
        head={
          <ChartHead
            title="Cumulative effect since cycle start: with ADPA vs baseline"
            subtitle="With ADPA the cycle closed AED 612K ahead of the counterfactual baseline"
            padLeft={48}
            chartKey="c4-impact"
          />
        }
        xAxisLabels={WEEK_LABELS}
        legend={[
          { label: 'With ADPA', color: 'var(--dv1)' },
          { label: 'Baseline without ADPA', color: 'var(--n40)' },
        ]}
      >
        {(hidden) => (
          <LineChart
            labels={WEEK_LABELS}
            format={asThousands}
            hiddenSeries={hidden}
            series={[
              { name: 'With ADPA', color: 'var(--dv1)', area: true, data: IMPACT_SERIES.withAdpa },
              { name: 'Baseline', color: 'var(--n40)', data: IMPACT_SERIES.baseline },
            ]}
          />
        )}
      </ChartCard>
    </DashboardShell>
  );
}
