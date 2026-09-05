import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { firebaseAuthBackend } from '@/auth/firebaseBackend';
import type { ReactNode } from 'react';
import type { AuthBackend, AuthUser } from '@/auth/types';

/**
 * Three states, not two. `loading` covers the gap before the backend has
 * reported a restored session. Firebase resolves persistence asynchronously,
 * so without this the gate would render the login screen for a frame on every
 * refresh, even for a signed-in user.
 */
export type AuthState =
  | { readonly status: 'loading'; readonly user: null }
  | { readonly status: 'signed-out'; readonly user: null }
  | { readonly status: 'signed-in'; readonly user: AuthUser };

export interface AuthContextValue {
  readonly state: AuthState;
  /** Rejects with an AuthError; the form catches it and renders the message. */
  readonly signIn: (email: string, password: string) => Promise<void>;
  readonly signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  readonly children: ReactNode;
  /** Injectable so a test or a story can stand in for Firebase. */
  readonly backend?: AuthBackend;
}

export function AuthProvider({ children, backend = firebaseAuthBackend }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(
    () =>
      backend.subscribe((user) =>
        setState(user ? { status: 'signed-in', user } : { status: 'signed-out', user: null }),
      ),
    [backend],
  );

  // Sign-in and sign-out do not set state here: the backend's subscription is
  // the single source of truth, so both paths converge on one code path and
  // cannot disagree.
  const signIn = useCallback(
    (email: string, password: string) => backend.signIn(email, password),
    [backend],
  );

  const signOut = useCallback(() => backend.signOut(), [backend]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, signIn, signOut }),
    [state, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
