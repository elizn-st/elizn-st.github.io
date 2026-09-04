import { useState } from 'react';
import { cx } from '@/lib/cx';
import { CYCLE_DAYS, HOME_ALERTS } from '@/data/home';
import { useDelayedWidth } from '@/hooks/useDelayedWidth';
import { useOverlays } from '@/state/OverlayContext';
import { Icon } from '@/components/common/Icon';
import { GoButton } from '@/components/common/GoButton';
import { KpiCard } from '@/components/common/KpiCard';
import { NotificationRow } from '@/components/common/NotificationRow';
import type { ScreenMeta } from '@/routing/screens';

export const homeMeta: ScreenMeta = { section: null, page: 'Home', width: 892 };

const REVIEW_PROGRESS_PERCENT = 33;
const PROGRESS_DELAY_MS = 200;
const ALERT_BASE_DELAY_MS = 120;
const ALERT_STAGGER_MS = 70;

function CycleWeek() {
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      CYCLE_DAYS.findIndex((day) => day.state === 'today'),
    ),
  );

  return (
    <div className="cycle-week">
      <div className="cycle-days">
        {CYCLE_DAYS.map((day, index) => (
          <div
            key={day.day}
            className={cx(
              'cycle-day',
              day.state === 'today' ? undefined : day.state,
              index === selected && 'today',
            )}
          >
            <span className="cycle-dow">{day.dow}</span>
            <button type="button" className="item-day tnum" onClick={() => setSelected(index)}>
              {day.day}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewProgress() {
  const width = useDelayedWidth(REVIEW_PROGRESS_PERCENT, PROGRESS_DELAY_MS);
  return (
    <div className="next-action">
      <div className="prog-head">
        <span className="t">Cycle review progress</span>
        <span className="v tnum">42 of 128</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width }} />
      </div>
    </div>
  );
}

function PlanCard({
  to,
  icon,
  title,
  subtitle,
}: {
  readonly to: 'queue' | 'c1';
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
}) {
  return (
    <GoButton to={to} className="plan-card" press>
      <span className="plan-top">
        <span className="sweep" />
        <span className="plan-icon">
          <Icon name={icon} />
        </span>
        <span className="plan-title">{title}</span>
      </span>
      <span className="plan-bottom">
        <span className="plan-sub">{subtitle}</span>
        <span className="plan-go">
          <Icon name="caret-right" />
        </span>
      </span>
    </GoButton>
  );
}

export function HomeScreen() {
  const { openNotifications } = useOverlays();

  return (
    <>
      <div className="home-header">
        <div className="greeting">
          <h1>Good morning, Aisha</h1>
          <p>
            Repricing cycle <strong>Aug 05 – Aug 11</strong> completed
          </p>
        </div>
        <CycleWeek />
      </div>

      <div className="grid-2">
        <div className="g2-col">
          <ReviewProgress />
          <div className="cards-row">
            <PlanCard
              to="queue"
              icon="list-checks"
              title="Recommendations"
              subtitle="128 pending approval"
            />
            <PlanCard to="c1" icon="chart-line" title="Dashboards" subtitle="Pricing & Forecast" />
          </div>
        </div>
        <div className="g2-col">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Alerts (3)</span>
              <button type="button" className="panel-link" onClick={openNotifications}>
                See all
              </button>
            </div>
            <div className="notif-list">
              {HOME_ALERTS.map((alert, index) => (
                <NotificationRow
                  key={`${alert.title}-${index}`}
                  severity={alert.severity}
                  icon={alert.icon}
                  title={alert.title}
                  time={alert.time}
                  delayMs={ALERT_BASE_DELAY_MS + index * ALERT_STAGGER_MS}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard
          index={0}
          label="Pending approval"
          value="128"
          delta="+9.3%"
          direction="up"
          graph
        />
        <KpiCard index={1} label="Overdue" value="6" delta="-2" direction="up" graph />
        <KpiCard index={2} label="Anomaly flags" value="14" delta="+5" direction="down" graph />
        <KpiCard
          index={3}
          label="Revenue uplift, week"
          value="+3.4%"
          delta="+0.8pp"
          direction="up"
          graph
        />
      </div>
    </>
  );
}
