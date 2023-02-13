const settingsId = 'o544Hdz9e';

/**
 * Enables Usercentrics Consent Management.
 * @param {Element} head HTML Head
 */
/* eslint-disable-next-line import/prefer-default-export */
export function enableConsentManagement(head) {
  head.insertAdjacentHTML('beforeend', `
    <link rel="preconnect" href="//app.usercentrics.eu">
    <link rel="preconnect" href="//privacy-proxy.usercentrics.eu">
    <link rel="preload" href="//privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" as="script">
    <script id="usercentrics-cmp" data-settings-id="${settingsId}" src="https://app.usercentrics.eu/browser-ui/latest/bundle.js" async></script>
    <script type="application/javascript" src="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js"></script>
  `);
}
