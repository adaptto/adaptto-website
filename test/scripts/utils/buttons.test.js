/* global describe it */

import { expect } from '@esm-bundle/chai';
import { decorateButtons } from '../../../scripts/utils/buttons.js';

function decorate(innerHTML) {
  const main = document.createElement('main');
  main.innerHTML = innerHTML;
  decorateButtons(main);
  return main;
}

describe('utils/buttons', () => {
  it('decorates single link in paragraph as default button', () => {
    const main = decorate('<p><a href="/foo">Foo</a></p>');
    expect(main.querySelector('p').className).to.eq('button-container');
    expect(main.querySelector('a').className).to.eq('button');
    expect(main.querySelector('a').title).to.eq('Foo');
  });

  it('decorates bold link as primary button', () => {
    const main = decorate('<p><strong><a href="/foo">Foo</a></strong></p>');
    expect(main.querySelector('p').className).to.eq('button-container');
    expect(main.querySelector('a').className).to.eq('button primary');
  });

  it('decorates italic link as secondary button', () => {
    const main = decorate('<p><em><a href="/foo">Foo</a></em></p>');
    expect(main.querySelector('p').className).to.eq('button-container');
    expect(main.querySelector('a').className).to.eq('button secondary');
  });

  it('does not decorate links with text, images or URL as text', () => {
    const main = decorate(`
      <p>Some <a href="/foo">Foo</a> text</p>
      <p><a href="/bar"><img src="/bar.png" alt=""></a></p>
      <p><a href="https://example.com/">https://example.com/</a></p>`);
    expect(main.querySelectorAll('.button-container').length).to.eq(0);
    expect(main.querySelectorAll('a.button').length).to.eq(0);
  });
});
