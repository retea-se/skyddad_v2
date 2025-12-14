/**
 * Cookie Consent Handler
 * GDPR-compliant cookie consent management
 */

(function() {
  'use strict';

  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;
  const STORAGE_KEY = 'cookie_consent_timestamp';

  /**
   * Set cookie
   */
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${location.protocol === 'https:' ? ';Secure' : ''}`;
  }

  /**
   * Get cookie
   */
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * Check if consent was given
   */
  function hasConsent() {
    return getCookie(COOKIE_NAME) !== null;
  }

  /**
   * Check if consent needs to be shown again (after 12 months)
   */
  function shouldShowConsent() {
    if (hasConsent()) {
      const timestamp = localStorage.getItem(STORAGE_KEY);
      if (timestamp) {
        const consentDate = new Date(parseInt(timestamp, 10));
        const now = new Date();
        const monthsDiff = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsDiff >= 12; // Show again after 12 months
      }
    }
    return !hasConsent();
  }

  /**
   * Save consent
   */
  function saveConsent(level) {
    setCookie(COOKIE_NAME, level, COOKIE_EXPIRY_DAYS);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    localStorage.setItem('cookie_consent_level', level);

    // Hide banner
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.style.display = 'none';
    }

    // Initialize analytics if accepted
    if (level === 'all') {
      // Analytics initialization would go here
      console.info('Analytics enabled (if configured)');
    }
  }

  /**
   * Initialize cookie consent
   */
  function init() {
    const banner = document.getElementById('cookie-consent');
    if (!banner) return;

    // Show banner if needed
    if (shouldShowConsent()) {
      banner.style.display = 'block';
    }

    // Button handlers
    const necessaryBtn = document.getElementById('cookie-consent-necessary');
    const acceptBtn = document.getElementById('cookie-consent-accept');

    if (necessaryBtn) {
      necessaryBtn.addEventListener('click', function() {
        saveConsent('necessary');
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        saveConsent('all');
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.cookieConsent = {
    hasConsent: hasConsent,
    getLevel: function() {
      return localStorage.getItem('cookie_consent_level') || 'necessary';
    }
  };
})();




