/**
 * Analytics scaffold — GA4 + Microsoft Clarity ready.
 *
 * Activates only when env IDs are set at build time:
 *   VITE_GA4_ID      e.g. "G-XXXXXXXXXX"
 *   VITE_CLARITY_ID  e.g. "abcd1234"
 *
 * Until then, `track()` is a no-op (besides debug log in dev).
 * All CTA / form / scroll events are funneled through `track()` so when
 * the IDs land, no component-level changes are needed.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

// Public GA4 Measurement ID — safe to embed (it's a publishable identifier).
// Override per-env via VITE_GA4_ID if needed.
const GA4_ID = ((import.meta.env.VITE_GA4_ID as string | undefined)?.trim()) || "G-TVD3K5G5GF";
const CLARITY_ID = ((import.meta.env.VITE_CLARITY_ID as string | undefined)?.trim()) || "wuhmbie592";

let initialized = false;
let consentGranted = false;

function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("elevate-cookies") === "accept";
  } catch {
    return false;
  }
}

function injectGA4(id: string) {
  if (document.querySelector(`script[data-ga4="${id}"]`)) return;
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s1.dataset.ga4 = id;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.dataset.ga4Init = "true";
  s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted'});gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,send_page_view:false});`;
  document.head.appendChild(s2);
}

function injectClarity(id: string) {
  if (document.querySelector(`script[data-clarity="${id}"]`)) return;
  const s = document.createElement("script");
  s.dataset.clarity = id;
  s.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${id}");`;
  document.head.appendChild(s);
}

/** Call once on app boot. Safe to call repeatedly. */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  initialized = true;
  consentGranted = hasCookieConsent();
  if (!consentGranted) return;
  if (GA4_ID) injectGA4(GA4_ID);
  if (CLARITY_ID) injectClarity(CLARITY_ID);
}

/** Called by CookieBanner after the user accepts. */
export function grantAnalyticsConsent() {
  if (typeof window === "undefined") return;
  consentGranted = true;
  if (GA4_ID) injectGA4(GA4_ID);
  if (CLARITY_ID) injectClarity(CLARITY_ID);
  // Fire pageview for the current page now that consent is granted.
  try {
    trackPageView(window.location.pathname + window.location.search, document.title);
  } catch {/* ignore */}
}

/** Track an event. Funnels to GA4 + Clarity + dataLayer. No-op without IDs. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Always feed dataLayer — useful for future GTM and for debugging.
  (window.dataLayer = window.dataLayer || []).push({ event, ...params });
  if (!consentGranted) return;
  try {
    if (window.gtag) window.gtag("event", event, params);
    if (window.clarity) window.clarity("event", event);
  } catch {
    /* ignore */
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}

/** Track route changes as virtual pageviews. */
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined") return;
  (window.dataLayer = window.dataLayer || []).push({
    event: "page_view",
    page_path: path,
    page_title: title,
  });
  if (!consentGranted) return;
  if (GA4_ID && window.gtag) {
    window.gtag("event", "page_view", { page_path: path, page_title: title });
  }
}

/** Common named events — keeps event names consistent across the app. */
export const Events = {
  ctaClick: (label: string, location: string) =>
    track("cta_click", { cta_label: label, cta_location: location }),
  auditCtaClick: (location: string) =>
    track("audit_cta_click", { cta_location: location }),
  consultationCtaClick: (location: string) =>
    track("consultation_cta_click", { cta_location: location }),
  formStart: (form: string) => track("form_start", { form_name: form }),
  formSubmit: (form: string, ok: boolean) =>
    track("form_submit", { form_name: form, ok }),
  scrollDepth: (percent: number) => track("scroll_depth", { percent }),
};
