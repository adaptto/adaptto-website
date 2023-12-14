/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { buildBlock } from '../../../scripts/aem.js';
import decorate from '../../../blocks/talk-archive/talk-archive.js';
import { stubFetchUrlMap } from '../../scripts/test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-schedule-2020.json' });

describe('blocks/talk-archive', () => {
  it('no-filter', async () => {
    const block = buildBlock('talk-archive', []);
    await decorate(block);

    const search = block.querySelector('.search');
    expect(search).to.exist;

    const filterCategories = Array.from(block.querySelectorAll('.filter .filter-category'));
    expect(filterCategories.length).to.eq(3);
    expect(filterCategories[0].querySelector('.category').textContent).to.eq('Tags');
    expect(filterCategories[0].querySelectorAll('input[type=checkbox]').length, 'number tags').to.eq(12);
    expect(filterCategories[1].querySelector('.category').textContent).to.eq('Year');
    expect(filterCategories[1].querySelectorAll('input[type=checkbox]').length, 'number years').to.eq(1);
    expect(filterCategories[2].querySelector('.category').textContent).to.eq('Speaker');
    expect(filterCategories[2].querySelectorAll('input[type=checkbox]').length, 'number speakers').to.eq(49);

    const result = block.querySelector('.result');
    expect(result).to.exist;
    expect(result.querySelectorAll('table tbody tr:not(.no-result)').length, 'number talks').to.eq(46);
    expect(result.querySelector('table tbody tr.no-result'), 'no result').to.not.exist;
  });

  it('filtered-with-result', async () => {
    window.history.replaceState(null, null, '#tags=Sling');
    const block = buildBlock('talk-archive', []);
    await decorate(block);

    const result = block.querySelector('.result');
    expect(result).to.exist;
    expect(result.querySelectorAll('table tbody tr:not(.no-result)').length, 'number talks').to.eq(7);
    expect(result.querySelector('table tbody tr.no-result'), 'no result').to.not.exist;
  });

  it('filtered-no-result', async () => {
    window.history.replaceState(null, null, '#tags=Invalid');
    const block = buildBlock('talk-archive', []);
    await decorate(block);

    const result = block.querySelector('.result');
    expect(result).to.exist;
    expect(result.querySelectorAll('table tbody tr:not(.no-result)').length, 'number talks').to.eq(0);
    expect(result.querySelector('table tbody tr.no-result'), 'no result').to.exist;
  });
});
