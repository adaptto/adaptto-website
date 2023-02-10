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
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.src = mapsUrl;
  }
}
