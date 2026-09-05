import { useState } from 'react';
import { cx } from '@/lib/cx';
import { useRouter } from '@/routing/RouterContext';
import { useOverlays } from '@/state/OverlayContext';
import { usePortalData } from '@/state/DataContext';
import { useInterval } from '@/hooks/useInterval';
import { Icon } from '@/components/common/Icon';
import { Breadcrumb } from './Breadcrumb';

export interface TopbarProps {
  readonly section: string | null;
  readonly page: string;
  readonly navOpen: boolean;
  readonly onToggleNav: () => void;
}

/** The bell re-pulses on this cadence to hint at live activity. */
const BELL_PULSE_INTERVAL_MS = 12_000;

export function Topbar({ section, page, navOpen, onToggleNav }: TopbarProps) {
  const { navigate, back } = useRouter();
  const { openSearch, openNotifications } = useOverlays();
  const { navigation } = usePortalData();
  const copy = navigation.copy;
  /** Bumping the key remounts the dot, which restarts its CSS animation. */
  const [pulseKey, setPulseKey] = useState(0);

  useInterval(() => setPulseKey((key) => key + 1), BELL_PULSE_INTERVAL_MS);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger"
          aria-label={copy.openMenuLabel}
          aria-expanded={navOpen}
          onClick={onToggleNav}
        >
          <Icon name="list" />
        </button>
        <a className="logo" href="#/home">
          <span className="logo-mark">{copy.logoMark}</span>
          <span className="logo-word">{copy.logoWord}</span>
        </a>
        <div className="crumb-wrap">
          <button className="back-btn" aria-label={copy.backLabel} onClick={back}>
            <Icon name="arrow-left" />
          </button>
          <Breadcrumb section={section} page={page} />
        </div>
      </div>
      <div className="topbar-right">
        <button className="featured-icon" aria-label={copy.searchLabel} onClick={openSearch}>
          <Icon name="magnifying-glass" />
        </button>
        <button
          className="featured-icon"
          aria-label={copy.analystLabel}
          onClick={() => navigate('chat')}
        >
          <Icon name="chats" />
        </button>
        <button
          className="featured-icon"
          aria-label={copy.notificationsLabel}
          onClick={() => {
            setPulseKey((key) => key + 1);
            openNotifications();
          }}
        >
          <Icon name="bell" />
          <span key={pulseKey} className={cx('indicator', pulseKey > 0 && 'is-pulsing')} />
        </button>
      </div>
    </header>
  );
}
