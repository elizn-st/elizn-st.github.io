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
npm run seed          # load src/data/* into Firestore (add -- --prod for the real project)
npm run grant -- <email>  # grant portalAccess (add --admin, --prod as needed)
```

`src/styles/global.css` is in `.prettierignore`: it is the original stylesheet,
authored in a deliberately compact multi-declaration-per-line style, and
reformatting it would triple its length and bury real changes in noise.

## Firebase

Auth is wired and every screen reads its content from Firestore. The modules in
`src/data/` are no longer read by the app: they are the seed fixture and the home
of the shared types, which is why the interfaces and unions still live there.

Navigation is content too: the sidebar labels, icons and dashboard tabs live in
`content/navigation`. Only the `id`s stay code-shaped -- they name routes that
must exist in the bundle -- so the parser validates every one against
`ROUTE_IDS` and `DASHBOARD_TAB_IDS`, and a Console typo fails with a named field
instead of a dead link. `navHighlightFor` remains a pure function in
`src/data/navigation.ts`.

`firebase/auth` costs about 105 kB raw (31 kB gzipped). `firebase/firestore` is
another ~300 kB, which is why it is initialised in its own module
(`src/lib/firestore/db.ts`) rather than alongside auth -- importing it is a
decision, so a build that only authenticates does not carry the query engine.

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

### Authentication

`AuthProvider` (`src/state/AuthContext.tsx`) exposes three states -- `loading`,
`signed-out`, `signed-in` -- and `AuthGate` maps them to a splash, the login
screen and the app. The `loading` state is not optional: Firebase resolves
persistence asynchronously, so a two-state gate renders the login screen for a
frame on every refresh, even for a signed-in user.

Everything provider-specific lives behind the `AuthBackend` interface
(`src/auth/types.ts`), whose `subscribe` mirrors `onAuthStateChanged`. The
Firebase implementation is `src/auth/firebaseBackend.ts`; `AuthProvider` takes a
`backend` prop, so a test can substitute one without touching the UI.

Two behaviours are deliberate:

- **Credential failures collapse to a single message.** `auth/wrong-password`,
  `auth/user-not-found` and `auth/invalid-credential` all render "Those
  credentials do not match an account." Distinguishing them is exactly what
  Firebase's email-enumeration protection exists to prevent. Unmapped codes log
  the provider's detail to the console and show a generic message, so a raw
  `Firebase: Error (auth/...)` string never reaches a user.
- **`displayName` falls back to the email's local part.** Firebase leaves it
  null for email/password accounts, so `aisha.alkhayyat@eand.com` would render
  as "Aisha Alkhayyat". The seed sets a real `displayName` on the account, and
  `subscribe` refreshes the cached profile once per session, so the fallback is
  a safety net rather than the normal path.

To sign in locally, create a user in the Emulator UI at
`http://127.0.0.1:4000/auth`, or from a shell:

```bash
curl -X POST "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key" \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@eand.com","password":"emulator-only","returnSecureToken":true}'
```

Emulator accounts are wiped unless `.emulator-data/` is preserved, which
`npm run emulators` does on a graceful shutdown.

Sign-out is wired to the button that already existed on the Profile screen; its
markup is unchanged.

### A production build fails without real config

`.env.development` is loaded only in development mode, and `src/lib/firebase.ts`
now sits in the app's module graph -- it throws on a missing project id before
React mounts, which is a blank page rather than a degraded one. `vite.config.ts`
therefore refuses to complete a production build unless the full web config is
present, and rejects a `demo-` project id outright, since that resolves to
emulators the visitor's machine will not be running.

That failure is intentional: it lands in CI rather than in front of users. Until
a real project exists, `npm run build` and the Pages workflow will fail, and the
last good deploy keeps serving. `loadEnv` merges `process.env`, so CI can supply
the values as GitHub repo variables instead of a committed file.

### Reading data

Reads go through `useFirestoreCollection` / `useFirestoreDoc`
(`src/hooks/useFirestore.ts`), which are `onSnapshot` listeners rather than
one-shot fetches. That is deliberate: a document edited in the Firebase Console
reaches every running app within about a second, with no reload and no refetch
call.

`DataProvider` (`src/state/DataContext.tsx`) owns every subscription -- five
collections, nineteen shared documents and the signed-in user's own -- and
gates the app on the first snapshot, so `usePortalData()` returns plain loaded
values and screens stay synchronous. The alternative -- a request and a skeleton
per screen -- would mean a loading state per screen for a few kilobytes and
would change what every screen renders; this way their markup is identical to
the version that imported the static modules.

