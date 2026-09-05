import { BUILD } from '@/config';
import { usePortalData } from '@/state/DataContext';
import { GoButton } from '@/components/common/GoButton';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const notFoundMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  section: null,
  page: navigation.copy.notFound.page,
  width: 892,
});

/** Shown for any hash that does not resolve to a screen in this build. */
export function NotFoundScreen({ route }: { readonly route: string }) {
  const { navigation } = usePortalData();
  const copy = navigation.copy.notFound;
  return (
    <div className="card pad" style={{ textAlign: 'center', padding: 'var(--s48)' }}>
      <h1 className="page-title" style={{ marginBottom: 'var(--s8)' }}>
        {copy.titlePrefix}
        {route}
        {copy.titleSuffix}
      </h1>
      <p className="page-sub" style={{ maxWidth: '520px', margin: '0 auto var(--s16)' }}>
        {copy.bodyPrefix} <strong className="tnum">{BUILD}</strong> {copy.bodySuffix}
      </p>
      <div className="row" style={{ justifyContent: 'center', gap: '8px' }}>
        <GoButton to="home" className="btn btn-primary">
          {copy.homeLabel}
        </GoButton>
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          {copy.reloadLabel}
        </button>
      </div>
    </div>
  );
}
