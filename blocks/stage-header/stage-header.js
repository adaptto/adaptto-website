import { detachElement } from '../../scripts/site-utils.js';

/**
 * @param {Element} block
 */
export default function decorate(block) {
  // get individual elements and rebuild markup
  const img = detachElement(block.querySelector('picture'));
  const h2 = detachElement(block.querySelector('h2'));
  const links = Array.from(block.querySelectorAll('p > a')).map((link) => detachElement(link));
  const content = Array.from(block.children);
  block.textContent = '';

  const stage = document.createElement('div');
  stage.classList.add('stage-large');

  // image
  if (img) {
    stage.append(img);
  }

  const overlay = document.createElement('div');
  overlay.classList.add('stage-overlay');
  stage.append(overlay);
  const boxPadding = document.createElement('div');
  boxPadding.classList.add('box-padding');
  overlay.append(boxPadding);

  // title and text
  const title = document.createElement('div');
  title.classList.add('stage-title');
  boxPadding.append(title);
  if (h2) {
    h2.classList.add('title', 'title-section');
    title.append(h2);
  }
  content.forEach((p) => title.append(p));

  // cta links
  const ctaBox = document.createElement('div');
  ctaBox.classList.add('stage-cta-box');
  boxPadding.append(ctaBox);
  links.forEach((link) => {
    const ctaP = document.createElement('p');
    ctaBox.append(ctaP);
    link.classList.add('stage-cta');
    ctaP.append(link);
  });

  block.append(stage);
}
