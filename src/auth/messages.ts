import type { AuthErrorCode } from './types';

/**
 * One place to phrase auth failures. The login form renders whatever this
 * returns, so swapping the backend cannot leak a provider's raw error string
 * (`Firebase: Error (auth/wrong-password).`) into the UI.
 */
const MESSAGES: Record<AuthErrorCode, string> = {
  'invalid-email': 'That does not look like a valid email address.',
  'weak-password': 'Your password is too short.',
  'invalid-credentials': 'Those credentials do not match an account.',
  'user-disabled': 'This account has been disabled. Contact your administrator.',
  'too-many-requests': 'Too many attempts. Wait a moment before trying again.',
  network: 'Could not reach the sign-in service. Check your connection.',
  unknown: 'Something went wrong signing you in. Please try again.',
};

export const authErrorMessage = (code: AuthErrorCode): string => MESSAGES[code];
