---
applyTo: "test/**"
---

# Tests

Tests run with **@web/test-runner** in a real browser, using Chai (`@esm-bundle/chai`) and Sinon.

```sh
npm test            # all test/**/*.test.js with coverage
npm run test:watch
```

## Layout

- `test/scripts/services/` – unit tests for the data/business-logic services.
- `test/blocks/<name>/` – block tests (decorate a fixture DOM, assert resulting markup).
- `test/test-data/` – sample fixtures: `query-index-*.json`, `schedule-data-*.json` (+ source
  `.xlsx`), images.
- `test/scripts/test-utils.js` – shared helpers.

## Conventions & helpers

- Files are ES modules and use the global `describe`/`it` (declared via
  `/* global describe it */`). Import `expect` from `@esm-bundle/chai`.
- **Stub network with `stubFetchUrlMap(map)`** from `test-utils.js` — it redirects requested URLs
  (e.g. `/query-index.json`) to a local fixture under `test/test-data/`. Example:
  ```js
  stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-sample.json' });
  ```
- The query index is a cached singleton: call `clearQueryIndexCache()` when a test needs fresh
  data with a different stub.
- Control the current URL with `setWindowLocationHref(href)` (path-based logic depends on
  `window.location`).
- Wait for async EDS loading with `sectionLoaded` / `blockLoaded`; use `sleep(ms)` sparingly.

## When changing behaviour

- Add/adjust a fixture in `test/test-data/` and a test mirroring the source file's location
  (a service in `scripts/services/Foo.js` → `test/scripts/services/Foo.test.js`).
- Prefer asserting domain outcomes (resolved speaker variant, dropped invalid schedule rows,
  filter/full-text results) over incidental markup details.
- Run `npm test` and `npm run lint` before finishing.
