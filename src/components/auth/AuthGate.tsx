import { useAuth } from '@/state/AuthContext';
import { LoginScreen } from './LoginScreen';
import type { ReactNode } from 'react';

export interface AuthGateProps {
  readonly children: ReactNode;
}

/**
 * Decides between the splash, the login screen and the app. The shell is not
 * rendered at all while signed out, so the sidebar, topbar and overlays never
 * appear around a login form.
 *
 * The hash is left untouched: a signed-out visitor opening #/queue signs in and
 * lands on the queue, because the router keeps reading the same URL underneath.
 */
export function AuthGate({ children }: AuthGateProps) {
  const { state } = useAuth();

  if (state.status === 'loading') {
    // The mark inside fades in on a delay (see .auth-splash-mark), so a session
    // that restores in a frame or two shows nothing rather than a flicker.
    return (
      <div className="auth-splash">
        <span className="logo auth-splash-mark">
          <span className="logo-mark">e&amp;</span>
          <span className="logo-word">ADPA</span>
        </span>
      </div>
    );
  }

  if (state.status === 'signed-out') return <LoginScreen />;

  return <>{children}</>;
}
