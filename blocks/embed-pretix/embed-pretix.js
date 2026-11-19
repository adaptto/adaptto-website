import { readBlockConfig } from '../../scripts/aem.js';
import html from '../../scripts/utils/htmlTemplateTag.js';
import { append } from '../../scripts/utils/dom.js';
import { decorateWithConsent } from '../../scripts/utils/usercentrics.js';

/**
 * Embed Pretix Ticket Shop.
 * @param {Element} block
 */
export default function decorate(block) {
  const config = readBlockConfig(block);
  const shopUrl = config['shop-url'];
  const shopCssUrl = config['shop-css-url'];
  const scriptUrl = config['script-url'];

  if (shopUrl && shopCssUrl && scriptUrl) {
    block.innerHTML = '';

    const p = append(block, 'p');
    p.innerHTML = html`Direct link to <a href="${shopUrl}" target="_blank">adaptTo() Ticket Shop</a>.`;

    const div = append(block, 'div');

    decorateWithConsent('pretix', div, (parent) => {
      // the widget element has to exist before the pretix script runs,
      // as the script builds all widgets present in the DOM on execution
      parent.innerHTML = html`
        <link rel="stylesheet" type="text/css" href="${shopCssUrl}">
        <pretix-widget event="${shopUrl}"></pretix-widget>
      `;
      if (window.PretixWidget) {
        // script already loaded (e.g. re-rendered after consent change)
        window.PretixWidget.buildWidgets();
      } else {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.type = 'text/javascript';
        document.head.append(script);
      }
    });
  }
}
