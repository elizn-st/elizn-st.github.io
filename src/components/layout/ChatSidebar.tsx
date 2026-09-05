import { useState } from 'react';
import { usePortalData } from '@/state/DataContext';
import { cx } from '@/lib/cx';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { SearchField } from '@/components/common/SearchField';

/**
 * Conversation rail beside the AI analyst. It stays mounted so the selected
 * conversation survives navigating away and back.
 */
export function ChatSidebar({ hidden }: { readonly hidden: boolean }) {
  const { chat } = usePortalData();
  const copy = chat.copy;
  const [active, setActive] = useState(
    () => chat.sessions.find((session) => session.active)?.title ?? '',
  );

  return (
    <aside className="chat-sb" hidden={hidden}>
      <div className="sb-head">
        <div className="sb-title-row">
          <h2 className="sb-h">{copy.sidebarTitle}</h2>
          <ToastButton className="btn-new" message={copy.newMessage}>
            <Icon name="plus" /> {copy.newLabel}
          </ToastButton>
        </div>
        <SearchField
          placeholder={copy.sidebarSearchPlaceholder}
          ariaLabel={copy.sidebarSearchAriaLabel}
          grow={false}
        />
      </div>
      <div className="sessions">
        {chat.sessions.map((session) => (
          <button
            key={session.title}
            type="button"
            className={cx('session', session.title === active && 'is-active')}
            onClick={() => setActive(session.title)}
          >
            <span className="session-top">
              <span className="session-title">{session.title}</span>
              <span className="session-date tnum">{session.date}</span>
            </span>
            <span className="session-sub">{session.subtitle}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
