/** The identity the app cares about, independent of who authenticated it. */
export interface AuthUser {
  readonly uid: string;
  readonly email: string;
  readonly displayName: string;
}

/**
 * Codes are a superset of the Firebase Auth errors we expect to surface, so
 * the Firebase backend can map `auth/wrong-password` and friends onto these
 * without the login form learning anything about Firebase.
 */
export type AuthErrorCode =
  | 'invalid-email'
  | 'weak-password'
  | 'invalid-credentials'
  | 'user-disabled'
  | 'too-many-requests'
  | 'network'
  | 'unknown';

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
  }
}

/**
 * Everything the app needs from an authentication provider.
 *
 * `subscribe` deliberately mirrors Firebase's `onAuthStateChanged`: it fires
 * once with the restored session (or null) and again on every change, and
 * returns its own unsubscribe. That shape is what makes the real backend a
 * thin adapter rather than a rewrite -- see src/auth/placeholderBackend.ts for
 * the stand-in currently in use.
 */
export interface AuthBackend {
  subscribe(onChange: (user: AuthUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
