import { append } from '../../scripts/utils/dom.js';
import { getSchedulePage } from '../../scripts/utils/site.js';

/**
 * Talk Detail footer with back to schedule link.
 * @param {Element} block
 */
export default async function decorate(block) {
  const p = append(block, 'p');

  const backLink = append(p, 'a');
  backLink.href = getSchedulePage(document.location.pathname);
  backLink.textContent = 'Back to schedule';
}
