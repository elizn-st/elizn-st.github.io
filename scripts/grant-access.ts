/**
 * Grants a user the custom claims firestore.rules requires.
 *
 *   npm run grant -- you@example.test            # emulator, portalAccess
 *   npm run grant -- you@example.test --admin    # also client-write access
 *   npm run grant -- you@eand.com --prod         # a real project
 *
 * Reads require `portalAccess`; being signed in is not enough, because
 * email/password sign-up is open and this repository is public. `admin`
 * additionally permits client writes to org data.
 *
 * Claims land in the user's ID token, so they take effect on the next token
 * refresh -- sign out and back in, or wait about an hour.
 */
import { readFileSync } from 'node:fs';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const AUTH_EMULATOR_HOST = '127.0.0.1:9099';

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith('--'));
const toProd = args.includes('--prod');
const asAdmin = args.includes('--admin');

if (!email) {
  console.error('Usage: npm run grant -- <email> [--admin] [--prod]');
  process.exit(1);
}

const projectId = (() => {
  if (!toProd) return 'demo-adpa';
  const rc = JSON.parse(readFileSync(new URL('../.firebaserc', import.meta.url), 'utf8')) as {
    projects?: Record<string, string>;
  };
  const id = rc.projects?.prod;
  if (!id) throw new Error('No "prod" alias in .firebaserc.');
  return id;
})();

if (!toProd) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= AUTH_EMULATOR_HOST;
} else if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error(
    'Granting claims on a real project needs a service account key.\n' +
      '  Firebase Console -> Project settings -> Service accounts -> Generate new private key\n' +
      '  then: GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npm run grant -- <email> --prod',
  );
}

initializeApp(toProd ? { projectId, credential: applicationDefault() } : { projectId });
const auth = getAuth();

const user = await auth.getUserByEmail(email).catch(() => null);
if (!user) {
  console.error(
    `No account for ${email} on ${projectId}.\n` +
      'The user has to sign up first -- claims attach to an existing account.',
  );
  process.exit(1);
}

// Merge rather than replace: setCustomUserClaims overwrites the whole object.
const claims = { ...user.customClaims, portalAccess: true, ...(asAdmin ? { admin: true } : {}) };
await auth.setCustomUserClaims(user.uid, claims);

console.log(`Granted ${JSON.stringify(claims)} to ${email} on ${projectId}.`);
console.log('Takes effect on the next ID token refresh -- sign out and back in.');
