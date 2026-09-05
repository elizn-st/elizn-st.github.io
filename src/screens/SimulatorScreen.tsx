import type { CSSProperties } from 'react';
import type { ComparisonTone } from '@/data/simulator';
import { usePortalData } from '@/state/DataContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCards } from '@/components/common/KpiCard';
import { Slider } from '@/components/common/Slider';
import { Table, uniformColumns } from '@/components/common/Table';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const simulatorMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'sim'),
  width: 892,
});

const TONE_COLORS: Record<ComparisonTone, string> = {
  pos: 'var(--ok)',
  neg: 'var(--bad)',
  '': 'var(--n80)',
};

const toneStyle = (tone: ComparisonTone): CSSProperties => ({
  fontWeight: tone ? 600 : 400,
  color: TONE_COLORS[tone],
});

export function SimulatorScreen() {
  const { simulator } = usePortalData();
  const copy = simulator.copy;
  const rows = simulator.comparisonRows.map((row) => ({
    key: row.metric,
    cells: [
      { content: row.metric },
      { content: row.current, className: 'tnum' },
      { content: row.recommendation, className: 'tnum', style: toneStyle(row.recommendationTone) },
      { content: row.scenario, className: 'tnum', style: toneStyle(row.scenarioTone) },
    ],
  }));

  return (
    <>
      <div className="q-head">
        <div className="q-title">
          <h1 className="d-title">{copy.title}</h1>
          <span className="chip-sm">{copy.chip}</span>
        </div>
        <ToastButton className="btn btn-soft" message={copy.submitMessage}>
          <Icon name={copy.submitIcon} /> {copy.submitLabel}
        </ToastButton>
      </div>

      <div className="sim-cols">
        <div className="sim-col">
          <h2 className="sec-title-16">{copy.inputsTitle}</h2>
          <div className="card slider-card">
            {simulator.scenarioInputs.map((input) => (
              <Slider
                key={input.name}
                name={input.name}
                min={input.min}
                max={input.max}
                defaultValue={input.value}
              />
            ))}
          </div>
        </div>
        <div className="sim-col">
          <h2 className="sec-title-16">{copy.forecastTitle}</h2>
          <div className="kpi-grid4">
            <KpiCards kpis={simulator.kpis} />
          </div>
        </div>
      </div>

      <h2 className="sec-title-16">{copy.comparisonTitle}</h2>
      <Table columns={uniformColumns(copy.columns)} rows={rows} />
    </>
  );
}
