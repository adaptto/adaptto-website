---
applyTo: "scripts/services/**/*.js"
---

# Talk & speaker data – business logic

All data access and domain logic lives in `scripts/services/`. Blocks consume these services and
should **not** parse the raw JSON themselves. There are two data sources, both published by EDS:

- **`/query-index.json`** – flat list of every published page with its metadata (one row per page).
- **`/<year>/schedule-data.json`** – per-edition spreadsheet export describing the timetable.

## Query index (`QueryIndex.js`, `QueryIndexItem.js`)

`getQueryIndex()` fetches `/query-index.json` once and **caches the promise** (singleton). Tests
reset it with `clearQueryIndexCache()`. Each raw row is mapped onto a `QueryIndexItem`
(`Object.assign(new QueryIndexItem(), row)`), and the placeholder `default-meta-image.png` is
nulled out.

`QueryIndexItem` is the canonical page/metadata record. Fields are strings as stored; helper
methods parse them:
- `getKeywords()` / `getRobots()` → `parseCSVArray` (comma-separated).
- `getTags()` → `parseJsonArray` (JSON array, falls back to CSV).
- `getSpeakers()` → `parseCSVArray` of the `speakers` field.

Speaker-specific fields: `affiliation`, `twitter`, `speaker-alias`, `uptoyear`.
Talk-specific field: `speakers` (speaker **names** or speaker **document-names**).

### Page-type detection is path-based

`QueryIndex` classifies items purely by their `path` using regexes:
- site root: `/^\/\d\d\d\d\/$/`
- speaker page: `/^\/speakers\/.*$/`
- talk page: `/^\/\d\d\d\d\/schedule\/.+$/`

Key methods:
- `getItem(path)` – exact path lookup.
- `getAllSiteRoots()` – yearly editions, newest first.
- `getAllTalks()` – all talk pages, sorted year-desc then title-asc.
- `getTalkSpeakerNames(siteRoot)` – distinct sorted speakers of **main** talks (`schedule/<x>`).
- `getLightningTalkSpeakerNames(siteRoot)` – speakers of **lightning** talks
  (`schedule/<x>/<y>`), **minus** anyone already in the main-talk list.
- `getTalksForSpeaker(speakerItem)` – talks whose `speakers` include the speaker's title or
  document-name.

### Speaker variant resolution (important domain rule)

A speaker can appear at the same name across years with different affiliation/details.
`getSpeaker(pathOrName, siteRootPath)`:
1. If given a URL/path under `/speakers/`, returns that exact item.
2. Otherwise matches speaker items whose `title` **or** document-name equals the input.
3. Disambiguates multiple matches via `getMatchingSpeakerVariant`: sorts by `uptoyear` (items
   **without** `uptoyear` sort last = "current"), and picks the first variant whose `uptoyear`
   is absent or `>= requested year`.

When you need the right speaker for a given edition, always pass the `siteRootPath` so this logic
applies — don't pick the first match yourself.

## Schedule data (`ScheduleData.js`, `ScheduleDay.js`, `ScheduleEntry.js`)

`getScheduleData(url, forceReload)` fetches a yearly `schedule-data.json` and **joins it with the
query index** to produce `ScheduleDay[]` → `ScheduleEntry[]`.

Spreadsheet columns → `ScheduleEntry`: `Day`, `Track`, `Start`, `End`, `Entry` (title),
`Duration`, `FAQ` (Q&A minutes), `Type`, `Speakers`.
- Valid `Type`s: `day`, `talk`, `break`, `other`, `other_rating`. `day` rows are dropped from
  entries (only used implicitly).
- `Start`/`End` are Excel/Sheets serial numbers → real `Date`s via
  `convertSheetDateValue` (UTC). Times are formatted UTC (`utils/datetime.js`).
- A row is **invalid and skipped** if day/start/end/title/duration are missing/zero or the type is
  not recognised.

### Talk rows resolve against the query index

For `Type === 'talk'`, the `Entry` value is a reference to the talk detail page:
- absolute URL/path → used directly; otherwise treated as a document-name under
  `/<year>/schedule/<ref>`.
- If no matching query-index item exists, **the entry is dropped**.
- The entry's `title` is taken from the index item (with `removeTitleSuffix`), and if the sheet
  has no `Speakers`, speakers are inherited from the index item.

`ScheduleData.getTalkEntry(path)` finds the entry for a talk detail page (used by talk-detail
blocks to show time/duration).

`ScheduleDay` aggregates its entries' min `start` / max `end`. Parallel tracks are represented by
the `track` number (track 1..n share a start time); grouping into parallel rows is done in the
`schedule` block, not here.

## Talk archive (`TalkArchive*.js`)

`getTalkArchive()` builds a `TalkArchive` from the query index. It projects talks into lightweight
`TalkArchiveItem`s (arrays already parsed) and **drops talks with no speakers**.

- `TalkArchiveFilter` – `tags` / `years` / `speakers` (AND across categories, OR within a
  category). Serialised to/from the URL hash via `buildHash()` / `getFilterFromHash(hash)` using
  `category=val1,val2/...`. Only `tags`, `years`, `speakers` are valid categories.
- `TalkArchive.applyFilter(filter)` recomputes `filteredTalks` and invalidates the full-text index.
- `getFilteredTalksFullTextSearch(text)` lazily builds a `TalkArchiveFullTextIndex` over the
  currently filtered talks. The index is deliberately simplistic: it concatenates
  title/description/keywords/tags/speakers, lowercases, and does substring matching.
- Filter option lists: `getTagFilterOptions()` / `getSpeakerFilterOptions()` (asc),
  `getYearFilterOptions()` (desc) — all distinct & sorted.

## Link handling (`Link.js`, `LinkHandler.js`)

`rewriteUrl` / `decorateAnchor` strip the host from internal adaptTo() URLs (so preview links stay
on preview and live stays on live), open external links in a new tab, and mark `.pdf`/`.zip` links
as downloads. `decorateAnchors(container)` is applied during `decorateMain`.

## When extending the data layer

- Add new domain logic here as a service/method with JSDoc, not inline in a block.
- Reuse `utils/path.js` (`isUrlOrPath`, `getPathName`, `getDocumentName`, `getYearFromPath`) and
  `utils/metadata.js` (`parseCSVArray`, `parseJsonArray`, `removeTitleSuffix`) rather than new regexes.
- Fetch via `utils/fetch.js` cache helpers.
- Add a matching test under `test/scripts/services/` with sample JSON in `test/test-data/`.
