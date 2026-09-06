import { useMemo } from 'react';
import { useRouter } from '@/routing/RouterContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { Segmented } from '@/components/common/Segmented';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard } from '@/components/common/ChartCard';
import { Table, type TableColumn } from '@/components/common/Table';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';
import { asChartDetailKey } from './keys';
import { buildChartDetails } from './definitions';
import { usePortalData } from '@/state/DataContext';
import { useDashboardRange } from '@/state/RangeContext';
import { isRangeId } from '@/data/ranges';

export const chartDetailMeta = ({ chartKey, chartDetails }: ScreenMetaInput): ScreenMeta => {
  const chart = chartDetails.copy.charts[chartKey];
  return { section: chart.section, page: chart.title, width: 1180 };
};

export function ChartDetailScreen() {
  const { navigate, param } = useRouter();
  const chartKey = asChartDetailKey(param);
  const { series, chartDetails } = usePortalData();
  const copy = chartDetails.copy;
  // Shared with the boards, so expanding a chart keeps the window it was
  // showing rather than resetting to the default.
  const { chosen, choose } = useDashboardRange();
  const range = chosen ?? copy.defaultRange;
  const definition = useMemo(
    () => buildChartDetails(series, copy, range)[chartKey],
    [series, copy, range, chartKey],
  );

  const columns: TableColumn[] = definition.columns.map((header, index) => ({
    className: index === 0 ? 'tc-110' : 'tc',
    header,
    label: header,
  }));

  const rows = definition.rows.map((row, rowIndex) => ({
    key: `${String(row[0])}-${rowIndex}`,
    cells: row.map((value, index) => ({
      content: value,
      className: index === 0 ? undefined : 'tnum',
    })),
  }));

  return (
    <>
      <div className="cd-head">
        <button
          type="button"
          className="cd-back"
          aria-label={`${copy.backPrefix}${definition.section}`}
          onClick={() => navigate(definition.back)}
        >
          <Icon name="arrow-left" />
        </button>
        <div className="q-title grow">
          <h1 className="page-title">{definition.title}</h1>
          <p className="page-sub">{definition.subtitle}</p>
        </div>
        <div className="dash-actions">
          <Segmented
            items={copy.rangeOptions}
            defaultValue={copy.defaultRange}
            value={range}
            onChange={(next) => {
              if (isRangeId(next)) choose(next);
            }}
          />
          <ToastButton className="btn" message={copy.exportMessage}>
            <Icon name={copy.exportIcon} /> {copy.exportLabel}
          </ToastButton>
        </div>
      </div>

      <div className="kpi-row">
        {definition.stats.map((stat, index) => (
          <KpiCard
            key={stat.label}
            index={index}
            label={stat.label}
            value={stat.value}
            delta={stat.delta || null}
            direction={stat.direction || 'up'}
            tone={stat.direction === 'up' ? 'pos' : 'neg'}
          />
        ))}
      </div>

      <ChartCard className="cd-chart" legend={definition.legend}>
        {(hidden) => definition.chart(hidden)}
      </ChartCard>

      <div className="cd-cols">
        <div>
          <h2 className="sec-title-16" style={{ marginBottom: 'var(--s8)' }}>
            {copy.dataTitle}
          </h2>
          <Table columns={columns} rows={rows} rowStaggerMs={35} />
        </div>
        <div>
          <h2 className="sec-title-16" style={{ marginBottom: 'var(--s8)' }}>
            {copy.notesTitle}
          </h2>
          <div className="card pad cd-notes">
            {definition.notes.map((note) => (
              <div key={note} className="cd-note">
                <span className="cd-bullet">
                  <Icon name="lightbulb" />
                </span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
