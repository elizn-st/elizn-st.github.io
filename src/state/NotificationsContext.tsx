import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface NotificationsValue {
  /** True once the session has marked everything read. */
  readonly allRead: boolean;
  readonly markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsValue | null>(null);

/**
 * Whether this session has dismissed its unread notifications.
 *
 * Deliberately session-only: the notifications themselves are shared copy in
 * `content/notifications`, not per-person records, so there is nowhere honest
 * to store one reader's progress through them. Persisting that needs a real
 * per-user notification collection, which is the same future work as the
 * "View details" links. A reload therefore brings the unread marks back.
 *
 * It lives above the shell because two siblings read it: the drawer, and the
 * unread dot on the topbar's bell.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [allRead, setAllRead] = useState(false);
  const markAllRead = useCallback(() => setAllRead(true), []);
  const value = useMemo<NotificationsValue>(
    () => ({ allRead, markAllRead }),
    [allRead, markAllRead],
  );
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationsRead(): NotificationsValue {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error('useNotificationsRead must be used inside <NotificationsProvider>');
  return value;
}
