import { append } from '../../scripts/utils/dom.js';

/**
 * @param {Element} block
 */
export default function decorate(block) {
  // get individual elements and rebuild markup
  const img = block.querySelector('picture');
  const h2 = block.querySelector('h2');
  const links = Array.from(block.querySelectorAll('p > a'));
  const content = Array.from(block.children);
  block.textContent = '';

  // rebuild markup
  const fragment = document.createDocumentFragment();
  const stage = append(fragment, 'div', 'stage-large');

  // image
  if (img) {
    stage.append(img);
  }

  const overlay = append(stage, 'div', 'stage-overlay');

  // title and text
  const title = append(overlay, 'div', 'stage-title');
  if (h2) {
    title.append(h2);
  }
  content.forEach((p) => title.append(p));

  // cta links
  const ctaBox = append(overlay, 'div', 'stage-cta-box');
  links.forEach((link) => {
    const ctaP = append(ctaBox, 'p');
    link.classList.add('stage-cta');
    ctaP.append(link);
  });

  block.append(fragment);
}
