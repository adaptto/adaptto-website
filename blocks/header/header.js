import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

/**
 * @param {Element} header
 * @param {string} siteRoot
 */
function decorateHeader(header, siteRoot) {
  header.classList.add('nav-header');
  header.classList.add('row');

  // add logo with site root link
  const logoLink = document.createElement('a');
  logoLink.id = 'top';
  logoLink.href = siteRoot;
  logoLink.classList = 'logo';
  logoLink.append(document.createElement('div'));
  header.prepend(logoLink);

  // header css classes
  const h1 = header.querySelector('h1');
  if (h1) {
    h1.classList.add('title');
    h1.classList.add('title-site');
  }
  const h2 = header.querySelector('h2');
  if (h2) {
    h2.classList.add('title');
    h2.classList.add('title-site');
    h2.classList.add('caption');
  }
}

/**
 * @param {Element} mainNav
 */
function decorateMainNav(mainNav) {
  mainNav.classList.add('nav-main');

  // mobile navigation
  const h1 = document.createElement('h1');
  h1.classList.add('title');
  h1.classList.add('title-nav');
  h1.classList.add('title-mainnav');
  const anchor = document.createElement('a');
  anchor.href = '#';
  anchor.classList.add('menu-opener');
  anchor.text = 'Navigation';
  h1.append(anchor);
  mainNav.prepend(h1);

  // mainnav CSS classes
  mainNav.querySelectorAll(':scope > ul').forEach((ul) => {
    ul.classList.add('row');
    ul.classList.add('navlist');
    ul.classList.add('navlist-main');
  });
  mainNav.querySelectorAll('a').forEach((a) => {
    a.classList.add('navlink');
    a.classList.add('navlink-main');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const siteRoot = getSiteRoot(document.location.pathname);
  const navPath = cfg.nav || `${siteRoot}nav`;
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const nav = document.createElement('nav');
    nav.innerHTML = html;

    // first section: header with title, slogan and logo
    const header = nav.children[0];
    if (header) {
      decorateHeader(header, siteRoot);
    }

    // second section: main navigation
    const mainNav = nav.children[1];
    if (mainNav) {
      decorateMainNav(mainNav);
    }

    block.append(nav);
  }
}
