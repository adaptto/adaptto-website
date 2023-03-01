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
  [new RegExp('^/(\\d\\d\\d\\d)/en(.*)\\.html$'), '/$1/$2', 301],
];

/**
 * Rewrites URL if captured by redirect map.
 */
const getRedirectTarget = (url) => {
  const { pathname } = url;
  for (const [regex, replacement, code] of redirectMap) {
    if (regex && replacement) {
      const match = pathname.match(regex);
      if (match) {
        url.pathname = pathname.replace(regex, replacement);
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
