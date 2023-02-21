import html from '../../scripts/utils/htmlTemplateTag.js';
import { decorateWithConsent } from '../../scripts/utils/usercentrics.js';

// pattern from https://gist.github.com/deunlee/0b45cfacb7e8f788e5bbfa2911f54d3e
const youTubeUrlPattern = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i;

/**
 * Get YouTube Video ID from URL.
 * @param {string} href
 * @return {string} Video ID
 */
function getYouTubeVideoIdByUrl(url) {
  const match = url.match(youTubeUrlPattern);
  if (match) {
    return match[9];
  }
  return undefined;
}

/**
 * Embed YouTube video player.
 * @param {Element} block
 */
export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  const vid = getYouTubeVideoIdByUrl(link);
  if (vid) {
    decorateWithConsent('youtube', block, (parent) => {
      parent.innerHTML = html`
      <iframe src="https://www.youtube.com/embed/${vid}"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
        scrolling="no"
        loading="lazy"></iframe>
      `;
    });
  }
}
