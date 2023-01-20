import sinon from 'sinon';

/**
 * Waits until section is in status 'loaded';
 * @param {Element} section
 */
export async function sectionLoaded(section) {
  return new Promise((resolve) => {
    // wait for section to finish loading
    const check = setInterval(() => {
      if (section.dataset.sectionStatus === 'loaded') {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

/**
 * Waits until block is in status 'loaded';
 * @param {Element} section
 */
export async function blockLoaded(section) {
  return new Promise((resolve) => {
    // wait for section to finish loading
    const check = setInterval(() => {
      if (section.dataset.blockStatus === 'loaded') {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

/**
 * Pause execution for given amount of time.
 * @param {number} time Time (ms)
 */
export async function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

/**
 * Stubs window.fetch method to redirect URLs matching keys
 * in the given map to other URLs given as map values.
 * @param {object} urlMap Maps requested URLs to other URLs.
 * @returns Sinon Stub
 */
export function stubFetchUrlMap(urlMap) {
  const originalFetch = window.fetch;
  const stub = sinon.stub(window, 'fetch');
  stub.callsFake((url) => {
    let urlToUse = url;
    const replaceUrl = urlMap[url];
    if (replaceUrl) {
      urlToUse = replaceUrl;
    }
    return originalFetch(urlToUse);
  });
  return stub;
}

/**
 * Sets window.location.href by replacing state in history.
 * @param {string} href
 */
export function setWindowLocationHref(href) {
  window.history.replaceState(null, null, href);
}
