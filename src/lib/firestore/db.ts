import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { firebaseApp, usingEmulators } from '@/lib/firebase';

/**
 * Firestore lives in its own module so importing it is a decision.
 *
 * `firebase/firestore` is roughly 300 kB of the SDK. Keeping it out of
 * `lib/firebase.ts` means a screen that only needs authentication does not
 * carry the query engine, and once routes are code-split only the data screens
 * will pay for it.
 */

// Must agree with the `emulators.firestore` port in firebase.json.
const EMULATOR_HOST = '127.0.0.1';
const FIRESTORE_EMULATOR_PORT = 8080;

declare global {
  // eslint-disable-next-line no-var
  var __adpaFirestoreEmulatorConnected: boolean | undefined;
}

// getFirestore is memoised per app, so this is the same instance across a Vite
// hot reload; the flag on globalThis is what stops a second connect attempt,
// which the SDK treats as an error.
export const db = getFirestore(firebaseApp);

if (usingEmulators && !globalThis.__adpaFirestoreEmulatorConnected) {
  globalThis.__adpaFirestoreEmulatorConnected = true;
  connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
  console.info(`[firestore] routed to local emulator :${FIRESTORE_EMULATOR_PORT}`);
}
