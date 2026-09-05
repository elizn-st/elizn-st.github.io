import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { signedInt, toneOf } from '@/lib/format';
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
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const detailMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'detail'),
  width: 1060,
});

const FACTOR_BASE_DELAY_MS = 260;
const FACTOR_STAGGER_MS = 70;
/** The bar reads as a share of the strongest factor, not of 100%. */
const FACTOR_SCALE = 1.6;

/** Which of the three price series is filled; the rest is copy-driven. */
const PRICE_SERIES_FILLED = [true, false, false];

const asMoney = (value: number) => `AED ${Math.round(value).toLocaleString()}`;

/** Button variants are layout, paired with the fetched action labels. */
const DECISION_CLASSES = ['btn btn-approve', 'btn btn-danger', 'btn'];

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
  const { detail, series } = usePortalData();
  const { navigate } = useRouter();
  const copy = detail.copy;

  const priceData = [
    series.priceHistory.eand,
    series.priceHistory.competitorA,
    series.priceHistory.competitorB,
  ];

  return (
    <>
      <div className="card d-header">
        <span className="thumb">
          <Icon name={copy.icon} />
        </span>
        <div className="grow">
          <h1 className="d-title">{copy.title}</h1>
          <div className="d-meta">
            {copy.chips.map((chip, index) => (
              <span
                key={chip}
                className={index === copy.chips.length - 1 ? 'chip-sm tnum' : 'chip-sm'}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="price-display">
          <div className="p-cur">
            <div className="price-label">{copy.currentLabel}</div>
            <div className="price-value tnum">{copy.currentValue}</div>
          </div>
          <span className="muted">
            <Icon name="arrow-right" />
          </span>
          <div className="p-rec">
            <div className="price-label">{copy.recommendedLabel}</div>
            <div className="price-value tnum">{copy.recommendedValue}</div>
          </div>
          <span className="pct down tnum">{copy.deltaValue}</span>
        </div>
      </div>

      <ChartCard
        head={
          <ChartHead
            title={copy.priceChart.title}
            subtitle={copy.priceChart.subtitle}
            padLeft={40}
            chartKey="b2-price"
          />
        }
        xAxisLabels={series.weekLabels}
        legend={copy.priceLegend}
      >
        {(hidden) => (
          <LineChart
            labels={series.weekLabels}
            format={asMoney}
            hiddenSeries={hidden}
            series={copy.priceLegend.map((entry, index) => ({
              name: entry.label,
              color: entry.color,
              area: PRICE_SERIES_FILLED[index] ?? false,
              data: priceData[index] ?? [],
            }))}
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
                {copy.simCardTitle}
              </span>
              <span className="sec-sub" style={{ display: 'block' }}>
                {copy.simCardSubtitle}
              </span>
            </span>
            <span className="plan-go">
              <Icon name="caret-right" />
            </span>
          </GoButton>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              {copy.guardrailTitle}
            </h2>
            <GuardrailGauge
              value={detail.guardrails.value}
              floor={detail.guardrails.floor}
              ceiling={detail.guardrails.ceiling}
            />
            <div className="chart-legend" style={{ justifyContent: 'center', paddingTop: 0 }}>
              {copy.guardrailBands.map((band) => (
                <span key={band.label} className="legend-pill is-on">
                  <span className="sw" style={{ background: band.color }} />
                  {band.label}
                </span>
              ))}
            </div>
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s4)' }}>
              {copy.factorTitle}
            </h2>
            {detail.factorContributions.map((factor, index) => (
              <FactorRow key={factor.name} name={factor.name} value={factor.value} index={index} />
            ))}
          </div>
        </div>

        <div className="d-col">
          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              {copy.decisionTitle}
            </h2>
            <label className="field-label" htmlFor="rc">
              {copy.reasonLabel}
            </label>
            <select
              className="select"
              id="rc"
              style={{ marginBottom: 'var(--s12)' }}
              defaultValue={detail.reasonCodes[0]}
            >
              {detail.reasonCodes.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
            <label className="field-label" htmlFor="cm">
              {copy.commentLabel}
            </label>
            <textarea
              className="textarea"
              id="cm"
              placeholder={copy.commentPlaceholder}
              style={{ marginBottom: 'var(--s16)' }}
            />
            <div className="d-actions">
              {copy.decisionActions.map((action, index) => (
                <ToastButton
                  key={action.label}
                  className={DECISION_CLASSES[index] ?? 'btn'}
                  message={action.message}
                >
                  {action.label}
                </ToastButton>
              ))}
            </div>
          </div>

          <div className="card pad">
            <div className="chart-head">
              <div className="chart-head-t row" style={{ flexWrap: 'wrap' }}>
                <h2 className="sec-title">{copy.historyTitle}</h2>
                <span className="badge badge-neutral tnum">{copy.historyBadge}</span>
              </div>
              <button
                type="button"
                className="expand-btn"
                aria-label={copy.historyAriaLabel}
                onClick={() => navigate('history')}
              >
                <Icon name="arrow-square-out" />
              </button>
            </div>
            {detail.historyPreview.map((entry) => (
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
