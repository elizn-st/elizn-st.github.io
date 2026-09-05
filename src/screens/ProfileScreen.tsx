import { cx } from '@/lib/cx';
import { usePortalData } from '@/state/DataContext';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCards } from '@/components/common/KpiCard';
import { Switch } from '@/components/common/Switch';
import { useAuth } from '@/state/AuthContext';
import { breadcrumb } from '@/routing/screens';
import type { ScreenMeta, ScreenMetaInput } from '@/routing/screens';

export const profileMeta = ({ navigation }: ScreenMetaInput): ScreenMeta => ({
  ...breadcrumb(navigation, 'profile'),
  width: 1060,
});

export function ProfileScreen() {
  const { profile, identity } = usePortalData();
  const { signOut } = useAuth();
  const copy = profile.copy;

  return (
    <>
      <div className="pf-hero card">
        <span className="pf-avatar">{identity.initials}</span>
        <div className="grow">
          <h1 className="page-title">{identity.fullName}</h1>
          <p className="page-sub">{identity.headline}</p>
          <div className="pf-tags">
            <span className="chip-sm">{identity.email}</span>
            <span className="chip-sm">{identity.employeeId}</span>
            <span className="chip-sm">{identity.location}</span>
          </div>
        </div>
        <div className="row" style={{ gap: '8px', alignSelf: 'flex-start' }}>
          <ToastButton className="btn" message={copy.editMessage}>
            <Icon name={copy.editIcon} /> {copy.editLabel}
          </ToastButton>
          <button type="button" className="btn" onClick={() => void signOut()}>
            <Icon name={copy.signOutIcon} /> {copy.signOutLabel}
          </button>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCards kpis={profile.kpis} />
      </div>

      <div className="pf-cols">
        <div className="pf-col">
          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              {copy.personalTitle}
            </h2>
            <div className="pf-fields">
              <label>
                <span className="field-label">{copy.fullNameLabel}</span>
                <input className="input" defaultValue={identity.fullName} />
              </label>
              <label>
                <span className="field-label">{copy.jobTitleLabel}</span>
                <input className="input" defaultValue={identity.jobTitle} />
              </label>
              <label>
                <span className="field-label">{copy.departmentLabel}</span>
                <input className="input" defaultValue={identity.department} />
              </label>
              <label>
                <span className="field-label">{copy.workEmailLabel}</span>
                <input className="input" defaultValue={identity.email} />
              </label>
              <label>
                <span className="field-label">{copy.timeZoneLabel}</span>
                <select className="select" defaultValue={copy.timeZones[0]}>
                  {copy.timeZones.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">{copy.languageLabel}</span>
                <select className="select" defaultValue={copy.languages[0]}>
                  {copy.languages.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--s16)' }}>
              <ToastButton className="btn btn-primary" message={copy.saveMessage}>
                {copy.saveLabel}
              </ToastButton>
            </div>
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s4)' }}>
              {copy.preferencesTitle}
            </h2>
            <p className="sec-sub" style={{ marginBottom: 'var(--s12)' }}>
              {copy.preferencesSubtitle}
            </p>
            {profile.notificationPreferences.map((preference) => (
              <label key={preference.title} className="pf-toggle-row">
                <span className="grow">
                  <span className="pf-toggle-t">{preference.title}</span>
                  <span className="pf-toggle-s">{preference.subtitle}</span>
                </span>
                <Switch defaultChecked={preference.enabled} label={preference.title} />
              </label>
            ))}
          </div>
        </div>

        <div className="pf-col">
          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s4)' }}>
              {copy.permissionsTitle}
            </h2>
            <p className="sec-sub" style={{ marginBottom: 'var(--s12)' }}>
              {copy.permissionsSubtitle}
            </p>
            {profile.permissions.map((permission) => (
              <div key={permission.title} className="pf-perm">
                <span className={cx('pf-perm-ic', permission.state)}>
                  <Icon name={permission.state === 'allowed' ? 'check' : 'lock-simple'} />
                </span>
                <span className="grow">
                  <span className="pf-toggle-t">{permission.title}</span>
                  <span className="pf-toggle-s">{permission.subtitle}</span>
                </span>
                <span
                  className={cx(
                    'badge',
                    permission.state === 'allowed' ? 'badge-approved' : 'badge-neutral',
                  )}
                >
                  {permission.state === 'allowed' ? copy.allowedLabel : copy.deniedLabel}
                </span>
              </div>
            ))}
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              {copy.sessionsTitle}
            </h2>
            {profile.deviceSessions.map((device) => (
              <div key={device.title} className="pf-perm">
                <span className={cx('pf-perm-ic', device.current && 'allowed')}>
                  <Icon name={device.icon} />
                </span>
                <span className="grow">
                  <span className="pf-toggle-t">{device.title}</span>
                  <span className="pf-toggle-s">{device.subtitle}</span>
                </span>
                <span className="pf-when tnum">{device.when}</span>
                {!device.current && (
                  <ToastButton className="pf-revoke" message={copy.revokeMessage}>
                    {copy.revokeLabel}
                  </ToastButton>
                )}
              </div>
            ))}
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--s12)' }}>
              <ToastButton className="btn" message={copy.signOutEverywhereMessage}>
                {copy.signOutEverywhereLabel}
              </ToastButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
