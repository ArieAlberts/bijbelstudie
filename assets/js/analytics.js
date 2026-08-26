/**
 * Parasja.nl - Traffic Analytics & Event Tracker
 * Lightweight, privacy-conscious analytics logger for parasja.nl
 */
(function () {
  'use strict';

  // Configurable Google Analytics / Measurement ID
  const GA_ID = window.GA_MEASUREMENT_ID || null;

  // Local storage keys for lightweight visit tracking
  const STORAGE_KEY_VISITS = 'parasja_analytics_visits';
  const STORAGE_KEY_PAGEVIEWS = 'parasja_analytics_pageviews';

  function recordLocalMetrics() {
    try {
      const now = new Date().toISOString();
      const pagePath = window.location.pathname + window.location.hash;
      const pageTitle = document.title || 'Parasja.nl';

      let totalViews = parseInt(localStorage.getItem(STORAGE_KEY_PAGEVIEWS) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEY_PAGEVIEWS, totalViews.toString());

      const pageviewData = {
        path: pagePath,
        title: pageTitle,
        referrer: document.referrer || 'direct',
        timestamp: now
      };

      let history = [];
      try {
        history = JSON.parse(localStorage.getItem(STORAGE_KEY_VISITS) || '[]');
      } catch (e) { history = []; }

      history.unshift(pageviewData);
      if (history.length > 50) history = history.slice(0, 50);

      localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(history));
    } catch (e) {
      // Silently ignore if localStorage is restricted
    }
  }

  function initGoogleAnalytics() {
    if (!window.GA_MEASUREMENT_ID) return;
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', window.GA_MEASUREMENT_ID, {
      page_path: window.location.pathname + window.location.hash,
      anonymize_ip: true
    });
  }

  recordLocalMetrics();
  initGoogleAnalytics();
})();
