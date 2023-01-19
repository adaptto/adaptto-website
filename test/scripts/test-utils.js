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
