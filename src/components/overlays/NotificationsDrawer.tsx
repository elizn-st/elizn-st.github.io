import { useState } from 'react';
import { cx } from '@/lib/cx';
import { NOTIFICATION_GROUPS, NOTIFICATION_TABS } from '@/data/notifications';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useOverlays } from '@/state/OverlayContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';

const ITEM_BASE_DELAY_MS = 60;
const ITEM_STAGGER_MS = 50;

export function NotificationsDrawer() {
  const { notificationsOpen, closeNotifications } = useOverlays();
  const [activeTab, setActiveTab] = useState(NOTIFICATION_TABS[0]);

  useBodyScrollLock(notificationsOpen);

  return (
    <>
      <div
        className={cx('scrim', notificationsOpen && 'is-on')}
        onClick={closeNotifications}
        aria-hidden="true"
      />
      <aside
        className={cx('notif-drawer', notificationsOpen && 'is-open')}
        aria-label="Notifications"
      >
        <div className="nd-head">
          <div>
            <h2 className="nd-title">Notifications</h2>
            <p className="nd-sub tnum">3 unread · 7 total</p>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <ToastButton className="btn" message="All notifications marked as read">
              <Icon name="checks" /> Mark all read
            </ToastButton>
            <button
              type="button"
              className="icon-sq"
              aria-label="Close"
              onClick={closeNotifications}
            >
              <Icon name="x" />
            </button>
          </div>
        </div>

        <div className="nd-tabs">
          {NOTIFICATION_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cx('nd-tab', tab === activeTab && 'is-active')}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="nd-body">
          {NOTIFICATION_GROUPS.map((group) => (
            <div key={group.label} className="nd-group">
              <div className="nd-group-label">{group.label}</div>
              {group.items.map((item, index) => (
                <article
                  key={item.title}
                  className={cx('nd-item', item.severity, item.unread && 'is-unread')}
                  style={{ animationDelay: `${ITEM_BASE_DELAY_MS + index * ITEM_STAGGER_MS}ms` }}
                >
                  <span className="nd-icon">
                    <Icon name={item.icon} fill />
                  </span>
                  <div className="grow">
                    <div className="nd-item-head">
                      <span className="nd-item-title">{item.title}</span>
                      {item.unread && <span className="nd-dot" />}
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
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
