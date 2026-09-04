# ADPA — Governance Portal

React + TypeScript rebuild of the ADPA pricing governance portal prototype.
Same screens, same interactions, same stylesheet as the original single-file build.

## Commands

```bash
npm install
npm run dev           # Vite dev server
npm run typecheck     # tsc --noEmit
npm run build         # typecheck + production bundle into dist/
npm run preview       # serve the production bundle
npm run format        # prettier --write .
npm run format:check  # prettier --check . (CI-friendly)
npm run emulators     # Firebase Auth + Firestore emulators, state persisted
npm run emulators:fresh   # same, but start from an empty dataset
```

`src/styles/global.css` is in `.prettierignore`: it is the original stylesheet,
authored in a deliberately compact multi-declaration-per-line style, and
reformatting it would triple its length and bury real changes in noise.

## Firebase

Local-only so far. Nothing imports `src/lib/firebase.ts` yet, so the Firebase
SDK is tree-shaken out and the deployed bundle is unchanged.

### Running it

The emulators are driven by the `firebase-tools` CLI, which is **not** a
dependency of this project — installing it here would add ~250 MB and nine
moderate advisories from its own transitive tree to every CI install, for a tool
only ever used locally. Install it globally instead:

```bash
npm install -g firebase-tools    # or: brew install firebase-cli
```

Requires **firebase-tools 14+ and a JDK 21 or newer** — the Firestore emulator
runs on the JVM and v15 of the CLI refuses anything older. The Auth emulator is
pure Node and needs no JDK, so `firebase emulators:start --only auth` works
without one.

Then, in two terminals:

```bash
npm run emulators   # http://127.0.0.1:4000 for the Emulator UI
npm run dev
```

`npm run emulators` reads and writes `.emulator-data/` (gitignored), so users
and documents survive a restart. Data is only flushed on a _graceful_ shutdown,
so stop it with Ctrl-C rather than killing the process.

### Why there is no Firebase login

`.firebaserc` names the project `demo-adpa`. Firebase treats a `demo-` prefix as
reserved for emulation: there is no cloud project behind it, no account or
`firebase login` is needed, and any call that would reach a non-emulated service
fails loudly instead of silently hitting production. The CLI confirms this on
startup:

```
Detected demo project ID "demo-adpa", emulated services will use a demo
configuration and attempts to access non-emulated services for this project
will fail.
```

That is also why `.env.development` is committed — with a demo project the
config values are not secrets and cannot address anything real. A real project's
values belong in `.env.production` (gitignored) or the build environment.

`src/lib/firebase.ts` routes to the emulators whenever the project id starts with
`demo-`, so no flag has to be remembered. `VITE_FIREBASE_EMULATORS=true` forces
the same routing for a real project id.

### Reading data

Reads go through `useFirestoreCollection` / `useFirestoreDoc`
(`src/hooks/useFirestore.ts`), which are `onSnapshot` listeners rather than
one-shot fetches. That is deliberate: a document edited in the Firebase Console
reaches every running app within about a second, with no reload and no refetch
call. `src/repositories/recommendations.ts` is the reference implementation --
it maps documents onto the existing `QueueRow` type from `src/data/queue.ts`, so
screens keep the type they already use.

Because those documents are hand-edited by people, every field is read through a
validating reader (`src/lib/firestore/parse.ts`). Two consequences worth knowing:

- **A malformed document costs you that row, not the screen.** It is left out of
  `data` and reported in `skipped`, with a message naming the document, the
  field, the bad value and what was expected. The rest of the collection keeps
  rendering.
- **Unambiguous type mistakes are absorbed.** The Console's type dropdown makes
  "string" an easy mis-pick on a numeric field, so `"899"` is coerced to `899`
  rather than rejected. Ambiguous or impossible values still fail.

Pass `deps` the primitives a query is derived from, not the query object --
rebuilding a `Query` each render and depending on its identity is the standard
way to get an infinite resubscribe loop.

### Going live, and giving the customer edit access

Nothing above requires a cloud project; all of it runs on the emulators. To let
someone edit data remotely you need a real one:

1. Create a project in the Firebase Console (the free Spark tier is enough).
2. Add a Web app, copy the config.
3. `cp .env.production.example .env.production` and fill it in.
4. `firebase login && firebase use --add` to register the project as an alias
   alongside `demo-adpa`.
5. Seed it, then deploy rules and indexes:
   `firebase deploy --only firestore:rules,firestore:indexes -P <alias>`.

