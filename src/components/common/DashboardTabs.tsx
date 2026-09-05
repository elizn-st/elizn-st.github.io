import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import type { DashboardTabId } from '@/data/navigation';
import { GoButton } from './GoButton';

/** Horizontal dashboard switcher shared by the five board screens. */
export function DashboardTabs({ active }: { readonly active: DashboardTabId }) {
  const { navigation } = usePortalData();
  return (
    <nav className="tabs">
      {navigation.copy.dashboardTabs.map((tab) => (
        <GoButton key={tab.id} to={tab.id} className={cx('tab', tab.id === active && 'is-active')}>
          {tab.label}
          <span className="u" />
        </GoButton>
      ))}
    </nav>
  );
}
