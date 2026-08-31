/**
 * Winter Arc 2026 Funnel Analytics Helper
 * Tracks conversion funnel events locally and logs to console / Vercel Analytics if present.
 */

export const ANALYTICS_EVENTS = {
  CONTRACT_BUILDER_STARTED: 'contract_builder_started',
  CONTRACT_GENERATED: 'contract_generated',
  CONTRACT_SHARED: 'contract_shared',
  CONTRACT_DOWNLOADED: 'contract_downloaded',
  UPGRADE_CLICKED: 'upgrade_clicked',
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  CHECKOUT_STARTED: 'checkout_started',
  PURCHASE_COMPLETED: 'purchase_completed'
};

export function trackEvent(eventName, payload = {}) {
  try {
    const timestamp = new Date().toISOString();
    const eventData = {
      event: eventName,
      timestamp,
      payload
    };

    // Log to console for development visibility
    console.log(`[Analytics Event] ${eventName}`, eventData);

    // Save to localStorage history safely
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('winter_arc_analytics');
        let existing = [];
        if (raw) {
          try {
            existing = JSON.parse(raw);
          } catch (e) {
            existing = [];
          }
        }
        if (!Array.isArray(existing)) existing = [];
        existing.push(eventData);
        localStorage.setItem('winter_arc_analytics', JSON.stringify(existing.slice(-100)));
      } catch (storageErr) {
        // Silently ignore private browsing or storage quota errors
      }
    }

    // Call window.va if Vercel Analytics is present
    if (typeof window !== 'undefined' && window.va) {
      try {
        window.va('event', { name: eventName, data: payload });
      } catch (e) {}
    }
  } catch (err) {
    // Never let analytics error crash the app
    console.warn('Analytics tracking error:', err);
  }
}
