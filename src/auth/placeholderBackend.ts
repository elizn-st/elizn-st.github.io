import { AuthError } from './types';
import type { AuthBackend, AuthUser } from './types';

/**
 * STAND-IN, NOT AUTHENTICATION.
 *
 * This verifies nothing: any syntactically valid email with a long enough
 * password is accepted, and the "session" is a localStorage entry any visitor
 * can write by hand. It exists so the login screen, the three-state gate and
 * the sign-out path can be built and tested before Firebase Auth is wired in,
 * and it is replaced wholesale by a `firebaseAuthBackend` implementing the same
 * `AuthBackend` interface. Nothing outside this file needs to change then.
 */

const SESSION_KEY = 'adpa.placeholder-session';

/** Matches Firebase's own minimum, so the rule does not change later. */
const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Roughly what a round trip feels like, so pending states are visible. */
const FAKE_LATENCY_MS = 450;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** `aisha.alkhayyat@eand.com` -> `Aisha Alkhayyat`. */
const nameFromEmail = (email: string): string =>
  email
    .slice(0, email.indexOf('@'))
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || email;

/** localStorage throws in some privacy modes; a missing session is not an error. */
const readStored = (): AuthUser | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.uid || !parsed.email || !parsed.displayName) return null;
    return { uid: parsed.uid, email: parsed.email, displayName: parsed.displayName };
  } catch {
    return null;
  }
};

const writeStored = (user: AuthUser | null): void => {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // A session that cannot be persisted still works for this tab.
  }
};

const listeners = new Set<(user: AuthUser | null) => void>();
let current: AuthUser | null = null;

const publish = (user: AuthUser | null): void => {
  current = user;
  for (const listener of listeners) listener(user);
};

export const placeholderAuthBackend: AuthBackend = {
  subscribe(onChange) {
    listeners.add(onChange);

    // Asynchronous on purpose. Firebase restores a persisted session after a
    // tick too, and a gate that assumes a synchronous answer flashes the login
    // screen on every refresh.
    const timer = window.setTimeout(() => {
      if (current === null) current = readStored();
      onChange(current);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      listeners.delete(onChange);
    };
  },

  async signIn(email, password) {
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) throw new AuthError('invalid-email');
    if (password.length < MIN_PASSWORD_LENGTH) throw new AuthError('weak-password');

    await delay(FAKE_LATENCY_MS);

    const user: AuthUser = {
      uid: `placeholder:${trimmed.toLowerCase()}`,
      email: trimmed.toLowerCase(),
      displayName: nameFromEmail(trimmed),
    };
    writeStored(user);
    publish(user);
  },

  async signOut() {
    writeStored(null);
    publish(null);
  },
};
