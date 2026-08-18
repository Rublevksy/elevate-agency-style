# Interfaces — reference-led-directions

## Общие правила проекта

- Стек: TanStack Start / React 19 / TypeScript / Tailwind 4 (`@theme inline` в `src/styles.css`) / Framer Motion / lucide-react (иконки только отсюда или authored SVG — не emoji/unicode).
- `bun`/`bunx` недоступны. Команды: `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/eslint <файлы>` (scoped!), `node_modules/.bin/vite build`, `node_modules/.bin/vite dev`.
- Тест-раннера нет. «Зелёный прогон» = `tsc --noEmit` чистый.
- **Не трогать:** `src/routes/index.tsx`, `PRODUCT.md`, `head()`/`RootShell` в `src/routes/__root.tsx`, `src/integrations/supabase/**`, `src/lib/telegram.functions.ts`, `src/lib/audit.functions.ts`, `src/routes/sitemap[.]xml.ts`, прод-секции (`ServiceStage.tsx`, `Contact.tsx`, `Nav.tsx`, `Footer.tsx`) — не импортировать. Ничего не удалять, git не сбрасывать.
- Весь текст — через `useT()` из `@/lib/i18n`. Ничего не выдумывать (ни цифр, ни клиентов, ни отзывов). Логотип — `@/components/Logo`.
- Единая easing проекта — `cubic-bezier(0.22, 1, 0.36, 1)`; другой темп допустим там, где направление явно этого требует (V2 кино-переходы, V4 сканер).
- `prefers-reduced-motion` обязателен: JS-сцены гейтить `useReducedMotion()` из framer-motion (глобальный CSS-фолбэк в `styles.css` покрывает только CSS-анимации).
- Не хватает зависимости → `STATUS: BLOCKED`, не устанавливать самовольно.

## Готовая инфраструктура (из прошлого прогона, переиспользовать как есть)

- **Изоляция**: `SiteShell` в `src/routes/__root.tsx` уже гейтит `Nav`/`Footer`/`FloatingCta`/`ContactWidget`/`ExitIntentModal`/`CookieBanner` по `pathname.startsWith("/design")`. Ничего доделывать не нужно.
- **`@/components/design-explore/concepts.ts`** — `DesignConcept { slug: "design-v1"|..|"design-v4"; order: 1|2|3|4; name: string; oneLiner: string }`, `DESIGN_CONCEPTS: readonly DesignConcept[]`.
- **`@/components/design-explore/ExploreSwitcher.tsx`** — `<ExploreSwitcher active="design-vN" />`. Fixed-бар сверху по центру, переносится на 2 строки на узких экранах. Каждая V-страница монтирует его сама.
- **`src/routes/design.tsx`** — страница-указатель `/design`.
- ⚠️ У V1 hero-оверлей должен начинаться ниже `pt-24` на мобильном — на узких экранах свитчер занимает две строки (это уже учтено в текущем `design-v1.tsx`, при перезаписи не потерять).

## Референс-ассеты (готовы, `src/assets/refs/`)

Нарезаны `scripts/extract-ref-assets.mjs` из `/references`, **без вшитого текста**, `webp` + `jpg`:

| Имя | Что | Пропорции (ш×в, источник) |
|---|---|---|
| `hero-macbook` | MacBook на плите, дуга, волны | 876×830 → 1200w |
| `hero-iphone` | iPhone на камне, световые нити | 386×483 → 700w |
| `svc-web` | Маскот, телефон + ноутбук | 606×1010 → 820w |
| `svc-eshop` | Маскот, витрина e-shop | 648×1010 → 820w |
| `svc-app` | Маскот, телефон + иконки сторов | 644×1010 → 820w |
| `svc-seo` | Маскот, монитор с графиком | 654×784 → 820w |
| `svc-branding` | Маскот, монитор с макетом | 634×1010 → 820w |

Порядок услуг в `t.ui.serviceStage`: **[0] Weby, [1] SEO, [2] E-shopy, [3] Design/Branding, [4] Aplikace** → соответствующие ассеты: `svc-web`, `svc-seo`, `svc-eshop`, `svc-branding`, `svc-app`.

Правила подачи: реальная картинка вместо CSS-имитации; текст только в DOM; `<picture>` с webp+jpg; `loading="lazy"` ниже первого экрана; заданные `aspect-ratio`/размеры (иначе CLS); тёмный край сводится маской/градиентом, а не резаным швом.

## Из тикета 01 (готово)

- **`@/components/design-explore/RefImage.tsx`**
  - `export type RefName = "hero-macbook" | "hero-iphone" | "svc-web" | "svc-eshop" | "svc-app" | "svc-seo" | "svc-branding"`
  - `export interface RefImageProps { name: RefName; alt: string; className?: string; imgClassName?: string; priority?: boolean; sizes?: string }`
  - `export function RefImage(props: RefImageProps): JSX.Element` (также default-экспорт)
  - Рендерит `<picture className={className}><source type="image/webp" srcSet sizes/><img src={jpg} width height sizes decoding="async" loading={priority?"eager":"lazy"} fetchPriority={priority?"high":undefined} className={imgClassName}/></picture>`.
  - `width`/`height` — натуральные размеры файлов, зашиты в компонент (проверены по файлам): hero-macbook 1200×1137, hero-iphone 700×876, svc-web 820×1367, svc-eshop 820×1278, svc-app 820×1286, svc-seo 820×983, svc-branding 820×1306. Рендер-размер переопределяется сверху через `className`/`imgClassName` (например `w-full h-auto` или `h-full w-full object-cover`).
  - Все 14 ассетов импортированы статически — путей строками в рантайме нет.
- **`concepts.ts`** — `oneLiner` и `name` четырёх направлений обновлены под новые тезисы; `slug`/`order`/структура интерфейса не менялись.
