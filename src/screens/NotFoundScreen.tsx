import { BUILD } from '@/config';
import { GoButton } from '@/components/common/GoButton';
import type { ScreenMeta } from '@/routing/screens';

export const notFoundMeta: ScreenMeta = { section: null, page: 'Screen not found', width: 892 };

/** Shown for any hash that does not resolve to a screen in this build. */
export function NotFoundScreen({ route }: { readonly route: string }) {
  return (
    <div className="card pad" style={{ textAlign: 'center', padding: 'var(--s48)' }}>
      <h1 className="page-title" style={{ marginBottom: 'var(--s8)' }}>
        Screen “{route}” is not in this build
      </h1>
      <p className="page-sub" style={{ maxWidth: '520px', margin: '0 auto var(--s16)' }}>
        Build <strong className="tnum">{BUILD}</strong> does not contain this route. If you expected
        it, the browser is serving a cached bundle — reload with cache disabled.
      </p>
      <div className="row" style={{ justifyContent: 'center', gap: '8px' }}>
        <GoButton to="home" className="btn btn-primary">
          Go to Home
        </GoButton>
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          Reload without cache
        </button>
      </div>
    </div>
  );
}
