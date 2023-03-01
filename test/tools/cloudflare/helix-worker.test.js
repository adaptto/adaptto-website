/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import _helixWorker from '../../../tools/cloudflare/helix-worker.js';
import { stubFetchUrlMap } from '../../scripts/test-utils.js';

stubFetchUrlMap({
  'https://origin/2021/': '/test/scripts/dummy.html',
});

const currentYear = 2023;
const env = { ORIGIN_HOSTNAME: 'origin' };

async function executeRequest(url) {
  const request = new Request(url);
  return _helixWorker.fetch(request, env);
}

async function assertRedirect(givenPath, expectedPath, expectedCode = 301) {
  const response = await executeRequest(`https://host${givenPath}`);
  expect(response.code, expectedCode);
  expect(response.headers.location, `https://host${expectedPath}`);
}

describe('tools/cloudflare-helix-worker', () => {
  it('rewrite', async () => {
    await assertRedirect('/1999', '/1999/');
    await assertRedirect('/2021', '/2021/');
    await assertRedirect('/', `/${currentYear}/`);
    await assertRedirect('/cfp', `/${currentYear}/sign-up/call-for-papers`);
    await assertRedirect('/tickets', `/${currentYear}/sign-up/tickets`);
    await assertRedirect('/gallery', `/${currentYear}/conference/gallery`);
    await assertRedirect('/archive', `/${currentYear}/archive`);
    await assertRedirect('/privacy', `/${currentYear}/privacy/privacy`);
    await assertRedirect('/2020/en.html', `/${currentYear}/2020/`);
    await assertRedirect('/2020/en/conference.html', `/${currentYear}/2020/conference`);
  });

  it('forwardHelix', async () => {
    const response = await executeRequest('https://host/2021/');
    expect(response.status).to.eq(200);
  });
});
