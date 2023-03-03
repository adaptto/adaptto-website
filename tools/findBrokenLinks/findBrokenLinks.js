/**
 * The script crawls main--adaptto-website--adaptto.hlx page and checks if every link can be opened.
 * The results will be printed in the console and saved to results.json and fails.txt
 * Script can be run via
 *   cd to/this/folder
 *   node findBrokenLinks.js
 */

/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs/promises');

const puppeteer = require('puppeteer');
const xml2js = require('xml2js');

const BASE = 'https://main--adaptto-website--adaptto.hlx.live';
const SITE_MAP = `${BASE}/sitemap.xml`;

/** @type {string[]} */
let links = [];
/** @type {Array<[string, number]>} */
const visited = [];
// a record of every page and its links
const map = {};
/** @type {string[]} */
const fails = [];

async function crawlPages() {
  // sitemap returns urls of the prod page,
  // links = await getPageUrlsFromSitemap();
  // instead start crawling from the root
  links = [BASE];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // e.g. adobe.com would return 403 for the default puppeteer user agent
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
  /** @type{Boolean} */
  let resourceIsAsset;
  /** @type{Boolean} */
  let openedSuccessfully;

  // headless chrome won't be able to navigate and open pdf files.
  // but the response when trying will be successful
  page.on('response', (intercept) => {
    if (intercept.request().isNavigationRequest()) {
      openedSuccessfully = intercept.ok();
      // seems only .pdf files bing download links
      resourceIsAsset = intercept.url().endsWith('.pdf');
    }
  });

  do {
    const target = links.pop();
    visited.push(target);

    console.log(visited.length, '/', visited.length + links.length, target);

    try {
      const navOption = { timeout: 60_000 };
      // on helix pages wait till the last block is downloaded
      if (target.startsWith(BASE)) navOption.waitUntil = 'networkidle0';
      await page.goto(target, navOption);
    } catch {
      // can be e.g. cert error. we don't really care about the error
    }

    // linkedin returns sometime a status code of '999 Request Denied' but browsers can open it
    // {@see https://http.dev/999#linkedin}
    const isLinkedInUrl = target.includes('linkedin.com');
    if (!openedSuccessfully && !isLinkedInUrl) fails.push([target, visited.length]);

    let marker;
    if (openedSuccessfully) marker = '✅';
    else if (isLinkedInUrl) marker = '❓';
    else marker = '❌';
    replaceLastLine(marker, visited.length, '/', visited.length + links.length, target);

    if (target.startsWith(BASE) && !resourceIsAsset) await extractLinks(page);
  } while (links.length > 0);

  await browser.close();

  if (fails.length) {
    console.log("This urls couldn't be loaded:");
    fails.forEach(([link, ix]) => {
      console.log(ix, link);
      console.log('  linked from:');
      getPagesWithThisLink(link).forEach((pageUrl) => console.log('\t- ', pageUrl));
    });
  }

  const output = {
    map,
    links: visited.map((link) => ({
      url: link,
      success: !fails.some(([url]) => url === link),
      haveThisLink: getPagesWithThisLink(link),
    })),
  };

  await fs.writeFile('results.json', JSON.stringify(output, null, '  '));
  await fs.writeFile('fails.txt', fails.map(([url]) => url).sort().join('\n'));
}

/**
 * return a list of pages that have anchor with the given url
 * @param {string} url - url of a page
 * @returns {string}
 */
function getPagesWithThisLink(url) {
  return Object.entries(map)
    // eslint-disable-next-line no-unused-vars
    .filter(([_pageUrl, pageLinks]) => pageLinks.includes(url))
    .map(([pageUrl]) => pageUrl);
}

/**
 * console.log. but replaces the last logged line
 * @param  {...any} args
 */
function replaceLastLine(...args) {
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // clear from cursor to end
  console.log(...args);
}

// eslint-disable-next-line no-unused-vars
async function getPageUrlsFromSitemap() {
  if (process.versions.node.split('.') < '18') console.error('Needs Node@18 or higher to support fetch API');

  const res = await fetch(SITE_MAP);
  const data = await res.text();

  const sitemap = await parseXML(data);
  return sitemap.urlset.url.map((entry) => entry.loc[0]);
}

/**
 * adds href of every anchor in the page to the `links` list
 *
 * @param {puppeteer.Page} page
 */
async function extractLinks(page) {
  try {
    const anchors = await page.$$('a');
    let pageLinks = [];

    for (const anchor of anchors) {
      const handler = await anchor.getProperty('href');
      let href = await handler.jsonValue();

      // remove query params and hashes. assuming they lead still to the same page and content
      // eslint-disable-next-line prefer-destructuring
      href = href.split('#')[0].split('?')[0];

      if (href.startsWith('mailto:') || !href.trim()) continue;

      pageLinks.push(href);
    }
    // unique new links
    pageLinks = Array.from(new Set(
      pageLinks.filter((link) => !visited.includes(link) && !links.includes(link)),
    ));
    links.push(...pageLinks);
    map[page.url()] = pageLinks;
  } catch (err) {
    console.error(err);
  }
}

function parseXML(str) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(str, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

crawlPages();
