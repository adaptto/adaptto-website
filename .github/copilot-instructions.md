# adaptTo() Website – Copilot Instructions

adaptTo() conference website built on **Adobe Edge Delivery Services (EDS / AEM Franklin)**.
Content is authored in Microsoft SharePoint/Google Docs and served as semantic HTML, then
progressively enhanced client-side by vanilla ES modules. There is **no build step** and **no
framework** – plain JavaScript (ES modules), CSS, and the AEM `aem.js` library.

## Big picture

- **Authors** edit documents (one document = one page) and spreadsheets (`.xlsx`). EDS publishes
  them as HTML pages plus JSON endpoints (`query-index.json`, yearly `schedule-data.json`).
- **The browser** loads a page, and `scripts/scripts.js` decorates the DOM: it builds sections,
  auto-blocks, and loads block JS/CSS on demand.
- **Blocks** (`blocks/<name>/<name>.js` + `.css`) are the UI components. Each exports a default
  `decorate(block)` function that transforms its DOM subtree and may fetch data.
- **Services** (`scripts/services/`) encapsulate all **business logic / data access** – reading the
  query index and schedule sheets, resolving speakers/talks, filtering the archive. Blocks should
  delegate data work to services, not reimplement it.
- **Utils** (`scripts/utils/`) are small stateless helpers (DOM, dates, paths, metadata parsing).

```
content (Docs + Sheets)
   │  published by EDS
   ▼
query-index.json / schedule-data.json / HTML pages
   │  fetched by
   ▼
scripts/services/*  ──►  blocks/*/*.js  ──►  decorated DOM
   ▲                         ▲
   └── scripts/utils/* ──────┘
```

## Yearly editions & content model

- The site hosts one edition per year. **URL convention is the source of truth**:
  - `/<year>/` – site root of an edition (e.g. `/2024/`), matched by `/^\/\d\d\d\d\/$/`.
  - `/<year>/schedule/<talk>` – a main talk detail page.
  - `/<year>/schedule/<talk>/<lightning>` – a lightning talk (one level deeper).
  - `/speakers/<name>` – speaker pages, which live **outside** the yearly tree and are shared
    across editions. Use a `#<year>` hash to bind a speaker page to an edition.
- Speaker metadata can change over the years; `uptoyear` and `speaker-alias` fields let a speaker
  have multiple variants. Resolution logic lives in `QueryIndex` (see services instructions).
- Page behaviour is driven by **metadata** (`getMetadata(name)` from `aem.js`): `template`,
  `theme`, `include-aside-bar`, `include-teaser-bar`, `affiliation`, `video`, `article:tag`, etc.
- Pre-2024 editions use a legacy design: `loadEager` adds the `design-2023` body class and loads
  `styles/styles-design-2023.css` when `getYearFromPath(...) < 2024`.

## Page lifecycle (`scripts/scripts.js`)

Three phases, mirroring the EDS pattern:
1. **`loadEager`** – language, legacy-design detection, fullscreen handling, static header,
   template/theme auto-detection, `decorateMain`, render first section (LCP).
2. **`loadLazy`** – header/footer, remaining sections, hash scroll, lazy CSS.
3. **`loadDelayed`** – imports `consent-check.js`, which loads the Usercentrics consent
   management (immediately if the user already interacted with it, otherwise after 3s) and
   `consented.js` once all consents are accepted. Put analytics/martech in `consented.js`.

`decorateMain` runs `buildAutoBlocks`, which **synthesises blocks** based on page type:
- Speaker pages → `speaker-detail` block (see `isSpeakerDetailPath`).
- `theme === 'talk-detail'` pages → inserts `talk-detail-before-outline`,
  `talk-detail-after-outline`, `talk-detail-footer`, and relocates `talk-qa`.
- Always extracts a `stage-header` section and appends `teaser-bar` / `aside-bar` fragments unless
  disabled via metadata.

When adding page-type behaviour, prefer extending `buildAutoBlocks` + a dedicated block over
inlining logic in `scripts.js`.

## AEM boilerplate & `aem.js`

- The project is derived from [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate).
  The last sync state and all **conscious deviations** are recorded in `AEM-BOILERPLATE-SYNC.md`
  – read it before syncing again, and update it when deviating from the boilerplate.
