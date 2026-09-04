import { GoButton } from '@/components/common/GoButton';
import type { ScreenMeta } from '@/routing/screens';

export const rulesMeta: ScreenMeta = { section: null, page: 'Rules', width: 892 };

export function RulesScreen() {
  return (
    <div className="card pad" style={{ textAlign: 'center', padding: 'var(--s48)' }}>
      <h1 className="page-title" style={{ marginBottom: 'var(--s8)' }}>
        Pricing rules
      </h1>
      <p className="page-sub" style={{ maxWidth: '440px', margin: '0 auto var(--s16)' }}>
        Guardrails, floors and ceilings live here. The Finance role has read-only access this cycle.
      </p>
      <GoButton to="home" className="btn">
        Back to home
      </GoButton>
    </div>
  );
}
