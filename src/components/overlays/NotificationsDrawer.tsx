import { useMemo, useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useOverlays } from '@/state/OverlayContext';
import { useNotificationsRead } from '@/state/NotificationsContext';
import { useToast } from '@/state/ToastContext';
import {
  countItems,
  countUnread,
  filterGroups,
  DEFAULT_NOTIFICATION_TAB,
  type NotificationTabId,
} from '@/data/notifications';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';

const ITEM_BASE_DELAY_MS = 60;
const ITEM_STAGGER_MS = 50;

export function NotificationsDrawer() {
  const { notifications } = usePortalData();
  const copy = notifications.copy;
  const { notificationsOpen, closeNotifications } = useOverlays();
  const { allRead, markAllRead } = useNotificationsRead();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<NotificationTabId>(
    () => notifications.tabs[0]?.id ?? DEFAULT_NOTIFICATION_TAB,
  );

  useBodyScrollLock(notificationsOpen);

  const groups = useMemo(
    () => filterGroups(notifications.groups, activeTab),
    [notifications.groups, activeTab],
  );

  // Both figures describe the whole drawer, not the open tab: the header sits
  // above the tabs, so a per-tab count there would read as a total.
  const total = countItems(notifications.groups);
  const unread = allRead ? 0 : countUnread(notifications.groups);

  return (
    <>
      <div
        className={cx('scrim', notificationsOpen && 'is-on')}
        onClick={closeNotifications}
        aria-hidden="true"
      />
      <aside className={cx('notif-drawer', notificationsOpen && 'is-open')} aria-label={copy.title}>
        <div className="nd-head">
          <div>
            <h2 className="nd-title">{copy.title}</h2>
            <p className="nd-sub tnum">
              {unread} {copy.unreadLabel} · {total} {copy.totalLabel}
            </p>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button
              type="button"
              className="btn"
              // Nothing to acknowledge once the count is zero, and the toast
              // would otherwise claim an action that did not happen.
              disabled={unread === 0}
              onClick={() => {
                markAllRead();
                toast(copy.markAllMessage);
              }}
            >
              <Icon name={copy.markAllIcon} /> {copy.markAllLabel}
            </button>
            <button
              type="button"
              className="icon-sq"
              aria-label={copy.closeLabel}
              onClick={closeNotifications}
            >
              <Icon name="x" />
            </button>
          </div>
        </div>

        <div className="nd-tabs">
          {notifications.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx('nd-tab', tab.id === activeTab && 'is-active')}
              aria-pressed={tab.id === activeTab}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="nd-body">
          {groups.length === 0 ? (
            <div className="nd-empty">
              <Icon name={copy.emptyIcon} />
              <p>{copy.emptyMessage}</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="nd-group">
                <div className="nd-group-label">{group.label}</div>
                {group.items.map((item, index) => {
                  const isUnread = item.unread && !allRead;
                  return (
                    <article
                      key={item.title}
                      className={cx('nd-item', item.severity, isUnread && 'is-unread')}
                      style={{
                        animationDelay: `${ITEM_BASE_DELAY_MS + index * ITEM_STAGGER_MS}ms`,
                      }}
                    >
                      <span className="nd-icon">
                        <Icon name={item.icon} fill />
                      </span>
                      <div className="grow">
                        <div className="nd-item-head">
                          <span className="nd-item-title">{item.title}</span>
                          {isUnread && <span className="nd-dot" />}
                        </div>
                        <p className="nd-item-body">{item.body}</p>
                        <div className="nd-meta">
                          <span className="nd-time">{item.time}</span>
                          <ToastButton className="nd-link" message="Opening related screen">
                            View details <Icon name="arrow-right" />
                          </ToastButton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
