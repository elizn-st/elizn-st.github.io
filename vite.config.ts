import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Firebase config the app cannot start without. `src/lib/firebase.ts` throws on
 * a missing project id, and because it now sits in the app's module graph that
 * throw happens before React mounts -- a blank page, not a degraded one.
 *
 * `.env.development` is only loaded in development mode, so a production build
 * sees none of these unless they come from `.env.production` or the build
 * environment. Checking here converts that into a failed build, which surfaces
 * in CI, instead of a deploy that looks green and serves an empty document.
 *
 * loadEnv merges process.env, so CI can supply these as environment variables
 * (GitHub repo variables) rather than committing a file.
 */
const REQUIRED_IN_PRODUCTION = [
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_APP_ID',
] as const;

const assertProductionEnv = (mode: string): void => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required Firebase config for a production build:\n` +
        missing.map((key) => `  - ${key}`).join('\n') +
        `\n\nSupply them in .env.production or the build environment. ` +
        `See .env.production.example.`,
    );
  }

  // A demo project only exists inside the emulators, which do not run on the
  // machine serving the built app -- so this would deploy a sign-in form
  // pointed at the visitor's own localhost.
  const projectId = env.VITE_FIREBASE_PROJECT_ID!;
  if (projectId.startsWith('demo-')) {
    throw new Error(
      `VITE_FIREBASE_PROJECT_ID is "${projectId}". A "demo-" project has no ` +
        `cloud counterpart and resolves to the local emulators, so it cannot ` +
        `back a production build. Use a real project id.`,
    );
  }
};

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') assertProductionEnv(mode);

  return {
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
