import { append } from "./dom.js";

const enabled = true;
const settingsId = 'o544Hdz9e';

/**
 * Checks enablement of consent management.
 * @returns true if consent management is enabled.
 */
export function isConsentManagementEnabled() {
  return enabled;
}

/**
 * Enables Usercentrics Consent Management.
 * @param {Element} head HTML Head
 */
export function decorateConsentManagement(head) {
  if (!isConsentManagementEnabled()) {
    return;
  }

  const fragment = document.createDocumentFragment();

  // Usercentrics Web CMP v2
  const preconnect1 = append(fragment, 'link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = '//app.usercentrics.eu';

  const preload = append(fragment, 'link');
  preload.rel = 'preload';
  preload.as = 'script';
  preload.href = '//privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js';

  const scriptCMP = append(fragment, 'script');
  scriptCMP.id = 'usercentrics-cmp';
  scriptCMP.dataset.settingsId = settingsId;
  scriptCMP.async = true;
  scriptCMP.src = 'https://app.usercentrics.eu/browser-ui/latest/loader.js';

  // Smart Data Protector
  const preconnect2 = append(fragment, 'link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = '//privacy-proxy.usercentrics.eu';

  const scriptProtector = append(fragment, 'script');
  scriptProtector.type = 'application/javascript';
  scriptProtector.src = 'https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js';

  head.append(fragment);
}
