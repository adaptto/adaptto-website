import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
} from './lib-franklin.js';
import { decorateAnchors } from './services/LinkHandler.js';
import { getSiteRootPath, isSpeakerDetailPath } from './utils/site.js';
import { decorateConsentManagement } from './utils/usercentrics.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

/**
 * Extracts the stage header block and prepends a new section for it.
 * @param {Element} main
 */
function extractStageHeader(main) {
  // insert stage-header section in any case for grid layout - even if there is no content for it
  const section = document.createElement('div');
  section.classList.add('stage-header-section');
  main.prepend(section);

  // move stage header to new section
  const stageHeader = main.querySelector('.stage-header');
  if (stageHeader) {
    section.appendChild(stageHeader);
  }
}

/**
 * Auto-builds speaker detail block in speaker page.
 * @param {Element} main The container element
 */
function decorateSpeakerPage(main) {
  if (isSpeakerDetailPath(window.location.pathname)) {
    const section = main.querySelector(':scope > div');
    if (section) {
      section.prepend(buildBlock('speaker-detail', { elems: Array.from(section.children) }));
    }
  }
}

/**
 * Inserts new section with talk detail components.
 * @param {Element} main The container element
 */
function decorateTalkDetailPage(main) {
  if (getMetadata('theme') === 'talk-detail') {
    const firstSection = main.querySelector(':scope > div');
    if (firstSection) {
      // add block after headline before outline
      const h1 = firstSection.querySelector(':scope > h1');
      const talkDetailBeforeOutline = document.createElement('div');
      talkDetailBeforeOutline.classList.add('talk-detail-before-outline');
      if (h1.nextSibling) {
        firstSection.insertBefore(talkDetailBeforeOutline, h1.nextSibling);
      } else {
        firstSection.append(talkDetailBeforeOutline);
      }
      // add block after outline
      const talkDetailAfterOutline = document.createElement('div');
      talkDetailAfterOutline.classList.add('talk-detail-after-outline');
      firstSection.append(talkDetailAfterOutline);
    }
    // add new section with footer block
    const footerSection = document.createElement('div');
    main.append(footerSection);
    const talkDetailFooter = document.createElement('div');
    talkDetailFooter.classList.add('talk-detail-footer');
    footerSection.append(talkDetailFooter);
  }
}

/**
 * Builds a fragment block
 * @param {string} fragmentRef Local path to fragment (without site root)
 * @returns Fragment block element
 */
function buildFragmentBlock(fragmentRef) {
  const siteRootPath = getSiteRootPath(window.location.pathname);
  const fragmentPath = `${siteRootPath}${fragmentRef}`;
  const fragmentLink = document.createElement('a');
  fragmentLink.setAttribute('href', fragmentPath);
  fragmentLink.innerText = fragmentPath;
  return buildBlock('fragment', fragmentLink);
}

/**
 * Appends a new section with the aside bar fragment,
 * if it is not disabled for this page via metadata.
 * @param {Element} main The container element
 */
function appendAsideBar(main) {
  if (getMetadata('include-aside-bar') === 'false') {
    return;
  }
  const fragment = buildFragmentBlock('fragments/aside-bar');
  const section = document.createElement('div');
  section.classList.add('aside-bar-section');
  section.appendChild(fragment);
  main.append(section);
}

/**
 * Appends a new section with the teaser bar fragment,
 * if it is not disabled for this page via metadata.
 * @param {Element} main The container element
 */
function appendTeaserBar(main) {
  if (getMetadata('include-teaser-bar') === 'false') {
    return;
  }
  const fragment = buildFragmentBlock('fragments/teaser-bar');
  const section = document.createElement('div');
  section.classList.add('teaser-bar-section');
  section.appendChild(fragment);
  main.append(section);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    decorateSpeakerPage(main);
    decorateTalkDetailPage(main);
    extractStageHeader(main);
    appendAsideBar(main);
    appendTeaserBar(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 * @param {boolean} insideFragment Decorate main block inside a fragment
 */
export function decorateMain(main, insideFragment) {
  decorateIcons(main);
  decorateAnchors(main);
  if (!insideFragment) {
    buildAutoBlocks(main);
  }
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Applies template and theme as defined in document's metadata. Additionally,
 * if no template is set, a default template is derived based on "include-aside-bar" status.
 * Supported templates are:
 * - content-3col (default)
 * - content-4col (default with include-aside-bar=false)
 * - content-2col
 */
function decorateTemplateAndThemeWithAutoDetection() {
  decorateTemplateAndTheme();
  let template = getMetadata('template');
  if (!template) {
    if (getMetadata('include-aside-bar') === 'false') {
      template = 'content-4col';
    } else {
      template = 'content-3col';
    }
    document.body.classList.add(template);
  }
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndThemeWithAutoDetection();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  decorateConsentManagement(document.head);
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/resources/img/adaptto-favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
