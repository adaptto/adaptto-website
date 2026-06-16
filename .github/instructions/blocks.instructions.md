---
applyTo: "blocks/**"
---

# Blocks – authoring & consuming data

Blocks are the UI components of the site. Each block is a folder `blocks/<name>/` containing
`<name>.js` and `<name>.css`. EDS loads a block's JS/CSS lazily when the block appears on a page.

## Anatomy

```js
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { append } from '../../scripts/utils/dom.js';

/**
 * @param {Element} block The block's root element
 */
export default async function decorate(block) {
  // transform block's DOM subtree in place
}
```

- Export a **default `decorate(block)`** function. It may be `async`.
- It receives the block's root element (already in the DOM) and mutates that subtree.
- Authored content arrives as nested `div` rows/cells; read it, then usually replace it
  (`block.textContent = ''` / `block.innerHTML = ...`) with the final markup.
- Read block configuration (key/value rows) with `readBlockConfig(block)` from `aem.js`
  (e.g. `speaker-gallery` reads a `speakers` list this way).

## Data flow: always go through services

Blocks must get talk/speaker/schedule data from `scripts/services/`, never by fetching or parsing
JSON directly. Typical patterns:

- **Query index**: `const queryIndex = await getQueryIndex();` then use methods like
  `getItem`, `getSpeaker`, `getTalksForSpeaker`, `getTalkSpeakerNames`,
  `getLightningTalkSpeakerNames` (see the data-services instructions).
- **Schedule**: `const data = await getScheduleData(\`${siteRoot}schedule-data.json\`, forceReload);`
  then `data.getDays()` / `data.getTalkEntry(path)`.
- **Archive**: `const archive = await getTalkArchive();` then `applyFilter` + `getFilteredTalks*`.

Resolve paths/years with `utils/site.js` and `utils/path.js`
(`getSiteRootPath`, `getSiteRootPathAlsoForSpeakerPath`, `getYearFromPath`,
`getSpeakerDetailPath`, `getArchivePath`, …). **Never hardcode a year or path.**

### Speaker rendering rules (when building speaker UI)

- Resolve a speaker for the current edition with `queryIndex.getSpeaker(name, siteRoot)` so the
  correct yearly variant (`uptoyear`) is chosen.
- Link to a speaker detail page using `getSpeakerDetailPath(speakerItem, siteRoot)` — it appends
  the `#<year>` hash that binds the shared speaker page to the edition.
- Use `createOptimizedPicture` (from `aem.js`) for speaker images; fall back to
  `/resources/img/speaker_placeholder.svg` when `speakerItem.image` is absent.
- Use eager image loading only for the first few speakers (see `speaker-gallery`).

### Schedule / talk-detail rules

- Talk detail pages are driven by metadata (`theme: talk-detail`); the auto-blocks in
  `scripts.js` inject `talk-detail-before-outline`, `talk-detail-after-outline`,
  `talk-detail-footer`. Add talk-detail UI by editing those blocks.
- Get a talk's time/duration via `scheduleData.getTalkEntry(document.location.pathname)`.
- The `schedule` block owns parallel-track grouping (`buildGroupedEntries`) and day-tab
  navigation; active day comes from the `#day-<n>` hash or today's date.

## Markup & DOM conventions

- Build elements with `append`/`prepend` from `utils/dom.js` (the optional rest args are class
  names) rather than manual `createElement` chains.
- For larger fragments use the `html` tagged template (`utils/htmlTemplateTag.js`): interpolations
  are **HTML-escaped by default**; prefix the placeholder with `$` only for trusted pre-escaped
  content.
- React to in-page edition/day/filter changes via the `hashchange` event (several blocks reload or
  re-render on hash change).
- Keep imports extension-explicit (`../../scripts/...js`) — ESLint enforces it.
- Styling belongs in the block's own `.css`; class names are scoped under the block root.

## Adding a new block

1. Create `blocks/<name>/<name>.js` (default `decorate`) and `blocks/<name>/<name>.css`.
2. Put any data/domain logic in a service under `scripts/services/`, not in the block.
3. If the block should be auto-injected for a page type, wire it into `buildAutoBlocks`
   in `scripts/scripts.js`.
4. Add a test under `test/blocks/<name>/` using the test harness.
