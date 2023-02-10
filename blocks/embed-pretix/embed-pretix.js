import { readBlockConfig } from '../../scripts/lib-franklin.js';
import html from '../../scripts/utils/htmlTemplateTag.js';

/**
 * Embed Pretix Ticket Shop.
 * @param {Element} block
 */
export default function decorate(block) {
  const config = readBlockConfig(block);
  block.innerHTML = html`${JSON.stringify(config)}`;
}
