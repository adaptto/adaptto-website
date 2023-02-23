import { append, prepend } from '../../scripts/utils/dom.js';
import { addArchiveLinks, getSiteRootPathAlsoForSpeakerPath } from '../../scripts/utils/site.js';
import { decorateAnchors } from '../../scripts/services/LinkHandler.js';
import { getFetchCacheOptions } from '../../scripts/utils/fetch.js';

/**
 * @param {Element} nav
 */
function decorateMainNav(nav) {
  // mobile navigation
  const mobileNavH1 = prepend(nav, 'h1', 'mobile-nav');
  const mobileNavAnchor = append(mobileNavH1, 'a');
  mobileNavAnchor.href = '#';
  mobileNavAnchor.text = 'Navigation';
  mobileNavAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    nav.querySelector(':scope > ul')?.classList.toggle('active');
  });

  // mobile navigation support for mainnav items with sub menus
  // ensure for those items the link is not followed, but the submenu is shown
  // (if mobile nav is active)
  nav.querySelectorAll('li > a').forEach((a) => {
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
  addArchiveLinks(nav);
}

/**
 * Loads and decorates header and main navigation.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // detect site root
  // for speaker pages, this year may be derived from hash, or from latest speaker's talk
  const siteRoot = await getSiteRootPathAlsoForSpeakerPath(
    window.location.pathname,
    window.location.hash,
  );

  // logo link
  const logoLink = document.querySelector('header a.logo');
  if (logoLink) {
    logoLink.href = siteRoot;
  }

  // fetch nav content
  const resp = await fetch(`${siteRoot}nav.plain.html`, getFetchCacheOptions());
  if (resp.ok) {
    const html = await resp.text();
    const container = document.createElement('div');
    container.innerHTML = html;
    decorateAnchors(container);

    // first section: title and slogan, second section: main navigation
    const titles = container.children[0];
    const mainNav = container.children[1];
    if (titles) {
      block.append(...Array.from(titles.childNodes));
    }
    if (mainNav) {
      const nav = append(block, 'nav');
      nav.append(...Array.from(mainNav.childNodes));
      decorateMainNav(nav);
    }
  }
}
