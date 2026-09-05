import { useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useOverlays } from '@/state/OverlayContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';

const ITEM_BASE_DELAY_MS = 60;
const ITEM_STAGGER_MS = 50;

export function NotificationsDrawer() {
  const { notifications } = usePortalData();
  const copy = notifications.copy;
  const { notificationsOpen, closeNotifications } = useOverlays();
  const [activeTab, setActiveTab] = useState(notifications.tabs[0]);

  useBodyScrollLock(notificationsOpen);

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
            <p className="nd-sub tnum">{copy.subtitle}</p>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <ToastButton className="btn" message={copy.markAllMessage}>
              <Icon name={copy.markAllIcon} /> {copy.markAllLabel}
            </ToastButton>
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
          {notifications.groups.map((group) => (
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
