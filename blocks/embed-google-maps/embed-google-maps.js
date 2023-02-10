import { append } from '../../scripts/utils/dom.js';

/**
 * Embed Google Maps.
 * @param {Element} block
 */
export default function decorate(block) {
  const mapsUrl = block.querySelector('a')?.href;
  if (mapsUrl) {
    block.innerHTML = '';

    const iframe = append(block, 'iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.src = mapsUrl;
  }
}
