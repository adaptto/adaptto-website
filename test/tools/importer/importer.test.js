/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import _import from '../../../tools/importer/import.js';

function path(url) {
  return _import.generateDocumentPath({ url });
}

describe('tools/importer/import', () => {
  it('generateDocumentPath', () => {
    expect(path('http://localhost:45031/content/adaptto/2021/en.helix.html')).to.eq('/2021/index');
    expect(path('/content/adaptto/2021/en.helix.html')).to.eq('/2021/index');
    expect(path('/content/adaptto/2021/en.html')).to.eq('/2021/index');
    expect(path('/content/adaptto/2021/en/schedule.helix.html')).to.eq('/2021/schedule');
    expect(path('/content/adaptto/2021/en/schedule/meet-the-experts-session-2.helix.html')).to.eq('/2021/schedule/meet-the-experts-session-2');
    expect(path('/content/adaptto/2020/en/schedule/aem-ai---aem-as-a-content-science-platform.helix.html')).to.eq('/2020/schedule/aem-ai-aem-as-a-content-science-platform');
    expect(path('/content/adaptto/2021/en.helix-nav.html')).to.eq('/2021/nav');
    expect(path('/content/adaptto/2021/en.helix-fragment-teaser-bar.html')).to.eq('/2021/fragments/teaser-bar');
    expect(path('/content/dam/adaptto/production/speaker/name1-name2.helix.html')).to.eq('/speakers/name1-name2');
    expect(path('/content/dam/adaptto/production/speaker/name1-name2.helix.2020.html')).to.eq('/speakers/name1-name2-2020');
    expect(path('/content/dam/adaptto/production/presentations/2021/my-file.pdf/_jcr_content/renditions/original./my-file.pdf')).to.eq('/2021/presentations/my-file.pdf');
    expect(path('/content/dam/adaptto/production/presentations/2021/My.File.pdf/_jcr_content/renditions/original./my-file.pdf')).to.eq('/2021/presentations/my-file.pdf');
    expect(path('/content/dam/adaptto/production/presentations/2021/My.File.pdf')).to.eq('/2021/presentations/my-file.pdf');
    expect(path('/other/url.html')).to.eq('/other/url.html');
  });

  it('rewriteLinks', () => {
    const div = document.createElement('div');
    document.body.append(div);

    const anchor1 = document.createElement('a');
    anchor1.href = '/content/adaptto/2021/en.html';
    anchor1.text = 'Link 1';
    div.append(anchor1);

    const anchor2 = document.createElement('a');
    anchor2.href = 'http://localhost:45031/content/adaptto/2021/en/schedule.helix.html';
    anchor2.text = anchor2.href;
    div.append(anchor2);

    const result = _import.transformDOM({ document });

    const links = result.querySelectorAll('a');
    expect(links.length).to.eq(2);
    expect(links[0].href).to.eq('https://main--adaptto-website--adaptto.hlx.page/2021/');
    expect(links[0].text).to.eq('Link 1');
    expect(links[1].href).to.eq('https://main--adaptto-website--adaptto.hlx.page/2021/schedule');
    expect(links[1].text).to.eq('https://main--adaptto-website--adaptto.hlx.page/2021/schedule');
  });
});
