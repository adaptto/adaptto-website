// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { decorateConsentManagement } from './utils/usercentrics.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
decorateConsentManagement(document.head);