- `scripts/aem.js` is **vendored** from [aem-lib](https://github.com/adobe/aem-lib). Never edit
  it; put helpers in `scripts/scripts.js` or `scripts/utils/` instead.
- Button decoration is project code: `decorateButtons` in `scripts/utils/buttons.js` (classic
  auto-buttonization, `.button-container`), not in `aem.js`.
- Section metadata (`section-metadata` tables) is resolved server-side by EDS, not by `aem.js`.

## Content Security Policy & consent

- `head.html` defines a nonce-based CSP (`'nonce-aem' 'strict-dynamic'`). Scripts in
  `head.html`/`404.html` need `nonce="aem"`; no other inline scripts. Scripts added dynamically by
  our code (e.g. 3rd-party embeds via `document.createElement('script')`) are allowed through
  `'strict-dynamic'`.
- `scripts.js` registers a Trusted Types default policy for `innerHTML` & co. Keep HTML built via
  the `html` template tag (escaping); don't rely on inline event handlers or `srcdoc`.
- Embeds of 3rd-party services (YouTube, Google Maps, HubSpot, pretix) must be wrapped with
  `decorateWithConsent(service, parent, decorator)` from `scripts/utils/usercentrics.js`.

## EDS gotchas

- Markup comes from the backend. Check the actual HTML first, e.g.
  `curl http://localhost:3000/<path>.plain.html` while `aem up` is running.
- `buildAutoBlocks` rewrites content before your block runs.
- Authors omit and add table cells/rows. Decorate defensively.
- Scope CSS to `.<blockname>`; `-wrapper`/`-container` suffixed classes are section classes.
- `blocks/fragment/fragment.js` is the sanctioned cross-block import (`schedule-screen` also reuses
  `schedule`); otherwise share code via `scripts/`.
- All committed files are served by EDS – exclude non-web files via `.hlxignore`.
- `fstab.yaml`, `helix-query.yaml`, `paths.json` are retired; site config lives at
  [tools.aem.live](https://tools.aem.live/).
- Merging to `main` ships code; content is published separately by authors.
- Documentation: search `site:www.aem.live <terms>`.

## Conventions

- **ES modules only.** Imports must include the `.js` extension (enforced by ESLint
  `import/extensions`). Unix linebreaks. Style is `airbnb-base`.
- **Build DOM with `scripts/utils/dom.js`** (`append`, `prepend`) instead of verbose
  `createElement` + `append` chains. Use the `html` tagged template (`utils/htmlTemplateTag.js`)
  for larger markup – it auto-escapes interpolations (prefix with `$` to opt out).
- **All fetches go through `utils/fetch.js`** cache helpers so a browser reload force-refreshes data.
- **Never hardcode `/2024/` style paths.** Derive them with `utils/site.js` / `utils/path.js`
  helpers (`getSiteRootPath`, `getYearFromPath`, `getSchedulePath`, …).
- Use JSDoc with `@typedef`/`@param`/`@returns`; the codebase is typed via JSDoc, not TypeScript.
- Keep data/business logic in `scripts/services/`; keep blocks focused on presentation.

## Developer workflow

```sh
npm install
npm test          # web-test-runner, files: test/**/*.test.js (with coverage)
npm run test:watch
npm run lint      # lint:js (eslint) + lint:css (stylelint)
npm run lint:fix  # auto-fix lint issues
```

Local preview uses the AEM CLI: `npm install -g @adobe/aem-cli` then `aem up` (or
`npx -y @adobe/aem-cli up`; serves local code with previewed content at
`http://localhost:3000`). CI runs build + tests and reports coverage to SonarCloud.
PRs must include before/after test URLs (`https://<branch>--adaptto-website--adaptto.aem.page/<path>`).

## Where to look

- Architecture / page lifecycle → `scripts/scripts.js`, this file.
- Sync state & deviations from aem-boilerplate → `AEM-BOILERPLATE-SYNC.md`.
- **Talk & speaker data model and business logic** → `.github/instructions/data-services.instructions.md`.
- Authoring blocks and how they consume data → `.github/instructions/blocks.instructions.md`.
- Tests → `.github/instructions/testing.instructions.md`.
