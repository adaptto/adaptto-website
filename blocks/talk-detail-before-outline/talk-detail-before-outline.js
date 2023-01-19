import { append } from '../../scripts/utils/dom.js';

/**
 * Talk Detail footer with back to schedule link.
 * @param {Element} block
 */
export default async function decorate(block) {
  append(block, 'h4').textContent = 'Outline';
}
