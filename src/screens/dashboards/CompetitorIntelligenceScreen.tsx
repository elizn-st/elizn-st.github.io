import { cx } from '@/lib/cx';
import { signedPct, toneOf } from '@/lib/format';
import { COMPETITOR_FEED, GAP_ANALYSIS, SOURCE_FRESHNESS } from '@/data/dashboards';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { Icon } from '@/components/common/Icon';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const competitorIntelligenceMeta = dashboardMeta('Competitor intelligence');

const COMPACT_CARD = { padding: '4px var(--s16)' } as const;

export function CompetitorIntelligenceScreen() {
  return (
    <DashboardShell
      tab="c2"
      title="Competitor intelligence"
      subtitle="Live pricing vs e& across tracked categories"
    >
      <ChartCard
        head={
          <ChartHead
            title="e& price vs competitors by category"
            subtitle="e& holds a price premium in Smartphones and Tablets; near parity in Accessories and Wearables"
            padLeft={40}
            chartKey="c2-grouped"
          />
        }
        legend={[
          { label: 'e&', color: '#950124' },
          { label: 'Competitor A', color: '#EA6C29' },
          { label: 'Competitor B', color: '#0D9488' },
        ]}
      >
        {(hidden) => <GroupedBarChart hiddenSeries={hidden} />}
      </ChartCard>

      <div className="c2-cols">
        <div className="c2-col">
          <div className="card pad">
            <div className="chart-head">
              <div className="chart-head-t">
                <h2 className="sec-title">Competitor price movements feed</h2>
              </div>
              <button type="button" className="expand-btn" aria-label="Open">
                <Icon name="arrow-square-out" />
              </button>
            </div>
            {COMPETITOR_FEED.map((item) => (
              <div key={item.title} className="feed-item">
                <div className="feed-title">{item.title}</div>
                <div className="feed-time tnum">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="c2-col">
          <h2 className="sec-title">Source freshness</h2>
          <div className="card" style={COMPACT_CARD}>
            {SOURCE_FRESHNESS.map((source) => (
              <div key={source.name} className="kv">
                <span>{source.name}</span>
                <span className="tnum" style={{ color: source.color }}>
                  <span className="dot" style={{ background: source.color }} />
                  {source.age}
                </span>
              </div>
            ))}
          </div>

          <h2 className="sec-title" style={{ marginTop: 'var(--s8)' }}>
            Gap analysis
          </h2>
          <div className="card" style={COMPACT_CARD}>
            {GAP_ANALYSIS.map((row) => (
              <div key={row.category} className="kv">
                <span>{row.category}</span>
                <span className={cx('pct', toneOf(row.gap), 'tnum')}>{signedPct(row.gap)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
