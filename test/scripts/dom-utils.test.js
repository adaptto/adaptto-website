/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { append, prepend } from '../../scripts/dom-utils.js';

describe('dom-utils', () => {
  it('append-simple', () => {
    const section = document.createElement('section');
    section.append(document.createElement('p'));
    const div = append(section, 'div');
    expect(div.matches('div')).to.true;
    expect(section.outerHTML).to.eq('<section><p></p><div></div></section>');
  });

  it('create-with-classes', () => {
    const section = document.createElement('section');
    const div = append(section, 'div', 'class1', 'class2');
    expect(div.matches('div.class1.class2')).to.true;
    expect(section.outerHTML).to.eq('<section><div class="class1 class2"></div></section>');
  });

  it('prepend-simple', () => {
    const section = document.createElement('section');
    section.append(document.createElement('p'));
    const div = prepend(section, 'div');
    expect(div.matches('div')).to.true;
    expect(section.outerHTML).to.eq('<section><div></div><p></p></section>');
  });

  it('prepend-with-classes', () => {
    const section = document.createElement('section');
    const div = prepend(section, 'div', 'class1', 'class2');
    expect(div.matches('div.class1.class2')).to.true;
    expect(section.outerHTML).to.eq('<section><div class="class1 class2"></div></section>');
  });
});
