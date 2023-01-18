/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const scheduleBlock = buildBlock('schedule', [['scheduledataurl', '/test/test-data/schedule-data-sample.json'],
  ['queryindexurl', '/test/test-data/query-index-schedule-2020.json']]);
document.querySelector('main').append(scheduleBlock);
decorateBlock(scheduleBlock);
await loadBlock(scheduleBlock);
await sleep();

describe('Schedule Block', () => {
  it('block', async () => {
    const schedule = document.querySelector('.schedule');

    expect(schedule.querySelector('.tab-navigation a[rel="id-day-1"].active')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-2"]')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-3"]')).to.exist;

    expect(schedule.querySelector('#id-day-1.tab-content.active')).to.exist;
    expect(schedule.querySelector('#id-day-2.tab-content')).to.exist;
    expect(schedule.querySelector('#id-day-3.tab-content')).to.exist;

    const day1 = schedule.querySelector('#id-day-1');
    expect(day1.querySelector('h4 > date')).to.exist;
    expect(day1.querySelectorAll('table > tbody > tr').length).to.eq(19);
  });
});
