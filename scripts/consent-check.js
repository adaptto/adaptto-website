/**
 * Consent check based on Usercentrics Consent Management.
 *
 * Follows the structure of the aem-boilerplate (consent-check.js + consented.js), but instead of
 * the boilerplate's dummy implementation the Usercentrics CMP (see utils/usercentrics.js) is used:
 * - The Usercentrics CMP script is loaded immediately if the user already interacted with it
 *   (consent decision stored in local storage), otherwise delayed by 3 seconds to not impact
 *   page performance.
 * - Blocks embedding 3rd party services (YouTube, Google Maps, HubSpot, pretix) check consent
 *   per service via `decorateWithConsent` in utils/usercentrics.js.
 * - Scripts requiring general consent (analytics, martech, etc.) go to consented.js, which is
 *   only loaded once the user accepted all services.
 * - On every consent change a `consent.update` event is dispatched on window
 *   with `detail.consented` (boolean).
 */
import { decorateConsentManagement } from './utils/usercentrics.js';

const CMP_LOAD_DELAY_MS = 3000;

let consentedLoaded = false;

/**
 * @returns {boolean} true if the user has given consent to all services
 */
function hasConsent() {
  return !!window.UC_UI?.areAllConsentsAccepted?.();
}

/**
 * Loads consented scripts once consent is available.
 */
function loadConsented() {
  if (consentedLoaded) return;
  consentedLoaded = true;
  import('./consented.js');
}

/**
 * Notifies listeners of the current consent state and loads consented
 * scripts if consent has been granted.
 */
function onConsentUpdate() {
  const consented = hasConsent();
  window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented } }));
  if (consented) {
    loadConsented();
  }
}

window.addEventListener('UC_UI_INITIALIZED', onConsentUpdate);
window.addEventListener('UC_UI_CMP_EVENT', onConsentUpdate);

if (localStorage.uc_user_interaction) {
  decorateConsentManagement(document.head);
} else {
  window.setTimeout(() => decorateConsentManagement(document.head), CMP_LOAD_DELAY_MS);
}
