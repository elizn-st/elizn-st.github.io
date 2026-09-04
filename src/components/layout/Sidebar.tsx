import { cx } from '@/lib/cx';
import { NAV_ITEMS } from '@/data/navigation';
import type { RouteId } from '@/routing/routeIds';
import { Icon } from '@/components/common/Icon';
import { GoButton } from '@/components/common/GoButton';

export interface SidebarProps {
  /** Nav entry to highlight for the current route. */
  readonly activeNav: RouteId;
  readonly onCollapseToggle: () => void;
  /** Closes the mobile drawer once a destination is chosen. */
  readonly onNavigate: () => void;
}

export function Sidebar({ activeNav, onCollapseToggle, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="nav-group">
        {NAV_ITEMS.map((item) => (
          <GoButton
            key={item.id}
            to={item.id}
            className={cx(
              'nav-item',
              item.disabled && 'is-disabled',
              item.id === activeNav && 'is-active',
            )}
            disabled={item.disabled}
            onNavigate={onNavigate}
          >
            <span className="nav-icon">
              <Icon name={item.icon} />
            </span>
            <span className="nav-label">{item.label}</span>
          </GoButton>
        ))}
      </div>
      <div className="nav-spacer" />
      <button className="nav-item" onClick={onCollapseToggle}>
        <span className="nav-icon">
          <Icon name="sidebar-simple" />
        </span>
        <span className="nav-label collapse-label">Collapse panel</span>
      </button>
      <div className="nav-divider" />
      <GoButton to="profile" className="profile-card" onNavigate={onNavigate}>
        <span className="avatar">AK</span>
        <span className="profile-info">
          <span className="profile-name">Aisha</span>
          <span className="profile-role">Finance · Senior Analyst</span>
        </span>
      </GoButton>
    </aside>
  );
}
