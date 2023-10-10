import { append, prepend } from '../../scripts/utils/dom.js';

/**
 * Talk Q&A
 * @param {Element} block
 */
export default async function decorate(block) {
  prepend(block, 'h4').textContent = 'Q&A';
}