### What is data, and what is not

Everything a reader sees is data: headings, chips, button labels, scorecard
figures, table headers, chart titles and legends, pager labels, placeholders,
even the breadcrumb labels and the empty-search hint. `src/data/` is now the
seed fixture and the type definitions -- one definition of each shape, with the
values living in Firestore -- and no screen imports a figure from it. What it
still exports to the app is pure functions: `filterSearchIndex`,
`navHighlightFor`, and the derivations behind the two filters (`ranges.ts`,
`boardMetrics.ts` and `chartMetrics.ts` for the dashboards' window;
`cycleMetrics.ts` for the home screen's cycle day).

What stays in code is the frame the copy is poured into:

- **Layout and geometry** -- CSS class names, SVG padding, chart heights,
  column widths, content column widths. A customer editing an axis inset can
  only break the chart.
- **Animation timings** -- stagger, delay and transition constants.
- **Identifiers** -- route ids, dashboard tab ids, chart keys. These name things
  that must exist in the bundle, so the parsers validate every id the Console
  can supply against the build's own lists (`ROUTE_IDS`, `DASHBOARD_TAB_IDS`,
  `CHART_DETAIL_KEYS`) and a typo fails with a named field instead of a dead
  link.
- **Derivation** -- the formatters and row builders in
  `chartDetail/definitions.tsx`, which compute a table from the series rather
  than storing figures twice.
- **The screens that render when Firestore is unavailable** -- the login screen,
  the splash, "Access pending" (reads denied) and "Content unavailable" (reads
  failed). Their copy cannot come from the database they exist to report on.

Chart axis bounds _are_ data (`analytics/series.chartConfig`): they decide what
a chart claims about its numbers, so a category added in the Console can be
given the headroom it needs without a rebuild.

### Who is signed in

Identity comes from the two places that know, and is assembled in
`DataContext`:

- **Firebase Auth** owns the account -- uid, email and display name. The seed
  sets `displayName`, because Firebase leaves it null for email/password
  accounts. The SDK restores the profile it cached in browser storage, so
  `firebaseBackend` refreshes it once per account on subscribe; otherwise a name
  changed by an administrator never reaches a session that is already signed in.
- **`users/{uid}`** owns what Auth has no field for: initials, job title,
  department, focus, employee id, location. `firestore.rules` already scopes
  that document to its owner.

The role line and headline are composed from those, so no screen knows the
format. The document is optional: a newly provisioned account has none, and
those fields render blank rather than blocking the portal or borrowing another
person's details. `initials` is stored rather than derived because
"Aisha Al-Khayyat" yields "AA" by any simple rule and the avatar reads "AK".

Parsers live in `src/repositories/`, and every shape is the interface already
declared in `src/data/`, so screens keep the types they compiled against before.

Two things are stored that the mocks did not need. Documents in
`recommendations` and `decisions` carry an `order` field, because Firestore has
no inherent document order and those lists are authored rather than alphabetical
-- the app sorts on it client-side rather than with `orderBy`, so a Console edit
that dropped the field is reported as malformed instead of being silently
excluded from the query. And `chartDetail/definitions.tsx` became a factory over
the series document, because its numbers are data while its copy, formatters and
chart construction are code.

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

### The Rules screen

The one screen that was not transcribed from the prototype. Pricing rules are the
guardrails the engine must satisfy before a recommendation reaches the queue --
they are why a decision carries "Margin protection guardrail" as a reason code
and why the detail screen's gauge has a floor and a ceiling at all. One of the
seeded rules is the AED 3,400–4,100 band that gauge draws.

It is read-only, on purpose. Profile → Role and permissions already says this
role has no access to "Configure guardrails and floors", so the screen inspects
and explains rather than edits, and a change is _proposed_ rather than applied.

**Rules are a collection, one document per rule**, like `recommendations` and
`decisions`, because a rule is an individually addressable thing a customer
edits on its own. **Everything numeric on the page is derived from that
collection** rather than stored, so one Console edit moves the table, the stage
counts, the coverage list, the binding bars and all four scorecards together:

| Shown             | Counted as                                 |
| ----------------- | ------------------------------------------ |
| Active rules      | `status = active`                          |
| Hard guardrails   | `enforcement = hard` and `status = active` |
| Guardrail blocks  | `sum(blocked)`                             |
| Awaiting approval | change-log entries with `status = pending` |

