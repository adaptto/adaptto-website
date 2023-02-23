import html from '../../scripts/utils/htmlTemplateTag.js';
import { append } from '../../scripts/utils/dom.js';
import { decorateWithConsent } from '../../scripts/utils/usercentrics.js';

// pattern from https://gist.github.com/deunlee/0b45cfacb7e8f788e5bbfa2911f54d3e
const youTubeUrlPattern = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i;

/**
 * @param {string} vid
 */
function youtubePlayerHtml(vid) {
  return html`<iframe src="https://www.youtube.com/embed/${vid}?rel=0&muted=1&autoplay=1"
     allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
     scrolling="no"
     loading="lazy"></iframe>`;
}

/**
 * @param {string} vid
 */
function fallbackImageHtml(vid) {
  return html`<picture>
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi_webp/${vid}/maxresdefault.webp" type="image/webp">
      <source media="(min-width: 799px)" srcset="https://i.ytimg.com/vi/${vid}/maxresdefault.jpg" type="image/jpeg">
      <source srcset="https://i.ytimg.com/vi_webp/${vid}/hqdefault.webp" type="image/webp">
      <source srcset="https://i.ytimg.com/vi/${vid}/hqdefault.jpg" type="image/jpeg">
      <img src="https://i.ytimg.com/vi/${vid}/maxresdefault.jpg" alt="YouTube Video">
    </picture>`;
}

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
 * Display a placeholder with static image first.
 * @param {Element} block
 */
export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  const vid = getYouTubeVideoIdByUrl(link);
  if (vid) {
    block.innerHTML = '';
    const placeholder = append(block, 'div', 'placeholder');
    placeholder.innerHTML = `<button title="Play"></button>${fallbackImageHtml(vid)}`;
    placeholder.addEventListener('click', () => {
      decorateWithConsent('youtube', block, (parent) => {
        parent.innerHTML = youtubePlayerHtml(vid);
      });
    });
  }
}
