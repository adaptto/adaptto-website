import html from '../../scripts/utils/htmlTemplateTag.js';
import { decorateWithConsent } from '../../scripts/utils/usercentrics.js';

/**
 * Embed Google Maps.
 * @param {Element} block
 */
export default function decorate(block) {
  const mapsUrl = block.querySelector('a')?.href;
  if (mapsUrl) {
    decorateWithConsent('googleMaps', block, (parent) => {
      parent.innerHTML = html`<iframe src="${mapsUrl}"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">`;
    });
  }
}