"Guardrail blocks" is deliberately not "recommendations blocked": two rules can
block the same recommendation, so only the event count is arithmetically safe to
sum. The same caution applies to bindings.

`content/rules` holds the copy, the seven pipeline stages and the change log.
The stages are the governance point -- precedence decides which constraint wins,
so a regulatory floor is never traded away for a parity target -- and each rule
names the stage it belongs to, validated against `RULE_STAGES`.

Unlike the transcribed screens, whose filters are decorative, **this one's
filters work**: search spans name, note, scope, threshold, owner, stage and
enforcement; the status control filters; each chip clears the specific filter it
stands for; the count and empty state follow. That needed optional controlled
props on `SearchField`, `Segmented` and `FilterChips`, all backwards compatible
-- left out, each component behaves exactly as before.

### The Reports screen

Reports are the one thing the dashboards, the audit log and the AI analyst are
not: **scheduled, distributable, point-in-time artefacts**, with a format, a
cadence, a distribution list, a retention window and a run history. The weekly
cycle report is scheduled for Mondays 08:00 GST, which is exactly what Profile
already offers as a notification preference.

The permission split is what shapes the page. Profile says Reports is denied for
this role -- and the Reports page makes that concrete: **Admin owns schedules,
distribution lists and retention; the reviewer owns which reports reach them**.
(The permission's subtitle was sharpened from "Schedule and export" to "Schedule
and distribute" to say so.)

#### The only write the portal makes

Toggling delivery writes `reportSubscriptions` to `users/{uid}` -- a real
Firestore write, permitted by the per-user rule that has existed since the
Firebase work and had never been exercised:

    match /users/{uid} { allow read, write: if isOwner(uid); }

No optimistic state is needed. Firestore applies the write to its local cache
and fires the document listener straight away, so the switch moves immediately
and the server confirms behind it; a rejected write rolls the cache back and the
switch returns on its own. The write `merge`s, so the organisational fields
beside it are untouched.

That ownership split has a consequence for the seed: **`scripts/seed.ts` must
not clobber a choice the user made.** It now writes only the organisational
fields, with `merge`, and supplies the default subscription only when the field
has never been set. Without that, re-seeding silently wiped delivery
preferences -- which it did, once, before the seed was fixed.

Everything else on the page is derived from the catalogue, as on the Rules
screen: reports available, how many are scheduled, runs and failures this cycle,
the next five scheduled generations, the retention breakdown, and the delivered
list itself.

### The Admin screen

Profile has always said Admin is "User and role management", and the app has had
the machinery for it since the Firebase work without ever showing it: two custom
claims, `portalAccess` and `admin`, written by `scripts/grant-access.ts` and
read by `firestore.rules` in `hasPortalAccess()` and `isAdmin()`. Until now they
existed only in a rules file and a CLI script.

#### The claims are now visible, and they are the real ones

`AuthUser` carries an `AuthClaims`, read with `getIdTokenResult()` alongside the
profile refresh already happening on subscribe. No forced refresh: the cached
token is returned, which is the very token the security rules are evaluating —
so the "Your access" panel cannot disagree with them.

`claims` is `null` until that resolves rather than defaulting to `false`. "Not
known yet" and "has no access" are different things, and a screen whose subject
is access must not assert the second while it means the first; the panel renders
a distinct state for it.

The page's notice is chosen by the real `admin` claim, so it describes the
session rather than an assumed role.

#### The directory is reconciled against Firebase Auth

`people` is authored — eleven colleagues, the same names the Rules change log
and the Reports owners already reference. But `scripts/seed.ts` then walks the
real `listUsers()` and, for every address that matches, **overwrites the row
with the truth**: that account's actual claims, its actual last sign-in
(converted to Gulf time), and `signedUp: true`.

So "invited, but no account was ever created" is a fact the screen states rather
than a prop — and the signed-in user's own row agrees with the token in their
browser. It is also why one row reads `Sep 05` while the rest read early August:
that one is real.

Everything else is derived from the directory: people with access,
administrators, awaiting first sign-in, suspended, the per-role headcount and
the per-department breakdown. Selecting a role filters the directory to it,
which is what connects the two halves of the page.

With Admin in place every sidebar entry resolves to a screen, so `ROUTE_IDS` and
`SCREEN_IDS` are now the same list.

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

- **Reading requires a `portalAccess` claim, not just a session.** This
  repository is public and the web config ships in the bundle, so with
  email/password sign-up open, "signed in" is available to anyone. A
  self-registered account gets the "Access pending" screen until
  `npm run grant` provisions it.
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
