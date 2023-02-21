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

  // Usercentrics Web CMP v2
  const script = document.createElement('script');
  script.id = 'usercentrics-cmp';
  script.dataset.settingsId = settingsId;
  script.src = 'https://app.usercentrics.eu/browser-ui/latest/loader.js';
  head.append(script);
}
