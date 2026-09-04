import { useChartFocus } from '@/state/ChartFocusContext';
import { useRouter } from '@/routing/RouterContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { Segmented } from '@/components/common/Segmented';
import { KpiCard } from '@/components/common/KpiCard';
import { ChartCard } from '@/components/common/ChartCard';
import { Table, type TableColumn } from '@/components/common/Table';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';
import { CHART_DETAILS } from './definitions';

const RANGE_OPTIONS = ['4W', '8W', '13W', 'ALL'];

export const chartDetailMeta = ({ chartKey }: ScreenMetaInput): ScreenMeta => {
  const definition = CHART_DETAILS[chartKey];
  return { section: definition.section, page: definition.title, width: 1180 };
};

export function ChartDetailScreen() {
  const { chartKey } = useChartFocus();
  const { navigate } = useRouter();
  const definition = CHART_DETAILS[chartKey];

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
          aria-label={`Back to ${definition.section}`}
          onClick={() => navigate(definition.back)}
        >
          <Icon name="arrow-left" />
        </button>
        <div className="q-title grow">
          <h1 className="page-title">{definition.title}</h1>
          <p className="page-sub">{definition.subtitle}</p>
        </div>
        <div className="dash-actions">
          <Segmented options={RANGE_OPTIONS} defaultValue="8W" />
          <ToastButton className="btn" message="Chart data exported">
            <Icon name="export" /> Export data
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
            direction={stat.direction}
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
            Underlying data
          </h2>
          <Table columns={columns} rows={rows} rowStaggerMs={35} />
        </div>
        <div>
          <h2 className="sec-title-16" style={{ marginBottom: 'var(--s8)' }}>
            What the data shows
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
