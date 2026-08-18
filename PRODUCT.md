# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are small-to-mid-sized businesses across the Czech Republic and wider Central/Eastern Europe (clinics, real estate, beauty, automotive, retail, and other local service industries) whose owner or marketing lead makes the buying decision directly. They are typically outgrowing a DIY, template, or outdated site and want a conversion-focused rebuild delivered by a small, senior team rather than a large agency or freelance marketplace. The site itself serves a multilingual audience: Czech, English, Russian, and Ukrainian speakers.

## Product Purpose

ELEVATE is a Prague-based digital studio that builds complete digital presences for local businesses — websites, e-commerce stores, branding/visual identity, application development, and SEO/digital optimization — delivered as one coherent experience by a single in-house team. Success means measurable business results for the client (leads, sales, brand credibility), not visual polish alone.

## Positioning

ELEVATE is not a website vendor. It combines premium custom visual design, web/e-commerce development, application development, SEO and digital optimization, and branding into one unified studio offering. The differentiator is the combination itself — high-end visual execution, interactive experience quality, technical engineering quality, and business-outcome focus — delivered end-to-end by one in-house team, without handoffs between separate design, dev, and marketing vendors. The studio also deliberately works with a limited number of clients at a time to sustain individual, non-templated attention.

## Operating Context

- Client-facing marketing site with per-service and per-service-pricing pages (web, e-shop, branding, design), a portfolio of real case studies, and a contact flow built around a 24-hour reply commitment.
- Fully localized in four languages (CZ/EN/RU/UA) via `src/lib/i18n.ts` and `src/lib/pages-i18n.ts`; language choice persists client-side.
- Built with TanStack Start/Router, React 19, Tailwind CSS 4, and shadcn/radix UI primitives; deployed on Cloudflare (`wrangler.jsonc`, `@cloudflare/vite-plugin`).

## Capabilities and Constraints

- Priced, page-level services today: web design (from 10,000 CZK), e-shop/e-commerce (from 25,000 CZK), branding & logo (from 5,000 CZK), and graphic design.
- Positioning also claims application development and SEO/digital optimization as studio capabilities; these do not yet have dedicated service or pricing pages in code — confirm scope before building pages for them rather than assuming parity with the four priced services.
- Real project evidence exists for four live client sites (see Evidence on Hand); no client testimonials, reviews, or logos exist yet.

## Brand Commitments

- Name: ELEVATE (elevateit.cz), a Prague-based digital studio.
- Voice: confident and results-focused; avoids generic, templated agency claims.
- The current visual system (colors, type, components) is not yet documented in DESIGN.md — treat the existing implementation as incumbent authority pending `/impeccable document`.

## Evidence on Hand

- Four real, live client case studies with real domains: Biodent Clinic (biodentclinic.cz, Web), N Home Praha (inhomepraha.cz, Web), Exclusive Beauty (exclusivebeauty.cz, E-shop), EuroMotors (euromotors.cz, Web). Live screenshots are pulled dynamically (WordPress mshots) rather than stored as static images.
- No testimonials, client quotes, review scores, or client logos exist. Do not fabricate any of these, and do not invent result percentages or metrics beyond what is already recorded in `src/lib/i18n.ts` / `src/lib/projects-i18n.ts`.
- Stated trust stats already in copy: 4+ years experience, 50+ projects delivered, 12+ industries served, 24h average response time.

## Product Principles

1. One unified team, not a handoff chain — every deliverable (visual, code, copy) is owned end-to-end by ELEVATE.
2. Design in service of measurable outcomes — conversions and business results, not aesthetics alone.
3. Individual, non-templated treatment for a deliberately limited client roster.
4. Multilingual by default — CZ/EN/RU/UA parity is a product requirement, not an afterthought.
5. Evidence-only proof — never fabricate testimonials, logos, or metrics; only the real case studies on hand stand as proof until genuine ones exist.
