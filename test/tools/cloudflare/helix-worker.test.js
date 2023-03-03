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
  expect(response.status, `return code for ${givenPath}`).to.eq(expectedCode);
  expect(response.headers.get('location'), `redirect url for ${givenPath}`).to.eq(`https://host${expectedPath}`);
}

describe('tools/cloudflare/helix-worker', () => {
  it('rewriteShortUrls', async () => {
    await assertRedirect('/1999', '/1999/', 301);
    await assertRedirect('/2021', '/2021/', 301);
    await assertRedirect('/', `/${currentYear}/`, 302);
    await assertRedirect('/cfp', `/${currentYear}/sign-up/call-for-papers`, 302);
    await assertRedirect('/tickets', `/${currentYear}/sign-up/tickets`, 302);
    await assertRedirect('/gallery', `/${currentYear}/conference/gallery`, 302);
    await assertRedirect('/archive', `/${currentYear}/archive`, 302);
    await assertRedirect('/privacy', `/${currentYear}/privacy/privacy`, 302);
  });

  it('rewriteLegacyUrlsWithSanitizing', async () => {
    await assertRedirect('/2020/en.html', '/2020/', 301);
    await assertRedirect('/2020/en/conference.html', '/2020/conference', 301);
    await assertRedirect('/2020/en/conference/Test__Abc.html', '/2020/conference/test-abc', 301);
    await assertRedirect(
      '/content/dam/adaptto/production/presentations/2021/adaptTo2021-AEM-Cloud-Service-from-a-Developer-Perspective-Carsten-Ziegeler.pdf/_jcr_content/renditions/original.media_file.download_attachment.file/adaptTo2021-AEM-Cloud-Service-from-a-Developer-Perspective-Carsten-Ziegeler.pdf',
      '/2021/presentations/adaptto2021-aem-cloud-service-from-a-developer-perspective-carsten-ziegeler.pdf',
      301,
    );
  });

  it('forwardHelix', async () => {
    const response = await executeRequest('https://host/2021/');
    expect(response.status).to.eq(200);
  });
});
