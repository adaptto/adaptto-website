# AEM Boilerplate Sync

This project is derived from [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate).
This document records the state of the last sync, and all **conscious deviations** from the
boilerplate, so they can be re-evaluated in future sync runs.

## Last sync

| | |
|---|---|
| Date | 2026-11-19 |
| Upstream commit | [`599a356`](https://github.com/adobe/aem-boilerplate/commit/599a356) (2026-11-17) |
| `scripts/aem.js` | [aem.js@3.1.9](https://github.com/adobe/aem-lib/releases/tag/v3.1.9) (byte-identical copy) |

## How to sync

1. Clone upstream and diff from the commit above to `main`:
   `git diff 599a356 main -- . ':!package-lock.json'`.
2. Copy `scripts/aem.js` unchanged. Never edit it locally – check the
   [aem-lib release notes](https://github.com/adobe/aem-lib/releases) and
   [MIGRATION.md](https://github.com/adobe/aem-lib/blob/main/MIGRATION.md) for breaking changes,
   and fix them in project code instead.
3. Port relevant changes of the other files, taking the deviations below into account.
4. Update dev dependencies in `package.json` to the upstream versions (if not newer already).
5. Run `npm run lint` and `npm test`, and test with `aem up` – especially consent management
   (Usercentrics) and the embeds (YouTube, Google Maps, HubSpot newsletter, pretix).
6. Update this document (last sync table and deviations).

## Deviations

### Button decoration (`scripts/utils/buttons.js`)

aem.js 3.0.0 removed `decorateButtons`. Upstream replaced it with an opt-in variant in
`scripts.js` (only bold/italic links become buttons, classes `button-wrapper`,
`primary`/`secondary`/`accent`).

**We keep the classic implementation** (any link alone in a paragraph becomes a button, class
`button-container`) as `scripts/utils/buttons.js`
([migration option 2](https://github.com/adobe/aem-lib/blob/main/MIGRATION.md)). Reasons:
existing content of all yearly editions relies on auto-buttonization, and CSS, the header block
(nav buttons) and `404.html` rely on the `button-container` class. It lives in `utils/` (not in
`scripts.js` as upstream) so blocks like `header` can import it without importing `scripts.js`.

### Consent management (`scripts/consent-check.js`, `scripts/consented.js`)

Upstream replaced `delayed.js` by `consent-check.js` (dummy consent, default declined,
`?consent=accept` override) + `consented.js`. We adopted the structure, but
`consent-check.js` is backed by **Usercentrics** (`scripts/utils/usercentrics.js`):

- The Usercentrics CMP script is loaded immediately if the user already interacted with it
  (`localStorage.uc_user_interaction`), otherwise delayed by 3 seconds (as before with
  `delayed.js`; upstream loads `consent-check.js` without delay).
- `consented.js` (currently empty) is loaded once the user accepted **all** services
  (`UC_UI.areAllConsentsAccepted()`). If analytics/martech is added, consider a dedicated
  Usercentrics service instead.
- `consent.update` events are dispatched on Usercentrics initialization and CMP events.
- No `?consent=` query parameter override – a real CMP decides.
- Per-service consent for embeds stays in the blocks via `decorateWithConsent`.
- `sampleRUM('cwv')` from the old `delayed.js` was dropped – the RUM enhancer loaded by aem.js
  collects Core Web Vitals automatically.

### Content Security Policy (`head.html`, `404.html`)

Adopted upstream's nonce-based CSP (`'nonce-aem' 'strict-dynamic'`) and the Trusted Types
default policy in `scripts.js`, with two deviations found while testing with `aem up`:

- **`'unsafe-eval'` added to `script-src`** (`head.html` and `404.html`): the Usercentrics
  Browser UI loads its modules via `new Function("u", "return import(u)")`. Without
  `'unsafe-eval'` its fallback resolves module chunks relative to the page URL, the CMP never
  initializes and all consent-gated embeds stay blocked.
- **`require-trusted-types-for 'script'` removed** (`head.html`): the HubSpot forms script
  (`embed-newsletter` block) renders into an `about:blank` iframe, which inherits the CSP but not
  our default Trusted Types policy, so the form fails to render. The Trusted Types policy in
  `scripts.js` is kept as in upstream (it is only enforced if the directive is present), only
  using an optional chain for the feature check (SonarCloud rule S6582).

`'unsafe-inline'` is kept as in upstream: it is only a fallback for browsers without nonce
support and ignored by current browsers, as the policy contains a nonce and `'strict-dynamic'`.
SonarCloud reports rule `Web:S7039` ("CSP should be restrictive") for `'unsafe-inline'` and
`'unsafe-eval'` in `head.html` and `404.html`. These issues are accepted manually in the
SonarCloud UI (not suppressed in `sonar-project.properties`, to still get warnings for future CSP
changes) – re-evaluate them when changing the CSP.

The pretix ticket shop widget (`embed-pretix` block) works with this CSP – tested with an
inactive shop, which renders the pretix "booking period is over" message. The block had to be
fixed during the sync (also broken before): the `<pretix-widget>` element must be in the DOM
before the pretix script executes, as the script builds all widgets on execution. Still to be
verified: buying tickets in an active shop, and the CSP headers on production behind the
Cloudflare worker (`tools/cloudflare/helix-worker.js`).

### Fragment block (`blocks/fragment/fragment.js`)

Only the security fix (reject protocol-relative `//` paths) was adopted. **Not adopted**:

- The new `decorate` logic replacing the whole section with the fragment content if the fragment
  is the only child: this would drop the `aside-bar-section` / `teaser-bar-section` classes
  set by `scripts.js`, which the grid layout depends on. We keep merging the fragment's section
  classes into the parent section.
- Local additions are kept: fetches use `getFetchCacheOptions()`, media base path is reset to
  the fragment path, and `decorateMain(main, true)` skips auto-blocking inside fragments.

### `scripts/scripts.js` (general)

The project-specific `scripts.js` differs heavily from upstream (edition-aware auto-blocks,
templates, legacy 2023 design, fullscreen mode, static header). Not adopted from upstream:

- **Hero auto-block** – removed upstream as well; never used here.
- **Fragment auto-blocking** (`a[href*="/fragments/"]` links) – would conflict with the
  fragments built by `buildAutoBlocks` (aside bar, teaser bar) and links to fragments in content.
- **Widgets** (`blocks/widget`, `/widgets/` link auto-blocking) – not needed.
- **`loadHeader` before `loadSections`** and `body > header` / `body > footer` selectors – the
  header is loaded into the static `.header-container` built in `loadEager`.
- **Fonts loading** (`loadFonts`, `styles/fonts.css`, `fonts/`) – the site uses its own fonts.

### Blocks and styles

Upstream blocks `cards`, `columns`, `hero`, `widget` are not used. `header`, `footer` and all
styles (`styles/*.css`) are fully project-specific; upstream changes to them (header
a11y/button navigation, button styles, section styles) are not ported.

### Repository/tooling files

- `.editorconfig`: CSS indent size 2 (upstream: 4) to match the existing code base and stylelint.
- `.github/workflows/build.yaml`: own build workflow (lint + test + SonarCloud) instead of
  upstream's `main.yaml`. Not adopted: `cleanup-on-create.yaml`, `sync-block-collection.yaml`,
  `sync-block-collection.sh`, `.renovaterc.json`.
- `AGENTS.md` / `CLAUDE.md`: not adopted – relevant guidance was merged into
  `.github/copilot-instructions.md`.
- `package.json`: additional dev dependencies and scripts for testing (web-test-runner, chai,
  sinon).
- `404.html`: own layout (no teaser/aside bar, favicon, back button via `.button-container`).
