import { append } from '../../scripts/dom-utils.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

/**
 * Talk Detail footer with back to schedule link.
 * @param {Element} block
 */
export default async function decorate(block) {
  const p = append(block, 'p');

  const siteRoot = getSiteRoot(document.location.pathname);
  const backLink = append(p, 'a');
  backLink.href = `${siteRoot}schedule`;
  backLink.textContent = 'Back to schedule';
}
