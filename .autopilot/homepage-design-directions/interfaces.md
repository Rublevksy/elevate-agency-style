# Interfaces — homepage-design-directions

## Проектные правила (для каждого субагента)

- Стек: TanStack Start / React 19 / TypeScript / Tailwind CSS 4 (`@theme inline` в `src/styles.css`) / Framer Motion (`framer-motion` уже в зависимостях) / lucide-react для иконок (не unicode/emoji — см. `craft-floor.md` Refuse). Пакетный менеджер — `bun`, но в этой песочнице `bun`/`bunx` недоступны: использовать `node_modules/.bin/tsc`, `node_modules/.bin/eslint`, `node_modules/.bin/vite` напрямую.
- Команды: `node_modules/.bin/vite dev` (запуск), `node_modules/.bin/tsc --noEmit` (типы), `node_modules/.bin/eslint <файлы>` (линт, scoped — не гонять на весь репо, там тысячи предсуществующих prettier-предупреждений, не регрессия), `node_modules/.bin/vite build` (сборка).
- **Не трогать:** `src/integrations/supabase/**`, `src/lib/telegram.functions.ts`, `src/lib/audit.functions.ts`, SEO/structured data (`STRUCTURED_DATA` и `head()` в `src/routes/__root.tsx` — можно трогать только тело `SiteShell`, не `head()`/`RootShell`), `src/routes/sitemap[.]xml.ts`, `/references/` (только читать), `src/routes/index.tsx` (продакшен-главная — не редактируется вообще этой сборкой), production-секции (`ServiceStage.tsx`, `Contact.tsx`, `Nav.tsx`, `Footer.tsx`) — не импортировать их напрямую в design-v* страницы, при необходимости брать вдохновение композицией, не кодом.
- Незакоммиченные правки `src/components/hero/DeviceShell.macbook.tsx`, `src/components/hero/useHeroScroll.ts` и новые `src/assets/hero/*`, `src/components/hero/ScreenMockup.tsx` — не трогать, не завершать, не откатывать. Ticket 02 (V1) вправе **импортировать и использовать как есть** `DeviceHero`/`useHeroScroll` (реюз, не правка).
- Единая easing-кривая проекта — `cubic-bezier(0.22, 1, 0.36, 1)` — использовать её же в новом motion-коде всех V, не вводить альтернативные кривые (кроме V2/V4, где по спецификации явно нужен другой темп — см. тикет).
- Все тексты — через `useT()` из `@/lib/i18n` (`t.hero`, `t.ui.serviceStage`, `t.trust`, `t.results`, `t.ui.cta*` и т.д.). Не выдумывать новые цифры/отзывы/клиентов. Логотип — существующий `<Logo />` из `@/components/Logo`, не переизобретать.
- Каждый маршрут `/design-v{N}` обязан быть самостоятельно открываемым напрямую по URL (не только через `/design`), адаптивным (минимум `sm`/`md` брейкпоинты на hero и на секции услуг), и уважать `prefers-reduced-motion` через `useReducedMotion()` из `framer-motion` (глобальный CSS-фолбэк в `styles.css` уже покрывает CSS-анимации сайтвайд — JS-driven `useTransform`/`useScroll` сцены всё равно нужно гейтить в коде, как это уже сделано в `useHeroScroll.ts`/`ServiceStage.tsx`).
- Отсутствующий инструмент/зависимость → тикет возвращается `BLOCKED` с точным именем недостающего, не устанавливается самовольно.

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `src/routes/__root.tsx` → `SiteShell` (правка) | решение, показывать ли прод-шелл (Nav/Footer/попапы) на текущем пути | ничего нового наружу — это точка ветвления, не API | остаётся точкой правды «что есть прод-шелл» |
| `src/components/design-explore/concepts.ts` | список 4 направлений: slug, порядок, имя, одна строка сути | `DESIGN_CONCEPTS: DesignConcept[]` (readonly массив) | ничего — намеренно плоские данные, не логика |
| `src/components/design-explore/ExploreSwitcher.tsx` | вёрстку и поведение переключателя | `<ExploreSwitcher active={slug} />` | принцип позиционирования (fixed) от вызывающих страниц |
| `src/routes/design.tsx` | страницу-указатель `/design` | маршрут, ничего программного | — |
| `src/routes/design-v{1..4}.tsx` (каждый) | всю разметку/стили/motion своего направления | маршрут `/design-vN`, ничего программного наружу | внутреннюю структуру секций — соседние V-маршруты друг о друге не знают и не переиспользуют части друг друга |

