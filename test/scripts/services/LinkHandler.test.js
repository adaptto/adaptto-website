/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { decorateAnchor, decorateAnchors, rewriteUrl } from '../../../scripts/services/LinkHandler.js';
import { append } from '../../../scripts/utils/dom.js';

describe('services/LinkHandler', () => {
  it('rewriteUrl', () => {
    expect(rewriteUrl('https://adapt.to/mypath')).to.eq('/mypath');
    expect(rewriteUrl('https://experimental-download-links--adaptto-website--adaptto.hlx.page/2021/schedule')).to.eq('/2021/schedule');
    expect(rewriteUrl('https://experimental-download-links--adaptto-website--adaptto.aem.page/2021/schedule')).to.eq('/2021/schedule');
    expect(rewriteUrl('https://main--adaptto-website--adaptto.hlx.live/2021/schedule#day1')).to.eq('/2021/schedule#day1');
    expect(rewriteUrl('https://localhost:2000/2021/schedule#day1')).to.eq('/2021/schedule#day1');
    expect(rewriteUrl('https://my.host.com/mypath')).to.eq('https://my.host.com/mypath');
    expect(rewriteUrl('')).to.eq('');
    expect(rewriteUrl(undefined)).to.undefined;
  });

  it('decorateAnchorLink_internal', () => {
    const a = document.createElement('a');
    a.href = 'https://adapt.to/mypath';

    decorateAnchor(a);

    expect(a.href).to.eq('http://localhost:2000/mypath');
    expect(a.hasAttribute('target')).to.false;
    expect(a.hasAttribute('download')).to.false;
  });

  it('decorateAnchorLink_internal_download', () => {
    const a = document.createElement('a');
    a.href = 'https://adapt.to/mypath/download.pdf';

    decorateAnchor(a);

    expect(a.href).to.eq('http://localhost:2000/mypath/download.pdf');
    expect(a.hasAttribute('target')).to.false;
    expect(a.hasAttribute('download')).to.true;
  });

  it('decorateAnchorLink_external', () => {
    const a = document.createElement('a');
    a.href = 'https://my.host.com/mypath';

    decorateAnchor(a);

    expect(a.href).to.eq('https://my.host.com/mypath');
    expect(a.target).to.eq('_blank');
    expect(a.hasAttribute('download')).to.false;
  });

  it('decorateAnchorLink_linkedin', () => {
    const a = document.createElement('a');
    a.href = 'https://adapt.to/linkedin';

    decorateAnchor(a);

    expect(a.href).to.eq('https://adapt.to/linkedin');
    expect(a.target).to.eq('_blank');
    expect(a.hasAttribute('download')).to.false;
  });

  it('decorateAnchorLinks', () => {
    const container = append(document.body, 'div');
    const internalLink = append(container, 'a');
    internalLink.href = 'https://adapt.to/mypath';
    const externalLink = append(container, 'a');
    externalLink.href = 'https://my.host.com/mypath';

    decorateAnchors(container);

    expect(internalLink.href).to.eq('http://localhost:2000/mypath');
    expect(internalLink.hasAttribute('target')).to.false;
    expect(internalLink.hasAttribute('download')).to.false;
    expect(externalLink.href).to.eq('https://my.host.com/mypath');
    expect(externalLink.target).to.eq('_blank');
    expect(externalLink.hasAttribute('download')).to.false;
  });
});
