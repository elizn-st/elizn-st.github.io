import { cx } from '@/lib/cx';
import { signedInt, toneOf } from '@/lib/format';
import { FACTOR_CONTRIBUTIONS, GUARDRAILS, HISTORY_PREVIEW, REASON_CODES } from '@/data/detail';
import { PRICE_HISTORY, WEEK_LABELS } from '@/data/series';
import { useDelayedWidth } from '@/hooks/useDelayedWidth';
import { useRouter } from '@/routing/RouterContext';
import { Icon } from '@/components/common/Icon';
import { GoButton } from '@/components/common/GoButton';
import { ToastButton } from '@/components/common/ToastButton';
import { StatusBadge } from '@/components/common/Badge';
import { ChartCard } from '@/components/common/ChartCard';
import { ChartHead } from '@/components/common/ChartHead';
import { LineChart } from '@/components/charts/LineChart';
import { GuardrailGauge } from '@/components/charts/GuardrailGauge';
import type { ScreenMeta } from '@/routing/screens';

export const detailMeta: ScreenMeta = {
  section: 'Recommendations',
  page: 'Recommendation detail',
  width: 1060,
};

const FACTOR_BASE_DELAY_MS = 260;
const FACTOR_STAGGER_MS = 70;
/** The bar reads as a share of the strongest factor, not of 100%. */
const FACTOR_SCALE = 1.6;

const GUARDRAIL_BANDS = [
  { label: 'Safe', color: '#3DCC87' },
  { label: 'Caution', color: '#EDA12F' },
  { label: 'Near ceiling', color: '#E62E2E' },
];

const asMoney = (value: number) => `AED ${Math.round(value).toLocaleString()}`;

function FactorRow({
  name,
  value,
  index,
}: {
  readonly name: string;
  readonly value: number;
  readonly index: number;
}) {
  const width = useDelayedWidth(
    Math.min(100, Math.abs(value) * FACTOR_SCALE),
    FACTOR_BASE_DELAY_MS + index * FACTOR_STAGGER_MS,
  );
  return (
    <div className="factor">
      <div className="factor-head">
        <span>{name}</span>
        <span className={cx('pct', toneOf(value), 'tnum')}>{signedInt(value)}</span>
      </div>
      <div className="factor-bar">
        <div className="factor-fill" style={{ width }} />
      </div>
    </div>
  );
}

export function DetailScreen() {
  const { navigate } = useRouter();

  return (
    <>
      <div className="card d-header">
        <span className="thumb">
          <Icon name="device-mobile" />
        </span>
        <div className="grow">
          <h1 className="d-title">iPhone 15 Pro 256GB</h1>
          <div className="d-meta">
            <span className="chip-sm">Smartphones</span>
            <span className="chip-sm">Apple</span>
            <span className="chip-sm tnum">SKU-114872</span>
          </div>
        </div>
        <div className="price-display">
          <div className="p-cur">
            <div className="price-label">Current price</div>
            <div className="price-value tnum">AED 3,899</div>
          </div>
          <span className="muted">
            <Icon name="arrow-right" />
          </span>
          <div className="p-rec">
            <div className="price-label">Recommended</div>
            <div className="price-value tnum">AED 3,749</div>
          </div>
          <span className="pct down tnum">−3.8%</span>
        </div>
      </div>

      <ChartCard
        head={
          <ChartHead
            title="Price history"
            subtitle="e& vs tracked competitors over the last 8 weeks"
            padLeft={40}
            chartKey="b2-price"
          />
        }
        xAxisLabels={WEEK_LABELS}
        legend={[
          { label: 'e&', color: 'var(--dv1)' },
          { label: 'Competitor A', color: 'var(--dv2)' },
          { label: 'Competitor B', color: 'var(--dv3)' },
        ]}
      >
        {(hidden) => (
          <LineChart
            labels={WEEK_LABELS}
            format={asMoney}
            hiddenSeries={hidden}
            series={[
              { name: 'e&', color: 'var(--dv1)', area: true, data: PRICE_HISTORY.eand },
              { name: 'Competitor A', color: 'var(--dv2)', data: PRICE_HISTORY.competitorA },
              { name: 'Competitor B', color: 'var(--dv3)', data: PRICE_HISTORY.competitorB },
            ]}
          />
        )}
      </ChartCard>

      <div className="d-cols">
        <div className="d-col">
          <GoButton to="sim" className="sim-card">
            <span className="sim-icon">
              <Icon name="flask" />
            </span>
            <span className="grow">
              <span className="sec-title" style={{ display: 'block' }}>
                Run scenario simulation
              </span>
              <span className="sec-sub" style={{ display: 'block' }}>
                Test alternative prices and see the predicted revenue impact
              </span>
            </span>
            <span className="plan-go">
              <Icon name="caret-right" />
            </span>
          </GoButton>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              Position within price guardrails
            </h2>
            <GuardrailGauge
              value={GUARDRAILS.value}
              floor={GUARDRAILS.floor}
              ceiling={GUARDRAILS.ceiling}
            />
            <div className="chart-legend" style={{ justifyContent: 'center', paddingTop: 0 }}>
              {GUARDRAIL_BANDS.map((band) => (
                <span key={band.label} className="legend-pill is-on">
                  <span className="sw" style={{ background: band.color }} />
                  {band.label}
                </span>
              ))}
            </div>
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s4)' }}>
              Factor contribution
            </h2>
            {FACTOR_CONTRIBUTIONS.map((factor, index) => (
              <FactorRow key={factor.name} name={factor.name} value={factor.value} index={index} />
            ))}
          </div>
        </div>

        <div className="d-col">
          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              Decision
            </h2>
            <label className="field-label" htmlFor="rc">
              Reason code
            </label>
            <select
              className="select"
              id="rc"
              style={{ marginBottom: 'var(--s12)' }}
              defaultValue={REASON_CODES[0]}
            >
              {REASON_CODES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
            <label className="field-label" htmlFor="cm">
              Comment
            </label>
            <textarea
              className="textarea"
              id="cm"
              placeholder="Optional comment on this decision"
              style={{ marginBottom: 'var(--s16)' }}
            />
            <div className="d-actions">
              <ToastButton className="btn btn-approve" message="Recommendation accepted">
                Accept
              </ToastButton>
              <ToastButton className="btn btn-danger" message="Recommendation rejected">
                Reject
              </ToastButton>
              <ToastButton className="btn" message="Override opened">
                Override
              </ToastButton>
            </div>
          </div>

          <div className="card pad">
            <div className="chart-head">
              <div className="chart-head-t row" style={{ flexWrap: 'wrap' }}>
                <h2 className="sec-title">Decision history</h2>
                <span className="badge badge-neutral tnum">24 total · showing last 5</span>
              </div>
              <button
                type="button"
                className="expand-btn"
                aria-label="Open full history"
                onClick={() => navigate('history')}
              >
                <Icon name="arrow-square-out" />
              </button>
            </div>
            {HISTORY_PREVIEW.map((entry) => (
              <div key={entry.date} className="hist">
                <div className="grow">
                  <div className="hist-date tnum">{entry.date}</div>
                  <div className="hist-reason">{entry.reason}</div>
                </div>
                <StatusBadge status={entry.status} />
                {entry.hasComment && (
                  <span className="muted">
                    <Icon name="chat-circle" />
                  </span>
                )}
                <span className="muted">
                  <Icon name="caret-right" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