## Швы для проверки

- HTTP: каждый из 5 новых маршрутов отдаёт 200 и ожидаемую разметку (`curl` на dev-сервер).
- `git diff --stat` на `src/routes/__root.tsx` и `src/routes/index.tsx` — первый короткий и читаемый (path-guard, несколько строк), второй **пустой**.
- Unit-тестов нет и не заводится (в проекте нет test runner'а — не меняется этой сборкой).

## Из тикета 01 — изоляция и переключатель (готово)

- `src/routes/__root.tsx` → `SiteShell`: `const isDesignExplore = pathname.startsWith("/design")` гейтит `Nav`, `Footer`, `FloatingCta`, `ContactWidget`, `ExitIntentModal`, `CookieBanner`. `TopProgressBar`/`PageLoader` не гейтятся (нейтральны). Диф — ~10 строк, `src/routes/index.tsx` не тронут (проверено `git diff --stat` — пусто).
- `@/components/design-explore/concepts.ts` — `export interface DesignConcept { slug: "design-v1"|"design-v2"|"design-v3"|"design-v4"; order: 1|2|3|4; name: string; oneLiner: string }` и `export const DESIGN_CONCEPTS: readonly DesignConcept[]` — 4 записи, уже с финальными `name`/`oneLiner` для V1–V4. Дальше не менять без причины — `/design` и `ExploreSwitcher` оба на нём завязаны.
- `@/components/design-explore/ExploreSwitcher.tsx` — `<ExploreSwitcher active={DesignConcept["slug"]} />`. Fixed-бар сверху по центру (`fixed left-1/2 top-4 z-[100] -translate-x-1/2`), активное направление — `<span aria-current="page">`, остальные — `<a href="/design-vN">` (**не** типизированный `<Link>` — маршруты `/design-v1..v4` в ticket 01 ещё не существуют, поэтому обычные `<a>`; после тикетов 02–05 можно, но не обязательно, заменить на `<Link>`). `<Link to="/">← ELEVATE.CZ</Link>` — TanStack `Link`, этот маршрут уже существует. Каждая V-страница монтирует `<ExploreSwitcher active="design-vN" />` сама — компонент не рендерится глобально.
- `src/routes/design.tsx` — `/design` указатель, `noindex,nofollow` в `head()`, чёрный фон, `<Logo/>`, карточки-ссылки (`<a>`, тем же резоном) на все 4 из `DESIGN_CONCEPTS`.
- Известный, не относящийся к этому тикету факт: `node_modules/.bin/tsc --noEmit` сейчас красный — **одна** ошибка, `src/components/hero/DeviceShell.macbook.tsx(87,26): Cannot find name 'ScreenMockup'** — это предсуществующая незакоммиченная правка hero (R62i, не часть этой сборки), не появилась из-за тикета 01. Но так как `DeviceHero` (который эту цепочку импортирует) переиспользуется в тикете 02, тикет 02 получит эту же ошибку транзитивно — исполнителю тикета 02 нужно будет либо добавить недостающий `import { ScreenMockup } from "./ScreenMockup"` в `DeviceShell.macbook.tsx` (однострочный, безопасный фикс существующего файла — не «правка hero-фичи», а починка забытого импорта), либо явно вернуть `BLOCKED`/`CONCERNS` с этим фактом. Решение — за тикетом 02, не изобретать заново здесь.

## Из тикета 02 — /design-v1 (готово)

- `src/routes/design-v1.tsx` — реюзает `DeviceHero`/`useHeroScroll` как есть (`variant="macbook"`/`"iphone"` через `hidden md:block`/`md:hidden`, тот же паттерн что в `index.tsx`), поверх — абсолютный текстовый оверлей (kicker+h1+subtitle+2 CTA) из `t.hero.*`. Услуги — свой `ServiceShowcase` (табы слева + `ScreenMockup` справа, `role="tablist"/"tab"/"tabpanel"`, auto-advance 5200мс с паузой на hover/focus). Доказательный блок — `t.results.items` одной строкой текста. Побочный фикс: `DeviceShell.macbook.tsx` теперь импортирует `ScreenMockup` (был забытый импорт в предсуществующей WIP-правке — типизация была красной до этого фикса).
- **Важно для тикетов 03 (в процессе)/05:** предсуществующая ошибка `tsc` (`ScreenMockup is not defined` в `DeviceShell.macbook.tsx`) **исправлена** этим тикетом — если у вас в контексте была инструкция про неё, она больше не актуальна, проект дальше типизируется чисто на файлах, которые не трогают ваш собственный маршрут.

## Из тикета 04 — /design-v3 (готово)

- `src/routes/design-v3.tsx` — самодостаточный, свой `head()` подключает Space Grotesk. Общий `BrowserChrome` (окно с точками) переиспользуется и для интерактивного showcase, и для proof-блока — оба «режима одного продукта». `SCENES = [WebScene, SeoScene, EshopScene, BrandScene, AppScene]` — 5 разных сцен на 5 услуг, переключаемых кликом/hover по табам (`role="tablist"`), `AnimatePresence` меняет всю сцену. Proof — `StatReadout` с live count-up (`requestAnimationFrame`, гейтится `reducedMotion`) + sparkline `<svg>`. Ничего не экспортирует наружу — не переиспользуется другими V.

## Из тикета 03 — /design-v2 (готово)

- `src/routes/design-v2.tsx` — самодостаточный, свой `head()` подключает `Newsreader` (serif). Никакого устройства/3D в hero — serif-заголовок + одна атмосферная «figure plate» панель (`.grid-bg` + одна линия-акцент, подпись «Fig. 01 — Praha» декоративная, не бизнес-факт). Секция услуг — на десктопе честный scroll-synced sticky-разворот (`useScroll`/`useTransform`/`useMotionValueEvent`, высота секции `items.length * 100vh`, левый rail — реальные якорные ссылки `#v2-service-N`), на мобильном и при `prefers-reduced-motion` — линеаризованный вертикальный поток (отдельные `<section>`, не сжатие того же layout). Proof — quote-разворот крупной serif-типографикой на `t.results`, без карточек.

## Из тикета 05 — /design-v4 (готово)

- `src/routes/design-v4.tsx` — самодостаточный, свой `head()` подключает `Syne` + `Space Mono`. Hero — асимметричная 12-колоночная сетка (title `md:col-span-7`, console `md:col-span-5 md:col-start-8 md:mt-16`, намеренно НЕ зеркальные половины). Услуги — `grid-template-rows repeat(3, minmax(8rem,1fr))` + явные `grid-column`/`grid-row` на каждой панели (одна крупная `1/4` × `1/4`, четыре разных мелких) — не равномерная сетка. Скролл-сканер (`useScroll`/`useTransform`) + курсор-параллакс наклон (`useMotionValue`/`useSpring`) на каждой панели, оба гейтятся `useReducedMotion()`. Доказательный блок — `BuildLog`, строки `[OK] <label> <value>`, моно. `SIGNAL = oklch(0.80 0.14 205)` — локальный второй технический тон, не новый глобальный токен.

## Общий тип DESIGN_CONCEPTS (справочно — реализовано ровно так, см. выше)