Then add the customer under Project settings → Users and permissions. To edit
Firestore documents in the Console they need Firestore data-write permission
plus Console visibility -- in practice either **Firebase Develop Admin**
(`roles/firebase.developAdmin`), or the more tightly scoped pair
`roles/firebase.viewer` + `roles/datastore.user`. Project **Editor** also works
but grants far more than data editing. Google revises this role catalogue
periodically, so confirm the current wording in the Console rather than trusting
this list.

Two things to keep straight once that is set up:

- **Console edits bypass security rules.** The Console acts with project IAM
  privileges, so the customer can edit documents while `firestore.rules` keeps
  client writes closed. Granting edit access needs no rules change at all.
- **The emulator and the real project are separate datasets.** Console edits do
  not touch `.emulator-data/` and vice versa. That is what makes local work
  safe, but it does mean seeding happens per target, and moving data between
  them goes through `firebase firestore:export` and the emulator's `--import`.

### Notes

- **Rules default to deny.** `firestore.rules` opts each collection in
  explicitly, so a collection added during the mock migration is unreadable
  until a rule exists for it — a loud development error rather than data
  quietly exposed later.
- **Client writes to org data need an `admin` custom claim.** No user carries
  it yet, so today that denies exactly like `if false`; it is written that way
  so an in-app editing screen becomes a claim grant rather than a rules
  rewrite. Roles belong in claims, not documents — a role document would force
  a `get()` inside every rule evaluation, billed as a read on every access.
- **The Auth emulator's warning banner is suppressed.** By default it injects a
  fixed-position element into `document.body`, which would alter the rendered
  DOM that the layout work and its regression checks depend on. `firebase.ts`
  passes `disableWarnings: true` and logs to the console instead.
- **Hosting is not configured.** The app deploys to GitHub Pages via
  `.github/workflows/deploy.yml`, so the Hosting emulator would only be noise.

## Layout

```
src/
  main.tsx                  React entry
  App.tsx                   provider composition
  config.ts                 build stamp
  styles/global.css         the original stylesheet, unchanged
  lib/                      formatting, class-name and motion helpers
  data/                     typed screen content (nav, queue, series, notifications, …)
  hooks/                    useCountUp, useDelayedWidth, useBodyScrollLock, useInterval
  state/                    router-adjacent contexts: toasts, overlays, focused chart
  routing/                  hash router, route ids, screen registry + metadata
  components/
    common/                 KPI cards, tables, legends, sliders, chips, badges …
    charts/                 Sparkline, LineChart, ComboChart, GroupedBarChart, BarChart, Gauge
    layout/                 AppShell, Topbar, Sidebar, ChatSidebar, Breadcrumb
    overlays/               notifications drawer, filter popover, search overlay, toasts
  screens/                  one module per route, each exporting a component + its metadata
```

### How a route renders

`RouterProvider` reads `location.hash` and keeps an explicit navigation trail for the
back arrow. `AppShell` looks the route up in `routing/screenRegistry.ts`, which pairs
each screen component with its `ScreenMeta` — breadcrumb section, page title, content
width (`--cmax`), and whether the chat rail and bottom-anchored layout apply. Unknown
routes fall through to `NotFoundScreen`.

### Conventions

- Entrance animations stay in CSS. Components pass an `index` so staggered delays are
  declarative rather than being scheduled by a post-render DOM sweep.
- `Table` takes column definitions and rows; it mirrors each column name into
  `data-label` so the stacked mobile layout keeps its inline captions.
- `ChartCard` owns legend on/off state and hands the hidden series set to its chart, so
  toggling a series is state, not class manipulation.

### Responsive charts

Charts are authored in a 960-unit coordinate space and stretched to their container with
`width:100%`. Below 960px that scales the whole drawing down — at phone widths the 9px
axis labels landed near 2.5px and the plot was squashed to a sliver. `useChartViewBoxWidth`
measures the rendered box and clamps the viewBox to `min(960, measured)`, so the mapping
stays 1:1 on anything narrower and is untouched at or above the design width. The measured
width is quantised to 8px steps so a scrollbar appearing cannot start a resize loop.

Two knock-on details live in `charts/geometry.ts`: the line chart sizes its left gutter
from the widest formatted tick label (a fixed 40 units clipped "AED 3,543"), and bar
category labels wrap at a space or hyphen, then shrink only if they still do not fit.
