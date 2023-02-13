import html from '../../scripts/utils/htmlTemplateTag.js';
import { isConsentManagementEnabled } from '../../scripts/utils/usercentrics.js';

/**
 * Embed Google Maps.
 * @param {Element} block
 */
export default function decorate(block) {
  const mapsUrl = block.querySelector('a')?.href;
  const srcAttr = isConsentManagementEnabled() ? 'uc-src' : 'src';
  if (mapsUrl) {
    block.innerHTML = html`<iframe ${srcAttr}="${mapsUrl}"
      allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">`;
  }
}
