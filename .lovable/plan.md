# Plán implementace

Rozsah je velký (30+ úkolů). Rozdělím to do logických bloků a aplikuji v jednom průchodu, ale chci nejprve potvrzení – některé úkoly bych řešil pragmatičtěji než doslovně.

## Část 1 — Jazyk (kritické)

Stávající i18n infrastruktura **už existuje a je technicky správná**: `src/lib/i18n.ts` má kompletní překlady ve 4 jazycích, `LangProvider` používá React Context + `useState` + localStorage. Všechny komponenty volají `useT()`. setState v contextu re-renderuje konzumenty.

**Plán:** Místo přepisování od nuly (zahodil bych 825 řádků překladů) ověřím přímo v prohlížeči, kde je skutečný defekt. Pravděpodobné příčiny:
- `useReveal` hook může cachovat `is-visible` na DOM elementech a blokovat re-render textu uvnitř,
- nebo některé komponenty mají hardcoded řetězce mimo `t.*`.

Opravím konkrétní příčinu, ne celý systém. Pokud trváš na novém `src/i18n/translations.ts` s flat keys (`nav_services` atd.), znamená to přepsat **všechny** komponenty, sekce a routes – cca půl dne práce a 100% riziko regresí. Nedoporučuji.

## Část 2 — Routing blank pages

- Hlavní pages mají `key={pathname}` na `<main>` (už je tam) a `useReveal` re-init (už opraveno).
- Přidám 600ms safety fallback pro `.reveal` prvky (pokud chybí), ověřím že `/services` a `/projects` se renderují i bez F5.
- TanStack Router – `<Route path="*">` syntaxe z React Routeru NEPLATÍ. Catch-all 404 už řeší `notFoundComponent` v `__root.tsx`.

## Část 3 — Nové revenue features

- **3A Exit-intent popup** – nová komponenta `ExitIntentModal`, mountována v `__root.tsx`, sessionStorage flag, jen desktop (mobile nemá `mouseleave` nahoru).
- **3B Urgency badge** – nová komponenta `CapacityBadge` s dynamickým měsícem, vložím na `/contact` a `/pricing/*`.
- **3C Detailní 4krokový proces** – upravím `Process` sekci pro `/services/web`, `/services/eshop`, `/services/branding` (texty z promptu).
- **3D FAQ sekce** – `Faq` už existuje. Přidám ji na `/pricing/web`, `/pricing/eshop`, `/services` s otázkami z promptu (4 jazyky).
- **3E Tech stack badges** – nová `TechStack` sekce na home mezi Services a Portfolio.
- **3F WhatsApp widget** – fixed FAB vpravo dole, nad existující CTA. Použiju placeholder `+420000000000`.
- **3G Case study Výzva→Řešení→Výsledek** – přidám sekci do `projects/$slug` (data v `lib/projects.tsx`).

## Část 4 — Polish

- 4A fade-in už je (`animate-fade-in` na `<main key={pathname}>`).
- 4B aktivní nav link už funguje (`activeProps`), zvýrazním víc.
- 4C `<html lang>` – `LangProvider` už nastavuje `documentElement.lang`. Přidám meta description per-language přes head().
- 4D 404 page – už existuje `NotFoundComponent`, přidám překlad a hlavičku/patičku.
- 4E Cookie banner – nová komponenta `CookieBanner` v `__root.tsx`, localStorage.
- 4F Smooth scroll – přidám `scroll-behavior: smooth` do CSS.
- 4G OG image – stáhnu R2 URL do `public/og-image.png`.

## Část 5 — Existing fixes (většinou už hotovo)

- 5A duplicate stats /about – zkontroluji.
- 5B `N◆PaCORVEX` – už opraveno minule.
- 5C `/services/design` – stránka existuje, nechám.
- 5D testimonials – už odstraněno minule.
- 5E form validation + toast – `Contact` už má validaci a toast, ověřím červené zvýraznění.

## Otázky před spuštěním

1. **Jazyk:** Můžu opravit konkrétní bug místo přepisu celé i18n architektury? (Ušetří cca 80% práce, žádné regrese.)
2. **WhatsApp číslo:** Použít placeholder `+420 000 000 000`, nebo máš reálné?
3. **Rozsah teď:** Mám projít všech 30+ úkolů v jednom průchodu (riziko regresí), nebo prioritizovat jazyk + routing + 3A/3B/3F/4E (rychlé win) a zbytek v dalším kole?
