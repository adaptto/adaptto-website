import html from '../../scripts/utils/htmlTemplateTag.js';

/**
 * Embed Google Maps.
 * @param {Element} block
 */
export default function decorate(block) {
  const mapsUrl = block.querySelector('a')?.href;
  if (mapsUrl) {
    block.innerHTML = html`<iframe src="${mapsUrl}"
      allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">`;
  }
}
