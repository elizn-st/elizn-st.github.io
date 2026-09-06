import { useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { useDelayedWidth } from '@/hooks/useDelayedWidth';
import { useOverlays } from '@/state/OverlayContext';
import { activityFor, cycleKpis, cycleMetricText, progressOf } from '@/data/cycleMetrics';
import { Icon } from '@/components/common/Icon';
import { GoButton } from '@/components/common/GoButton';
import { KpiCards } from '@/components/common/KpiCard';
import { NotificationRow } from '@/components/common/NotificationRow';
import type { KeyboardEvent } from 'react';
import type { CycleDay, HomeCopy } from '@/data/home';
import type { CycleProgress } from '@/data/cycleMetrics';
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

/** Arrow keys walk the strip; Home and End jump to its ends. */
const ARROW_STEPS: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

interface CycleWeekProps {
  readonly days: readonly CycleDay[];
  readonly selected: string;
  readonly label: string;
  readonly onSelect: (day: string) => void;
}

/**
 * The cycle strip: a single-select control over the days of the cycle.
 *
 * Selection is a roving tabindex rather than seven tab stops, which is what
 * the pattern asks for and what makes the strip usable from the keyboard --
 * the day buttons are one control, not seven.
 */
function CycleWeek({ days, selected, label, onSelect }: CycleWeekProps) {
  const [focusRequest, setFocusRequest] = useState<string | null>(null);
  const index = days.findIndex((day) => day.day === selected);

  const move = (next: number) => {
    // Wraps, so the strip has no dead ends: Left on Wed lands on Tue.
    const day = days[((next % days.length) + days.length) % days.length];
    if (!day) return;
    onSelect(day.day);
    setFocusRequest(day.day);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      move(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      move(days.length - 1);
      return;
    }
    const step = ARROW_STEPS[event.key];
    if (step === undefined) return;
    event.preventDefault();
    move(index + step);
  };

  return (
    <div className="cycle-week">
      <div className="cycle-days" role="group" aria-label={label} onKeyDown={onKeyDown}>
        {days.map((day) => {
          const isSelected = day.day === selected;
          return (
            <div
              key={day.day}
              className={cx(
                'cycle-day',
                day.state === 'past' && 'past',
                day.state === 'today' && 'is-today',
                isSelected && 'is-selected',
              )}
            >
              <span className="cycle-dow">{day.dow}</span>
              <button
                type="button"
                className="item-day tnum"
                // The day of the week sits outside the button, so the button
                // would otherwise announce a bare number.
                aria-label={`${day.dow} ${day.day}`}
                aria-pressed={isSelected}
                // Marks the real today, which is not always the selection.
                aria-current={day.state === 'today' ? 'date' : undefined}
                tabIndex={isSelected ? 0 : -1}
                ref={(node) => {
                  if (node && focusRequest === day.day) {
                    node.focus();
                    setFocusRequest(null);
                  }
                }}
                onClick={() => onSelect(day.day)}
              >
                {day.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewProgress({
  copy,
  progress,
}: {
  readonly copy: HomeCopy;
  readonly progress: CycleProgress;
}) {
  const width = useDelayedWidth(progress.percent, PROGRESS_DELAY_MS);
  return (
    <div className="next-action">
      <div className="prog-head">
        <span className="t">{copy.progressTitle}</span>
        <span className="v tnum">
          {progress.done} {copy.progressJoin} {progress.total}
        </span>
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
  const { home, cycle, identity } = usePortalData();
  const { openNotifications } = useOverlays();
  const copy = home.copy;
  const days = home.cycleDays;
  const [chosen, setChosen] = useState('');

  // The reader's choice only stands while that day is still in the strip: a
  // Console edit that renames or drops a day falls back to today rather than
  // emptying the screen. Same shape as the boards' `chosen ?? defaultRange`.
  const today = days.find((day) => day.state === 'today')?.day ?? days[0]?.day ?? '';
  const selected = days.some((day) => day.day === chosen) ? chosen : today;
  const day = days.find((entry) => entry.day === selected);

  const activity = activityFor(cycle.days, selected);
  const progress = progressOf(activity);
  const alerts = home.alerts.filter((alert) => alert.day === selected);
  const stateLabel =
    day?.state === 'past'
      ? copy.dayPastLabel
      : day?.state === 'today'
        ? copy.dayTodayLabel
        : copy.dayUpcomingLabel;

  return (
    <>
      <div className="home-header">
        <div className="greeting">
          <h1>
            {copy.greetingPrefix}, {identity.firstName}
          </h1>
          <p>
            {copy.cycleIntro} <strong>{copy.cycleRange}</strong>
            {day && (
              <>
                {' · '}
                {day.dow} {day.day} {stateLabel}
              </>
            )}
          </p>
        </div>
        <CycleWeek
          days={days}
          selected={selected}
          label={copy.cycleDaysLabel}
          onSelect={setChosen}
        />
      </div>

      <div className="grid-2">
        <div className="g2-col">
          <ReviewProgress copy={copy} progress={progress} />
          <div className="cards-row">
            {copy.planCards.map((card) => (
              <PlanCard
                key={card.title}
                to={card.to}
                icon={card.icon}
                title={card.title}
                subtitle={
                  card.metric
                    ? `${cycleMetricText(card.metric, activity)} ${card.subtitle}`
                    : card.subtitle
                }
              />
            ))}
          </div>
        </div>
        <div className="g2-col">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">
                {copy.alertsTitle} <span className="tnum">({alerts.length})</span>
              </span>
              <button type="button" className="panel-link" onClick={openNotifications}>
                {copy.alertsLink}
              </button>
            </div>
            <div className="notif-list">
              {alerts.length === 0 ? (
                <p className="notif-empty">{copy.alertsEmpty}</p>
              ) : (
                alerts.map((alert, index) => (
                  <NotificationRow
                    key={`${alert.title}-${index}`}
                    severity={alert.severity}
                    icon={alert.icon}
                    title={alert.title}
                    time={alert.time}
                    delayMs={ALERT_BASE_DELAY_MS + index * ALERT_STAGGER_MS}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCards
          kpis={cycleKpis(home.kpis, cycle.days, selected)}
          scoreLabel={copy.compareLabel}
        />
      </div>
    </>
  );
}
