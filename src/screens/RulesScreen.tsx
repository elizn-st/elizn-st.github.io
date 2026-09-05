import { usePortalData } from '@/state/DataContext';
import { GoButton } from '@/components/common/GoButton';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const rulesMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'rules'),
  width: 892,
});

export function RulesScreen() {
  const { rules } = usePortalData();
  return (
    <div className="card pad" style={{ textAlign: 'center', padding: 'var(--s48)' }}>
      <h1 className="page-title" style={{ marginBottom: 'var(--s8)' }}>
        {rules.copy.title}
      </h1>
      <p className="page-sub" style={{ maxWidth: '440px', margin: '0 auto var(--s16)' }}>
        {rules.copy.body}
      </p>
      <GoButton to="home" className="btn">
        {rules.copy.backLabel}
      </GoButton>
    </div>
  );
}
