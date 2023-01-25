/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import {
  getDocumentName,
  getHostName,
  getPathName,
  isDownload,
  isPath,
  isUrl,
  isUrlOrPath,
} from '../../../scripts/utils/path.js';

describe('utils/path', () => {
  it('isPath', () => {
    expect(isPath('/')).to.true;
    expect(isPath('/path1')).to.true;
    expect(isPath('/path1/path2')).to.true;
    expect(isPath('https://myhost/path1/path2')).to.false;
    expect(isPath('https://my.host.com/path1/path2')).to.false;
    expect(isPath('https://my.host.com/')).to.false;
    expect(isPath(undefined)).to.false;
    expect(isPath('')).to.false;
    expect(isPath('wurstbrot')).to.false;
    expect(isPath('https://my.host.com')).to.false;
  });

  it('isUrl', () => {
    expect(isUrl('/')).to.false;
    expect(isUrl('/path1')).to.false;
    expect(isUrl('/path1/path2')).to.false;
    expect(isUrl('https://myhost/path1/path2')).to.true;
    expect(isUrl('https://my.host.com/path1/path2')).to.true;
    expect(isUrl('https://my.host.com/')).to.true;
    expect(isUrl(undefined)).to.false;
    expect(isUrl('')).to.false;
    expect(isUrl('wurstbrot')).to.false;
    expect(isUrl('https://my.host.com')).to.false;
  });

  it('isUrlOrPath', () => {
    expect(isUrlOrPath('/')).to.true;
    expect(isUrlOrPath('/path1')).to.true;
    expect(isUrlOrPath('/path1/path2')).to.true;
    expect(isUrlOrPath('https://myhost/path1/path2')).to.true;
    expect(isUrlOrPath('https://my.host.com/path1/path2')).to.true;
    expect(isUrlOrPath('https://my.host.com/')).to.true;
    expect(isUrlOrPath(undefined)).to.false;
    expect(isUrlOrPath('')).to.false;
    expect(isUrlOrPath('wurstbrot')).to.false;
    expect(isUrlOrPath('https://my.host.com')).to.false;
  });

  it('getPathName', () => {
    expect(getPathName('/')).to.eq('/');
    expect(getPathName('/path1')).to.eq('/path1');
    expect(getPathName('/path1/path2')).to.eq('/path1/path2');
    expect(getPathName('https://myhost/path1/path2')).to.eq('/path1/path2');
    expect(getPathName('https://my.host.com/path1/path2')).to.eq('/path1/path2');
    expect(getPathName('https://my.host.com/')).to.eq('/');
    expect(getPathName(undefined)).to.undefined;
    expect(getPathName('')).to.undefined;
    expect(getPathName('wurstbrot')).to.undefined;
    expect(getPathName('https://my.host.com')).to.undefined;
  });

  it('getDocumentName', () => {
    expect(getDocumentName('/')).to.undefined;
    expect(getDocumentName('/path1')).to.eq('path1');
    expect(getDocumentName('/path1/path2')).to.eq('path2');
    expect(getDocumentName('https://myhost/path1/path2')).to.eq('path2');
    expect(getDocumentName('https://my.host.com/path1/path2')).to.eq('path2');
    expect(getDocumentName('https://my.host.com/')).to.undefined;
    expect(getDocumentName(undefined)).to.undefined;
    expect(getDocumentName('')).to.undefined;
    expect(getDocumentName('wurstbrot')).to.undefined;
    expect(getDocumentName('https://my.host.com')).to.undefined;
  });

  it('getHostName', () => {
    expect(getHostName('/')).to.undefined;
    expect(getHostName('/path1')).to.undefined;
    expect(getHostName('/path1/path2')).to.undefined;
    expect(getHostName('https://myhost/path1/path2')).to.eq('myhost');
    expect(getHostName('https://my.host.com/path1/path2')).to.eq('my.host.com');
    expect(getHostName('https://my.host.com/')).to.eq('my.host.com');
    expect(getHostName(undefined)).to.undefined;
    expect(getHostName('')).to.undefined;
    expect(getHostName('wurstbrot')).to.undefined;
    expect(getHostName('https://my.host.com')).to.eq('my.host.com');
  });

  it('isDownload', () => {
    expect(isDownload('/download.pdf')).to.true;
    expect(isDownload('https://my.host.com/path1/download.zip')).to.true;
    expect(isDownload('/')).to.false;
    expect(isDownload('/path1')).false;
    expect(isDownload('https://myhost/path1/path2')).to.false;
    expect(isDownload(undefined)).to.false;
    expect(isDownload('')).to.false;
  });
});
