/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { convertSheetDateValue, formatDateFull, formatTime } from '../../../scripts/utils/datetime.js';

describe('utils/datetime', () => {
  it('formatDateFull', () => {
    expect(formatDateFull(new Date(Date.UTC(2021, 5, 15, 12, 10)))).to.eq('Tuesday, 15 June 2021');
  });

  it('formatTime', () => {
    expect(formatTime(new Date(Date.UTC(2021, 5, 15, 12, 10)))).to.eq('12:10');
  });

  it('convertSheetDateValue', () => {
    expect(convertSheetDateValue(44102.416666666664).toISOString()).to.eq('2020-09-28T10:00:00.000Z');
    expect(convertSheetDateValue(44466.46527777778).toISOString()).to.eq('2021-09-27T11:10:00.000Z');
  });
});
