import { readBlockConfig } from '../../scripts/lib-franklin.js';
import html from '../../scripts/utils/htmlTemplateTag.js';
import { isConsentManagementEnabled } from '../../scripts/utils/usercentrics.js';

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
    // add pretix script to HTML head
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (isConsentManagementEnabled() && window.uc) {
        window.uc.reloadOnOptIn('4gBcUVFgPUn-Zs');
        window.uc.blockElements({
          '4gBcUVFgPUn-Zs': '.pretix-ticket-shop',
        });
      }

      block.innerHTML = html`
        <link rel="stylesheet" type="text/css" href="${shopCssUrl}">
        <div class="pretix-ticket-shop">
          <pretix-widget event="${shopUrl}"></pretix-widget>
          <noscript>
            <div class="pretix-widget">
              <div class="pretix-widget-info-message">
                JavaScript is disabled in your browser. To access our ticket shop without JavaScript, please <a target="_blank" rel="noopener" href="${shopUrl}">click here</a>.
              </div>
            </div>
          </noscript>
        </div>
        <p>
          Direct link to <a href="${shopUrl}" target="_blank">adaptTo() Ticket Shop</a>.
        </p>
      `;
    };
    document.head.append(script);
  }
}
