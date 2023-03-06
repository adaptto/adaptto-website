/* eslint-disable strict, prefer-regex-literals, no-restricted-syntax */

'use strict';

const currentYear = 2023;
const redirectMap = [
  // year redirects
  [new RegExp('^/(\\d\\d\\d\\d)$'), '/$1/', 301],
  // shortcuts for current year
  [new RegExp('^/$'), `/${currentYear}/`, 302],
  [new RegExp('^/cfp$'), `/${currentYear}/sign-up/call-for-papers`, 302],
  [new RegExp('^/(tickets|call-for-papers)$'), `/${currentYear}/sign-up/$1`, 302],
  [new RegExp('^/(speaker|program-committee|gallery|code-of-conduct|contact)$'), `/${currentYear}/conference/$1`, 302],
  [new RegExp('^/(conference|agenda|sponsors|venue|newsletter|archive)$'), `/${currentYear}/$1`, 302],
  [new RegExp('^/(privacy|email-privacy)$'), `/${currentYear}/privacy/$1`, 302],
  // rewrite old AEM URI schema
  [new RegExp('^/(\\d\\d\\d\\d)/en/?(.*)\\.html$'), '/$1/$2', 301, true],
  [new RegExp('^/content/dam/adaptto/production/presentations/([^/]+)/(.+?)(/_jcr_content/renditions/original\\..+)?$'), '/$1/presentations/$2', 301, true],
];

/**
 * Sanitizes the given string by :
 * - convert to lower case
 * - normalize all unicode characters
 * - replace all non-alphanumeric characters with a dash
 * - remove all consecutive dashes
 * - remove all leading and trailing dashes
 * (taken over from https://github.com/adobe/helix-onedrive-support/blob/8af8195badcd9ce2bfe90d01108c5d84685a54e3/src/utils.js)
 *
 * @param {string} name
 * @returns {string} sanitized name
 */
function sanitizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Sanitizes the file path by:
 * - convert to lower case
 * - normalize all unicode characters
 * - replace all non-alphanumeric characters with a dash
 * - remove all consecutive dashes
 * - remove all leading and trailing dashes
 *
 * Note that only the basename of the file path is sanitized. i.e. The ancestor path and the
 * extension is not affected.
 * (taken over from https://github.com/adobe/helix-onedrive-support/blob/8af8195badcd9ce2bfe90d01108c5d84685a54e3/src/utils.js)
 *
 * @param {string} filepath the file path
 * @param {object} opts Options
 * @param {boolean} [opts.ignoreExtension] if {@code true} ignores the extension
 * @returns {string} sanitized file path
 */
function sanitizePath(filepath, opts = {}) {
  const idx = filepath.lastIndexOf('/') + 1;
  const extIdx = opts.ignoreExtension ? -1 : filepath.lastIndexOf('.');
  const pfx = filepath.substring(0, idx);
  const basename = extIdx < idx ? filepath.substring(idx) : filepath.substring(idx, extIdx);
  const ext = extIdx < idx ? '' : filepath.substring(extIdx);
  const name = sanitizeName(basename);
  return `${pfx}${name}${ext}`;
}

/**
 * Rewrites URL if captured by redirect map.
 */
const getRedirectTarget = (url) => {
  const { pathname } = url;
  for (const [regex, replacement, code, sanitize] of redirectMap) {
    if (regex && replacement) {
      const match = pathname.match(regex);
      if (match) {
        url.pathname = pathname.replace(regex, replacement);
        if (sanitize) {
          url.pathname = sanitizePath(url.pathname);
        }
        return { url, code: code ?? 301 };
      }
    }
  }
  return undefined;
};

/**
 * Forwards request to Helix with adapting request headers
 * and enabling push invalidation.
 */
const forwardHelix = async (url, request, env) => {
  url.hostname = env.ORIGIN_HOSTNAME;
  const req = new Request(url, request);
  req.headers.set('x-forwarded-host', req.headers.get('host'));
  req.headers.set('x-byo-cdn-type', 'cloudflare');
  // set the following header if push invalidation is configured
  // (see https://www.hlx.live/docs/setup-byo-cdn-push-invalidation#cloudflare)
  req.headers.set('x-push-invalidation', 'enabled');
  let resp = await fetch(req, {
    cf: {
      // cf doesn't cache html by default: need to override the default behavior
      cacheEverything: true,
    },
  });
  resp = new Response(resp.body, resp);
  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');
  return resp;
};

const handleRequest = async (request, env) => {
  const url = new URL(request.url);
  const redirectTarget = getRedirectTarget(url);
  if (redirectTarget) {
    return Response.redirect(redirectTarget.url, redirectTarget.code);
  }
  return forwardHelix(url, request, env);
};

export default {
  fetch: handleRequest,
};
