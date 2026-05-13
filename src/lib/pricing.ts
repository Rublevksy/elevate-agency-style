// Compatibility re-exports — all pricing data lives in pages-i18n.ts now.
// Use `usePages(lang).pricingPages` directly in new code.
export type { PricingSlug, PricingPage } from "./pages-i18n";
import { PAGES } from "./pages-i18n";
import type { Lang } from "./i18n";

export function getPricingPages(lang: Lang) {
  return PAGES[lang].pricingPages;
}

export function getPricingList(lang: Lang) {
  const p = PAGES[lang].pricingPages;
  return [p.web, p.eshop, p.branding];
}
