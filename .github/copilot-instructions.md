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
2. **`loadLazy`** – header/footer, remaining sections, hash scroll, lazy CSS, consent management.
3. **`loadDelayed`** – everything deferrable (loaded after 3s via `delayed.js`).

`decorateMain` runs `buildAutoBlocks`, which **synthesises blocks** based on page type:
- Speaker pages → `speaker-detail` block (see `isSpeakerDetailPath`).
- `theme === 'talk-detail'` pages → inserts `talk-detail-before-outline`,
  `talk-detail-after-outline`, `talk-detail-footer`, and relocates `talk-qa`.
- Always extracts a `stage-header` section and appends `teaser-bar` / `aside-bar` fragments unless
  disabled via metadata.

When adding page-type behaviour, prefer extending `buildAutoBlocks` + a dedicated block over
inlining logic in `scripts.js`.

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
```

Local preview uses the AEM CLI: `npm install -g @adobe/aem-cli` then `aem up` (serves at
`http://localhost:3000`). CI runs build + tests and reports coverage to SonarCloud.

## Where to look

- Architecture / page lifecycle → `scripts/scripts.js`, this file.
- **Talk & speaker data model and business logic** → `.github/instructions/data-services.instructions.md`.
- Authoring blocks and how they consume data → `.github/instructions/blocks.instructions.md`.
- Tests → `.github/instructions/testing.instructions.md`.
