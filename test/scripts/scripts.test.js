/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { append } from '../../scripts/utils/dom.js';

/** @type {import('./types').Scripts} */
let scripts;
/** @type {import('./types').LibFranklin} */
let lib;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('Core Helix features', () => {
  before(async () => {
    scripts = await import('../../scripts/scripts.js');
    lib = await import('../../scripts/lib-franklin.js');

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('Initializes window.hlx', async () => {
    // simulate code base path and turn on lighthouse
    document.head.appendChild(document.createElement('script')).src = '/foo/scripts/scripts.js';
    window.history.pushState({}, '', `${window.location.href}&lighthouse=on`);
    lib.setup();

    expect(window.hlx.codeBasePath).to.equal('/foo');
    expect(window.hlx.lighthouse).to.equal(true);

    // test error handling
    const url = sinon.stub(window, 'URL');

    // cleanup
    url.restore();
    window.hlx.codeBasePath = '';
    window.hlx.lighthouse = false;
    Array.from(document.querySelectorAll('script')).pop().remove();
  });

  it('Adds favicon', async () => {
    scripts.addFavIcon('/foo.svg');
    const $favIcon = document.querySelector('link[rel="icon"]');
    expect($favIcon.getAttribute('href')).to.equal('/foo.svg');
  });

  it('decorateExternalAndDownloadLinks', async () => {
    const container = append(document.body, 'div');
    const localLink = append(container, 'a');
    localLink.href = 'http://localhost/mypath';
    const externalLink = append(container, 'a');
    externalLink.href = 'https://my.host.com';
    const localDownloadLink = append(container, 'a');
    localDownloadLink.href = '/download.pdf';
    const externalDownloadLink = append(container, 'a');
    externalDownloadLink.href = 'https://my.host.com/download.pdf';

    scripts.decorateExternalAndDownloadLinks(container);

    expect(localLink.target).to.eq('');
    expect(externalLink.target).to.eq('_blank');
    expect(localDownloadLink.target).to.eq('');
    expect(localDownloadLink.hasAttribute('download')).to.true;
    expect(externalDownloadLink.target).to.eq('');
    expect(externalDownloadLink.hasAttribute('download')).to.true;
  });
});
