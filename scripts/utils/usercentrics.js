import { append } from './dom.js';

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
  const scriptCMP = append(fragment, 'script');
  scriptCMP.id = 'usercentrics-cmp';
  scriptCMP.dataset.settingsId = settingsId;
  scriptCMP.async = true;
  scriptCMP.src = 'https://app.usercentrics.eu/browser-ui/latest/loader.js';

  // Smart Data Protector
  const scriptProtector = append(fragment, 'script');
  scriptProtector.type = 'application/javascript';
  scriptProtector.src = 'https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js';

  head.append(fragment);
}
