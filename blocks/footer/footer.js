import { append } from '../../scripts/dom-utils.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

/**
 * @param {Element} footerNav
 */
function decorateFooterNav(footerNav) {
  footerNav.classList.add('section-footernav', 'row');
}

/**
 * @param {Element} footerText
 */
function decorateFooterText(footerText) {
  footerText.classList.add('section-footertext', 'row');
}

/**
 * Loads and decorates footer and footer navigation.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const siteRoot = getSiteRoot(document.location.pathname);
  const navPath = cfg.footer || `${siteRoot}footer`;
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const container = append(block, 'div');
    container.innerHTML = html;

    // first section: footer navigation
    const footerNav = container.children[0];
    if (footerNav) {
      decorateFooterNav(footerNav);
    }

    // second section: footer text
    const footerText = container.children[1];
    if (footerText) {
      decorateFooterText(footerText);
    }
  }
}
