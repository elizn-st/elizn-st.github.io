import { useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { useDelayedWidth } from '@/hooks/useDelayedWidth';
import { useOverlays } from '@/state/OverlayContext';
import { Icon } from '@/components/common/Icon';
import { GoButton } from '@/components/common/GoButton';
import { KpiCards } from '@/components/common/KpiCard';
import { NotificationRow } from '@/components/common/NotificationRow';
import type { RouteId } from '@/routing/routeIds';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const homeMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'home'),
  width: 892,
});

const PROGRESS_DELAY_MS = 200;
const ALERT_BASE_DELAY_MS = 120;
const ALERT_STAGGER_MS = 70;

function CycleWeek() {
  const { home } = usePortalData();
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      home.cycleDays.findIndex((day) => day.state === 'today'),
    ),
  );

  return (
    <div className="cycle-week">
      <div className="cycle-days">
        {home.cycleDays.map((day, index) => (
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
  const { home } = usePortalData();
  const width = useDelayedWidth(home.copy.progressPercent, PROGRESS_DELAY_MS);
  return (
    <div className="next-action">
      <div className="prog-head">
        <span className="t">{home.copy.progressTitle}</span>
        <span className="v tnum">{home.copy.progressValue}</span>
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
  readonly to: RouteId;
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
  const { home, identity } = usePortalData();
  const { openNotifications } = useOverlays();
  const copy = home.copy;

  return (
    <>
      <div className="home-header">
        <div className="greeting">
          <h1>
            {copy.greetingPrefix}, {identity.firstName}
          </h1>
          <p>
            {copy.cycleIntro} <strong>{copy.cycleRange}</strong> {copy.cycleOutro}
          </p>
        </div>
        <CycleWeek />
      </div>

      <div className="grid-2">
        <div className="g2-col">
          <ReviewProgress />
          <div className="cards-row">
            {copy.planCards.map((card) => (
              <PlanCard
                key={card.title}
                to={card.to}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
              />
            ))}
          </div>
        </div>
        <div className="g2-col">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">{copy.alertsTitle}</span>
              <button type="button" className="panel-link" onClick={openNotifications}>
                {copy.alertsLink}
              </button>
            </div>
            <div className="notif-list">
              {home.alerts.map((alert, index) => (
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
        <KpiCards kpis={home.kpis} />
      </div>
    </>
  );
}
