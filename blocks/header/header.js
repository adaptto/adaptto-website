import { append, prepend } from '../../scripts/utils/dom.js';
import { addArchiveLinks, getSiteRootPath } from '../../scripts/utils/site.js';
import { decorateExternalLinks } from '../../scripts/scripts.js';

/**
 * @param {Element} header
 * @param {string} siteRoot
 */
function decorateHeader(header, siteRoot) {
  header.classList.add('section-header');

  // add logo with site root link
  const logoLink = prepend(header, 'a', 'logo');
  logoLink.id = 'top';
  logoLink.href = siteRoot;
  append(logoLink, 'div');
}

/**
 * @param {Element} mainNav
 */
function decorateMainNav(mainNav) {
  mainNav.classList.add('section-mainnav');

  // mobile navigation
  const mobileNavH1 = prepend(mainNav, 'h1', 'mobile-nav');
  const mobileNavAnchor = append(mobileNavH1, 'a');
  mobileNavAnchor.href = '#';
  mobileNavAnchor.text = 'Navigation';
  mobileNavAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    mainNav.querySelector(':scope > ul')?.classList.toggle('active');
  });

  // mobile navigation support for mainnav items with sub menus
  // ensure for those items the link is not followed, but the submenu is shown
  // (if mobile nav is active)
  mainNav.querySelectorAll('li > a').forEach((a) => {
    const li = a.parentElement;
    // nav item has sub menu
    const submenu = li.querySelector(':scope > ul');
    if (submenu) {
      a.addEventListener('click', (e) => {
        if (window.getComputedStyle(mobileNavH1).display !== 'none') {
          e.preventDefault();
          submenu.classList.toggle('active');
        }
      });
    }
  });

  // add archive links to last mainnav item
  addArchiveLinks(mainNav);
}

/**
 * Loads and decorates header and main navigation.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch nav content
  const siteRoot = getSiteRootPath(document.location.pathname);
  const resp = await fetch(`${siteRoot}nav.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateExternalLinks(nav);

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
