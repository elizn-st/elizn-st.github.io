import { DEVICE_SESSIONS, NOTIFICATION_PREFERENCES, PERMISSIONS } from '@/data/profile';
import { cx } from '@/lib/cx';
import { Icon } from '@/components/common/Icon';
import { ToastButton } from '@/components/common/ToastButton';
import { KpiCard } from '@/components/common/KpiCard';
import { Switch } from '@/components/common/Switch';
import type { ScreenMeta } from '@/routing/screens';

export const profileMeta: ScreenMeta = { section: null, page: 'Profile', width: 1060 };

const TIME_ZONES = ['Gulf Standard Time (GST, +4)', 'UTC'];
const LANGUAGES = ['English', 'العربية — not in scope this phase'];

export function ProfileScreen() {
  return (
    <>
      <div className="pf-hero card">
        <span className="pf-avatar">AK</span>
        <div className="grow">
          <h1 className="page-title">Aisha Al-Khayyat</h1>
          <p className="page-sub">Finance · Senior Analyst · Pricing governance</p>
          <div className="pf-tags">
            <span className="chip-sm">aisha.alkhayyat@eand.com</span>
            <span className="chip-sm">Employee ID 40 128</span>
            <span className="chip-sm">Dubai, GST +4</span>
          </div>
        </div>
        <div className="row" style={{ gap: '8px', alignSelf: 'flex-start' }}>
          <ToastButton className="btn" message="Profile editor opened">
            <Icon name="pencil-simple" /> Edit profile
          </ToastButton>
          <ToastButton className="btn" message="Signed out">
            <Icon name="sign-out" /> Sign out
          </ToastButton>
        </div>
      </div>

      <div className="kpi-row">
        <KpiCard index={0} label="Decisions this cycle" value="42" delta="+18" direction="up" />
        <KpiCard
          index={1}
          label="Approval rate"
          value="88.1%"
          delta="+1.4pp"
          direction="up"
          tone="pos"
        />
        <KpiCard index={2} label="Avg review time" value="2m 14s" delta="-22s" direction="up" />
        <KpiCard index={3} label="Overrides used" value="3" delta="-1" direction="up" />
      </div>

      <div className="pf-cols">
        <div className="pf-col">
          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              Personal details
            </h2>
            <div className="pf-fields">
              <label>
                <span className="field-label">Full name</span>
                <input className="input" defaultValue="Aisha Al-Khayyat" />
              </label>
              <label>
                <span className="field-label">Job title</span>
                <input className="input" defaultValue="Senior Analyst" />
              </label>
              <label>
                <span className="field-label">Department</span>
                <input className="input" defaultValue="Finance" />
              </label>
              <label>
                <span className="field-label">Work email</span>
                <input className="input" defaultValue="aisha.alkhayyat@eand.com" />
              </label>
              <label>
                <span className="field-label">Time zone</span>
                <select className="select" defaultValue={TIME_ZONES[0]}>
                  {TIME_ZONES.map((zone) => (
                    <option key={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Language</span>
                <select className="select" defaultValue={LANGUAGES[0]}>
                  {LANGUAGES.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--s16)' }}>
              <ToastButton className="btn btn-primary" message="Profile details saved">
                Save changes
              </ToastButton>
            </div>
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s4)' }}>
              Notification preferences
            </h2>
            <p className="sec-sub" style={{ marginBottom: 'var(--s12)' }}>
              Applies to the bell in the top bar and to email digests.
            </p>
            {NOTIFICATION_PREFERENCES.map((preference) => (
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
              Role and permissions
            </h2>
            <p className="sec-sub" style={{ marginBottom: 'var(--s12)' }}>
              Granted by the DLA governance matrix. Contact Admin to change.
            </p>
            {PERMISSIONS.map((permission) => (
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
                  {permission.state === 'allowed' ? 'Allowed' : 'No access'}
                </span>
              </div>
            ))}
          </div>

          <div className="card pad">
            <h2 className="sec-title" style={{ marginBottom: 'var(--s12)' }}>
              Active sessions
            </h2>
            {DEVICE_SESSIONS.map((device) => (
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
                  <ToastButton className="pf-revoke" message="Session revoked">
                    Revoke
                  </ToastButton>
                )}
              </div>
            ))}
            <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--s12)' }}>
              <ToastButton className="btn" message="All other sessions signed out">
                Sign out everywhere else
              </ToastButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
