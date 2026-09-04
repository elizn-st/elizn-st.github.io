import { useId, useState } from 'react';
import { authErrorMessage } from '@/auth/messages';
import { AuthError } from '@/auth/types';
import { useAuth } from '@/state/AuthContext';
import { Icon } from '@/components/common/Icon';
import { NotificationRow } from '@/components/common/NotificationRow';
import type { AuthErrorCode } from '@/auth/types';

export function LoginScreen() {
  const { signIn } = useAuth();
  const fieldId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setFailure(null);
    setPending(true);
    try {
      await signIn(email, password);
      // No success branch: the auth subscription swaps this screen out, and
      // touching state afterwards would be a write to an unmounted component.
    } catch (cause) {
      setFailure(cause instanceof AuthError ? cause.code : 'unknown');
      setPending(false);
    }
  };

  return (
    <div className="auth-page">
      {/* noValidate: the browser's own bubbles would bypass onSubmit for a
          malformed email and render in the platform's styling rather than
          the portal's. All validation reports through .auth-alert instead.
          type/required stay for the mobile keyboard and aria-required. */}
      <form className="auth-card card" onSubmit={onSubmit} aria-busy={pending} noValidate>
        <div className="auth-brand">
          <span className="logo">
            <span className="logo-mark">e&amp;</span>
            <span className="logo-word">ADPA</span>
          </span>
        </div>

        <div className="auth-head">
          <h1 className="page-title">Sign in</h1>
          <p className="page-sub">Automated Dynamic Pricing &amp; Analytics — governance portal</p>
        </div>

        {/* Politely announced so a screen reader hears the failure without
            stealing focus from the field the user is about to correct. */}
        <div className="auth-alert" role="status" aria-live="polite">
          {failure && (
            <NotificationRow
              severity="critical"
              icon="warning-octagon"
              title={authErrorMessage(failure)}
            />
          )}
        </div>

        <div className="auth-fields">
          <label htmlFor={`${fieldId}-email`}>
            <span className="field-label">Work email</span>
            <input
              id={`${fieldId}-email`}
              className="input"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@eand.com"
              autoComplete="username"
              autoFocus
              required
              disabled={pending}
              aria-invalid={failure === 'invalid-email' || undefined}
            />
          </label>

          <label htmlFor={`${fieldId}-password`}>
            <span className="field-label">Password</span>
            <input
              id={`${fieldId}-password`}
              className="input"
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={pending}
              aria-invalid={
                failure === 'weak-password' || failure === 'invalid-credentials' || undefined
              }
            />
          </label>
        </div>

        <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
          {pending ? (
            <>
              <Icon name="circle-notch" /> Signing in…
            </>
          ) : (
            <>
              <Icon name="sign-in" /> Sign in
            </>
          )}
        </button>

        <p className="auth-foot">
          Access is provisioned by your administrator. Single sign-on is not enabled for this phase.
        </p>
      </form>
    </div>
  );
}
