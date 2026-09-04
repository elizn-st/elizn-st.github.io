import type { CSSProperties } from 'react';
import { COMPARISON_ROWS, SCENARIO_INPUTS, type ComparisonTone } from '@/data/simulator';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCard } from '@/components/common/KpiCard';
import { Slider } from '@/components/common/Slider';
import { Table, uniformColumns } from '@/components/common/Table';
import type { ScreenMeta } from '@/routing/screens';

export const simulatorMeta: ScreenMeta = {
  section: 'Recommendations',
  page: 'What-if simulator',
  width: 892,
};

const COLUMNS = uniformColumns(['Metric', 'Current price', 'AI recommendation', 'Your scenario']);

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
  const rows = COMPARISON_ROWS.map((row) => ({
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
          <h1 className="d-title">Scenario simulation</h1>
          <span className="chip-sm">iPhone 15 Pro 256GB</span>
        </div>
        <ToastButton
          className="btn btn-soft"
          message="Scenario submitted as alternative recommendation"
        >
          <Icon name="check-circle" /> Submit as alternative
        </ToastButton>
      </div>

      <div className="sim-cols">
        <div className="sim-col">
          <h2 className="sec-title-16">Scenario inputs</h2>
          <div className="card slider-card">
            {SCENARIO_INPUTS.map((input) => (
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
          <h2 className="sec-title-16">Forecast impact</h2>
          <div className="kpi-grid4">
            <KpiCard
              index={0}
              label="Sales volume"
              value="+9.2%"
              delta="+9.2%"
              direction="up"
              tone="pos"
            />
            <KpiCard
              index={1}
              label="Revenue"
              value="+2.1%"
              delta="+2.1%"
              direction="up"
              tone="pos"
            />
            <KpiCard
              index={2}
              label="Margin"
              value="-1.4%"
              delta="-1.4%"
              direction="down"
              tone="neg"
            />
            <KpiCard
              index={3}
              label="Market share"
              value="+0.6pp"
              delta="+0.6pp"
              direction="up"
              tone="pos"
            />
          </div>
        </div>
      </div>

      <h2 className="sec-title-16">Comparison with your scenario</h2>
      <Table columns={COLUMNS} rows={rows} />
    </>
  );
}
