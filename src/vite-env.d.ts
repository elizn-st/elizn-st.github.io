/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Firebase web app config. Local development reads these from
   * .env.development, which points at the offline `demo-adpa` project; a
   * production build has to supply a real project's values.
   */
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  /**
   * Forces emulator routing for a real project id. A `demo-` prefixed id
   * already implies it, so this is only needed to test a real project's
   * config against local emulators.
   */
  readonly VITE_FIREBASE_EMULATORS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
