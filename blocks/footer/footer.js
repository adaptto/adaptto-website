import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

/**
 * @param {Element} footerNav
 */
function decorateFooterNav(footerNav) {
  footerNav.classList.add('row');

  // get first level of ul/li elements and rebuild them as section with h2 headline
  // and the nested ul as actual navigation list
  const columns = footerNav.querySelector(':scope > ul');
  if (columns) {
    footerNav.removeChild(columns);
    Array.from(columns.children).forEach((column) => {
      const section = document.createElement('section');
      section.classList.add('col-1-4');

      const boxPadding = document.createElement('div');
      boxPadding.classList.add('box-padding');
      section.append(boxPadding);

      const h2 = document.createElement('h2');
      h2.classList.add('title', 'title-section', 'title-footer');
      h2.textContent = Array.from(column.childNodes)
        .find((node) => node.nodeType === Node.TEXT_NODE)?.textContent;
      boxPadding.append(h2);

      const navList = column.querySelector('ul');
      if (navList) {
        navList.classList.add('navlist', 'navlist-footer');
        navList.querySelectorAll('a').forEach((a) => a.classList.add('navlink', 'navlink-footer'));
        boxPadding.append(navList);
      }

      footerNav.append(section);
    });
  }
}

/**
 * @param {Element} footerText
 */
function decorateFooterText(footerText) {
  footerText.classList.add('row');
  footerText.querySelectorAll('p').forEach((p) => p.classList.add('footer-text', 'box-padding'));
  footerText.querySelectorAll('a').forEach((a) => a.classList.add('navlink'));
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
  const navPath = cfg.nav || `${siteRoot}footer`;
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const container = document.createElement('div');
    container.classList.add('footer-site');
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

    block.append(container);
  }
}
