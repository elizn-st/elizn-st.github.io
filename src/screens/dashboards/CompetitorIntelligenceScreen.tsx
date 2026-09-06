import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { categoryPrices, gapAnalysis } from '@/data/boardMetrics';
import { signedPct, toneOf } from '@/lib/format';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { GroupedBarChart } from '@/components/charts/GroupedBarChart';
import { Icon } from '@/components/common/Icon';
import { DashboardShell, dashboardMeta } from './DashboardShell';

export const competitorIntelligenceMeta = dashboardMeta('c2');

const COMPACT_CARD = { padding: '4px var(--s16)' } as const;

export function CompetitorIntelligenceScreen() {
  const { dashboards, series, boards } = usePortalData();
  const board = boards.copy.boards.c2;
  const [feedTitle, freshnessTitle, gapTitle] = board.sectionTitles;

  return (
    <DashboardShell tab="c2">
      {(range) => (
        <>
          <ChartCard
            head={
              <ChartHead
                title={board.chart.copy.title}
                subtitle={board.chart.copy.subtitle}
                padLeft={40}
                chartKey="c2-grouped"
              />
            }
            legend={board.chart.legend}
          >
            {(hidden) => (
              <GroupedBarChart rows={categoryPrices(series, range)} hiddenSeries={hidden} />
            )}
          </ChartCard>

          <div className="c2-cols">
            <div className="c2-col">
              <div className="card pad">
                <div className="chart-head">
                  <div className="chart-head-t">
                    <h2 className="sec-title">{feedTitle}</h2>
                  </div>
                  <button type="button" className="expand-btn" aria-label={boards.copy.expandLabel}>
                    <Icon name="arrow-square-out" />
                  </button>
                </div>
                {dashboards.competitorFeed.map((item) => (
                  <div key={item.title} className="feed-item">
                    <div className="feed-title">{item.title}</div>
                    <div className="feed-time tnum">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="c2-col">
              <h2 className="sec-title">{freshnessTitle}</h2>
              <div className="card" style={COMPACT_CARD}>
                {dashboards.sourceFreshness.map((source) => (
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
                {gapTitle}
              </h2>
              <div className="card" style={COMPACT_CARD}>
                {gapAnalysis(series, range).map((row) => (
                  <div key={row.category} className="kv">
                    <span>{row.category}</span>
                    <span className={cx('pct', toneOf(row.gap), 'tnum')}>{signedPct(row.gap)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
