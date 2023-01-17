/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getQueryIndex } from '../../scripts/QueryIndex.js';

const queryIndex = await getQueryIndex('/test/scripts/query-index-sample.json');

describe('QueryIndex', () => {
  it('getAllSiteRoots', () => {
    const result = queryIndex.getAllSiteRoots();
    expect(result).to.eql([
      { path: '/2021/', title: 'adaptTo() 2021' },
      { path: '/2020/', title: 'adaptTo() 2020' },
    ]);
  });
});
