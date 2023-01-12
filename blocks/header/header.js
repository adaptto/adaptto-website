import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

/**
 * @param {Element} header
 * @param {string} siteRoot
 */
function decorateHeader(header, siteRoot) {
  header.classList.add('nav-header', 'row');

  // add logo with site root link
  const logoLink = document.createElement('a');
  logoLink.id = 'top';
  logoLink.href = siteRoot;
  logoLink.classList = 'logo';
  logoLink.append(document.createElement('div'));
  header.prepend(logoLink);

  // header css classes
  header.querySelector('h1')?.classList.add('title', 'title-site');
  header.querySelector('h2')?.classList.add('title', 'title-site', 'caption');
}

/**
 * @param {Element} mainNav
 */
function decorateMainNav(mainNav) {
  mainNav.classList.add('nav-main');

  // mobile navigation
  const h1 = document.createElement('h1');
  h1.classList.add('title', 'title-nav', 'title-mainnav');
  const anchor = document.createElement('a');
  anchor.href = '#';
  anchor.classList.add('menu-opener');
  anchor.text = 'Navigation';
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    mainNav.querySelector('.navlist-main')?.classList.toggle('active');
  });
  h1.append(anchor);
  mainNav.prepend(h1);

  // mainnav CSS classes
  mainNav.querySelectorAll(':scope > ul').forEach((ul) => ul.classList.add('row', 'navlist', 'navlist-main'));
  mainNav.querySelectorAll('a').forEach((a) => a.classList.add('navlink', 'navlink-main'));
}

/**
 * Loads and decorates header and main navigation.
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
