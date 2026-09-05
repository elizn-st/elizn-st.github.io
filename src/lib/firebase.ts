import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';

/**
 * Auth emulator endpoint. Must agree with the `emulators.auth` port in
 * firebase.json; the browser cannot read that file. Firestore has its own
 * pairing in lib/firestore/db.ts.
 */
const EMULATOR_HOST = '127.0.0.1';
const AUTH_EMULATOR_PORT = 9099;

const env = import.meta.env;

const projectId = env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error(
    'VITE_FIREBASE_PROJECT_ID is not set. Local development reads it from ' +
      '.env.development; a production build needs it in the build environment ' +
      '(see .env.production.example).',
  );
}

/**
 * A `demo-` prefixed project id is reserved by Firebase for emulation and has
 * no cloud counterpart, so its presence is itself the signal to route traffic
 * locally. VITE_FIREBASE_EMULATORS forces the same for a real project id.
 */
export const usingEmulators =
  projectId.startsWith('demo-') || env.VITE_FIREBASE_EMULATORS === 'true';

/**
 * A real project needs the full web config; the emulators only care about the
 * project id and accept any non-empty api key. Checking here turns a missing
 * production variable into one clear message at startup instead of an opaque
 * `auth/invalid-api-key` on the first sign-in attempt.
 */
if (!usingEmulators) {
  const missing = (
    [
      ['VITE_FIREBASE_API_KEY', env.VITE_FIREBASE_API_KEY],
      ['VITE_FIREBASE_AUTH_DOMAIN', env.VITE_FIREBASE_AUTH_DOMAIN],
      ['VITE_FIREBASE_APP_ID', env.VITE_FIREBASE_APP_ID],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(
      `Project "${projectId}" is not a demo project, so the full web config is ` +
        `required. Missing: ${missing.join(', ')}. Copy .env.production.example ` +
        'and fill in the values from Firebase Console → Project settings → Your apps.',
    );
  }
}

const options: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? 'demo-api-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
  projectId,
  appId: env.VITE_FIREBASE_APP_ID,
};

// getApps() survives a Vite HMR re-evaluation of this module, because the SDK
// itself is a pre-bundled dependency and is not invalidated. That makes it a
// reliable "have we already done first-time setup" flag.
const existingApps = getApps();
const isFirstInit = existingApps.length === 0;

export const firebaseApp: FirebaseApp = isFirstInit ? initializeApp(options) : existingApps[0]!;
export const auth = getAuth(firebaseApp);

if (isFirstInit && usingEmulators) {
  // Must land before the first auth operation, hence module scope; isFirstInit
  // stops a hot reload from connecting twice.
  //
  // disableWarnings is not cosmetic here: the Auth emulator otherwise injects
  // a fixed-position banner element into document.body, which would change the
  // rendered DOM the layout and its regression checks depend on. The console
  // line below keeps the signal without touching the page.
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`, {
    disableWarnings: true,
  });

  console.info(`[firebase] project "${projectId}" auth routed to emulator :${AUTH_EMULATOR_PORT}`);
} else if (isFirstInit) {
  console.info(`[firebase] project "${projectId}" — live Firebase, not emulated`);
}
