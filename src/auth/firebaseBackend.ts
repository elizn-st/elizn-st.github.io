import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthError } from './types';
import type { User } from 'firebase/auth';
import type { AuthBackend, AuthErrorCode, AuthUser } from './types';

/**
 * Email/password sign-in against Firebase Auth. Session persistence, token
 * refresh and restore-on-load are the SDK's job; this only adapts its shapes
 * to the app's `AuthBackend` contract.
 */

/** `aisha.alkhayyat@eand.com` -> `Aisha Alkhayyat`. */
const nameFromEmail = (email: string): string =>
  email
    .slice(0, email.indexOf('@'))
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || email;

/**
 * Firebase leaves `displayName` null for accounts created with email and
 * password unless someone calls updateProfile, so the local part of the address
 * stands in until a profile document supplies a real name.
 */
const toAuthUser = (user: User): AuthUser => {
  const email = user.email ?? '';
  return {
    uid: user.uid,
    email,
    displayName: user.displayName?.trim() || (email ? nameFromEmail(email) : user.uid),
  };
};

/**
 * Firebase error codes -> the app's codes.
 *
 * `invalid-credential` is what a project with email enumeration protection
 * returns instead of distinguishing `user-not-found` from `wrong-password`.
 * All three collapse to one message on purpose: telling an attacker which
 * half was wrong is exactly what that protection exists to prevent.
 */
const CODES: Record<string, AuthErrorCode> = {
  'auth/invalid-email': 'invalid-email',
  'auth/missing-email': 'invalid-email',
  'auth/user-disabled': 'user-disabled',
  'auth/user-not-found': 'invalid-credentials',
  'auth/wrong-password': 'invalid-credentials',
  'auth/invalid-credential': 'invalid-credentials',
  'auth/invalid-login-credentials': 'invalid-credentials',
  'auth/weak-password': 'weak-password',
  'auth/missing-password': 'weak-password',
  'auth/too-many-requests': 'too-many-requests',
  'auth/network-request-failed': 'network',
};

const toAuthError = (cause: unknown): AuthError => {
  const code = (cause as { code?: string }).code;
  if (code && CODES[code]) return new AuthError(CODES[code]);
  // Anything unmapped keeps its provider detail in the console for us while the
  // UI shows the generic message -- a raw `Firebase: Error (auth/...)` string
  // is not something to put in front of a user.
  console.error('[auth] unmapped Firebase error', cause);
  return new AuthError('unknown');
};

export const firebaseAuthBackend: AuthBackend = {
  subscribe(onChange) {
    /**
     * The SDK restores the profile it cached in browser storage, so a display
     * name set on the server -- by an administrator, or by the seed -- never
     * reaches a session that is already signed in. Refreshing it once per
     * account fixes that without delaying the first render: the cached user is
     * reported immediately and the refreshed one replaces it.
     */
    const refreshed = new Set<string>();

    // Fires once with the restored session (or null) and again on every change,
    // which is what the gate's `loading` state waits for.
    return onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          onChange(null);
          return;
        }
        onChange(toAuthUser(user));
        if (refreshed.has(user.uid)) return;
        refreshed.add(user.uid);
        void user
          .reload()
          .then(() => onChange(toAuthUser(user)))
          .catch((cause: unknown) => console.warn('[auth] could not refresh profile', cause));
      },
      (cause) => {
        console.error('[auth] auth state listener failed', cause);
        onChange(null);
      },
    );
  },

  async signIn(email, password) {
    const trimmed = email.trim();

    // Cheap local guards only, to avoid a round trip that cannot succeed.
    // Firebase remains the authority on whether credentials are valid.
    if (!trimmed) throw new AuthError('invalid-email');
    if (!password) throw new AuthError('weak-password');

    try {
      await signInWithEmailAndPassword(auth, trimmed, password);
    } catch (cause) {
      throw toAuthError(cause);
    }
  },

  async signOut() {
    await firebaseSignOut(auth);
  },
};
