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
```

`src/styles/global.css` is in `.prettierignore`: it is the original stylesheet,
authored in a deliberately compact multi-declaration-per-line style, and
reformatting it would triple its length and bury real changes in noise.

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
