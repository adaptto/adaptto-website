/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

/** @type {import('./types').LibFranklin} */
let lib;

document.body.innerHTML = await readFile({ path: './dummy.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('Core Helix features', () => {
  before(async () => {
    lib = await import('../../scripts/aem.js');

    document.body.innerHTML = await readFile({ path: './body.html' });
  });

  it('Initializes window.hlx', async () => {
    // simulate code base path and turn on lighthouse
    window.history.pushState({}, '', `${window.location.href}&lighthouse=on`);
    lib.setup(`${window.location.origin}/foo/scripts/aem.js`);

    expect(window.hlx.codeBasePath).to.equal('/foo');
    expect(window.hlx.lighthouse).to.equal(true);

    // cleanup
    window.hlx.codeBasePath = '';
    window.hlx.lighthouse = false;
  });
});
