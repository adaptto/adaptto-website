import { append } from '../../scripts/utils/dom.js';
import { getSiteRoot } from '../../scripts/utils/site.js';

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
