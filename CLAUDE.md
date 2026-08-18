<!-- autopilot:start -->
# ELEVATE Digital Studio

Marketing site for ELEVATE, a Prague-based digital studio (websites, e-shops, branding, app dev, SEO), for CZ/EN/RU/UA visitors.

## Команды

| Команда | Что делает |
|---------|------------|
| `bun install` | Установить зависимости |
| `bun run dev` | Запустить локально (vite dev) |
| `bun run build` | Собрать продакшен-билд |
| `bun run lint` | Прогнать eslint |
| `bunx tsc --noEmit` | Проверить типы (отдельного typecheck-скрипта нет) |
| `node scripts/extract-ref-assets.mjs` | Перегенерировать чистые референс-ассеты в `src/assets/refs/` (webp + jpg) |

**Песочница без `bun`/`bunx`:** использовать бинарники напрямую — `node_modules/.bin/tsc`, `node_modules/.bin/eslint`, `node_modules/.bin/vite build`.

**`bun run lint` — тысячи `prettier/prettier`-предупреждений по всему репозиторию** — это существовавший до автопилот-редизайна технический долг форматирования, не регрессия. Не чинить его попутно в тикетах редизайна.

## Структура

- `src/components/hero/` — сцена скролл-hero: `DeviceHero.tsx` (монтируемая секция), `useHeroScroll.ts` (вся механика `scrollYProgress`), `DeviceShell.macbook.tsx`/`DeviceShell.iphone.tsx` (CSS-3D корпуса устройств, наружу пакета не экспортируются).
- `src/components/sections/` — секции страниц; `ServiceStage.tsx` — новая секция 5 услуг (заменила инлайн-блок «SERVICES» на главной), `Contact.tsx` — степпер лид-формы (4 шага), `SectionHeading.tsx` — общий заголовок секций.
- `src/components/ui/` — shadcn/radix-обёртки, не редизайнились точечно.
- `src/components/` (корень) — `Nav.tsx`, `LangProvider.tsx`, прочие общие виджеты + мёртвый код (`Hero3D.tsx`, `Hero3DCube.tsx`, см. «Подводные камни»).
- `src/lib/` — `i18n.ts` (переводы 4 языков), `pages-i18n.ts` (`usePages()`), `telegram.functions.ts`/`audit.functions.ts` (серверные функции), `projects.tsx`/`projects-i18n.ts`, `pricing.ts`.
- `src/routes/` — файловый роутинг TanStack Start; `index.tsx` — собранная главная (`DeviceHero` → `ServiceStage` → trust-секции → портфолио → `InstagramStrip` → CTA); `design.tsx`/`design-v1..v4.tsx` — временная зона exploration (см. ниже).
- `src/components/design-explore/` — **временная зона**, не часть постоянной архитектуры: витрина 4 визуальных направлений редизайна главной под `/design-v1`…`/design-v4`, удаляется целиком после того, как пользователь выберет направление. `concepts.ts` — единственный источник правды о 4 направлениях (`DESIGN_CONCEPTS`, slug/order/name/oneLiner), `ExploreSwitcher.tsx` — плавающий (fixed, не sticky) переключатель между направлениями + ссылка назад на прод-сайт, монтируется каждой `design-v*`-страницей самостоятельно (не глобально из `__root.tsx`).
- `src/assets/refs/` — семь чистых кропов из `/references` **без вшитого текста**, каждый в `webp` + `jpg`: `hero-macbook`, `hero-iphone`, `svc-web`, `svc-eshop`, `svc-app`, `svc-seo`, `svc-branding`. Генерируются только скриптом `scripts/extract-ref-assets.mjs`, руками не правятся.
- `scripts/extract-ref-assets.mjs` — пайплайн нарезки: фиксированные координаты кропа по каждому исходнику из `/references`, на выходе webp+jpg в `src/assets/refs/`.
- `src/hooks/` — `use-reveal.ts`, `use-scroll-depth.ts`, `use-mobile.tsx`.
- `src/styles.css` — дизайн-токены и utility-классы поверх Tailwind 4 `@theme inline`.

## Ключевые файлы

- `src/components/hero/DeviceHero.tsx` — вход в hero-сцену: `<DeviceHero variant="macbook"|"iphone" lang={Lang} />`, сам владеет высотой скролл-трека (220vh desktop / 170vh iphone) и sticky-стадией.
- `src/components/hero/useHeroScroll.ts` — единственное место с сырыми `useScroll`/`useTransform`; маппит один `scrollYProgress` на весь `HeroSceneStyle` (device/reflection/glow/фон/4 кадра экрана), учитывает `prefers-reduced-motion`.
- `src/components/hero/DeviceShell.macbook.tsx` / `DeviceShell.iphone.tsx` — внутренние CSS-3D корпуса, просто рендерят готовые стили из `HeroSceneStyle`, скролл-механику не знают.
- `src/components/sections/ServiceStage.tsx` — `<ServiceStage />` без пропсов, сама читает `useT()`; авто-листание 5 услуг, останавливается на hover/focus/после первого клика/при reduced-motion.
- `src/components/sections/Contact.tsx` — степпер лид-формы, `StepKey = 1|2|3|4`, шаг 2 (функции/цель) необязательный; зовёт `sendContactToTelegram` как чёрный ящик.
- `src/lib/i18n.ts` — `translations`, `useT()`, типы `Lang`/`ServiceSlug`; единственный источник 4-язычных строк сайта CZ/EN/RU/UA.
- `src/lib/pages-i18n.ts` — `usePages(lang)`, отдельный словарь для сервисных и прочих подстраниц.
- `src/routes/index.tsx` — сборка главной, монтирует `DeviceHero` + `ServiceStage`.
- `src/routes/design.tsx` — страница-указатель `/design`, карточки-ссылки на все 4 направления, читает названия/описания из `DESIGN_CONCEPTS`.
- `src/routes/design-v1.tsx` … `design-v4.tsx` — 4 самостоятельных маршрута-направления, каждый сам монтирует `ExploreSwitcher`, без прод-`Nav`/`Footer`. `design-v1.tsx` — «reference-led premium studio», единственное направление, которому по тикету разрешено переиспользовать прод `DeviceHero`/`useHeroScroll` как есть для hero-блока; остальные секции страницы — собственные, независимые от `ServiceStage`/`Contact`.

- `src/components/design-explore/RefImage.tsx` — единственная точка подключения референс-графики: `<RefImage name={RefName} alt priority? className? imgClassName? sizes? />`, рендерит `<picture>` с webp+jpg и зашитыми натуральными `width`/`height` (нет CLS), `priority` переключает eager/lazy. **Потребитель обязан задать размерные классы** (`w-full h-auto` либо `h-full w-full object-cover`), иначе `img` займёт натуральные пиксели.

## Архитектура

**Hero-сцена.** `DeviceHero` рендерит `<section>` высотой 220vh/170vh со `sticky top-0 h-screen` внутренней стадией. `useHeroScroll` берёт единственный `useScroll({ target: heroRef, offset: ["start start", "end start"] })` и через 5 стадийных точек (`STAGES = [0, 0.15, 0.55, 0.85, 1]`) маппит `scrollYProgress` в `HeroSceneStyle` (translate/rotate/scale устройства, opacity отражения/глоу/фоновых blob'ов, 4 `frameOpacities` контента экрана). `DeviceHero` сам строит массив из 4 кадров экрана: кадр 0 — лого ELEVATE, кадры 1–3 — первые 3 элемента `t.ui.serviceStage` из i18n (визуальный переход hero → услуги, не отдельный источник данных). Готовые стили просто передаются в `DeviceShellMacbook`/`DeviceShellIphone` — вся скролл-механика инкапсулирована в хуке, шелл её не знает. При `prefers-reduced-motion` хук возвращает статичный набор стилей (один кадр, без анимации).

**ServiceStage.** Локальный state (`active`/`hovered`/`interacted`) управляет и авто-таймером (`setInterval`, 5200мс), и кликом/hover/focus, которые его останавливают. Активная панель — реальный `<Link>` на маршрут из `SERVICE_ROUTES` (порядок синхронизирован вручную с `t.ui.serviceStage`, менять один без другого нельзя). Превью услуг (`WebPreview`/`SeoPreview`/…) — статичные декоративные компоненты, не связаны с реальными данными проекта.

**Contact-степпер.** Весь стейт (шаг, тип проекта, фичи/цель, бюджет, поля формы) — один локальный `useState`-набор в компоненте, шаги не вынесены в файлы. `onSubmit` собирает единственный payload для `sendContactToTelegram` (контракт функции не менялся); фичи/цель шага 2 сериализуются в конец текстового `message`, не как отдельные API-поля.

**i18n.** `src/lib/i18n.ts` — единственный источник переводов (`translations[Lang]`, читается через `useT()` из `LangProvider`); `pages-i18n.ts` — параллельный словарь только для сервисных/прочих подстраниц через `usePages(lang)`. Новые ключи добавляются сразу для всех 4 языков в `i18n.ts`; остальной код только читает.

**Референс-графика.** Исходники в `/references/` — готовые постеры с **вшитой чешской типографикой**; целиком в прод их ставить нельзя: растр захардкоживает язык (ломает i18n на 4 языка) и дублирует заголовок страницы. В продакшен-код попадают только кропы, нарезанные `scripts/extract-ref-assets.mjs` в `src/assets/refs/`, и подключаются только через `RefImage`. Имена файлов в `/references/` семантические и это их назначение: `01_HOME_DESKTOP_HERO`, `01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE`, `05_HOME_MOBILE_HERO`, `10/20/30/40/50_SERVICE_{WEB,ESHOP,APP,SEO,BRANDING}_HERO`. Пять сервисных построены вокруг маскота (парень в худи ELEVATE); решением пользователя маскот используется на сайте **везде, включая главную**. Подача — гибрид: реальное фото устройства/сцены как растр, живой DOM-интерфейс и типографика из `useT()` поверх.

**`/design` exploration-зона (временная).** `SiteShell` в `src/routes/__root.tsx` проверяет `pathname.startsWith("/design")` и для всей зоны разом отключает прод-`Nav`/`Footer`/`FloatingCta` — тот же паттерн, что уже был для `/contact` (там отдельно скрывается только `FloatingCta`). Каждая `design-v*`-страница полностью самодостаточна: сама читает `useT()`, сама монтирует `ExploreSwitcher`, ничего не берёт из `Nav.tsx`. Это explore-инструмент для выбора направления редизайна главной, не кандидат в постоянную архитектуру — весь `src/components/design-explore/` и маршруты `design*.tsx` рассчитаны на полное удаление одним заходом после решения пользователя. Четыре направления перестроены заново на реальной референс-графике: V1 «Референс оживший», V2 «Кинематографические главы», V3 «Стол студии», V4 «Аппаратная».

## Соглашения кода

- Единая easing-кривая `cubic-bezier(0.22, 1, 0.36, 1)` — не вводить альтернативные кривые в новом motion-коде (см. комментарий в `src/styles.css` рядом с `.hover-lift`).
- Дизайн-токены/утилиты живут в `src/styles.css`, не как inline magic numbers: `.shadow-ambient` (плавающие элементы), `.shadow-contact` (элементы «на поверхности»), `.surface-glass` (только nav/оверлеи, не карточки), `.heading-display`/`.heading-display-sm` (fluid `clamp()`-заголовки, вес 800), `--primary-glow-strong`.
- i18n-ключи одного назначения добавляются сразу для всех 4 языков разом в `i18n.ts`/`pages-i18n.ts` — остальной код только читает через `useT()`/`usePages()`, не заводит параллельных ключей.
- 3D/визуальные эффекты — чистый CSS (`perspective`, `transform-style: preserve-3d`, слоистые `motion.div`), никакого Three.js/WebGL/canvas в проекте.
- Референс-графика подключается только через `RefImage` из `src/assets/refs/` — не `<img src>` напрямую на файл из `/references/`, не целый постер, и не CSS-имитация фотографии там, где чистый ассет уже есть.
- Секции без пропсов сами читают `useT()`/`usePages()` внутри себя (`ServiceStage`, `Contact`) — паттерн для новых секций такого рода.

## Подводные камни

- `bun`/`bunx` недоступны в этой песочнице — использовать `node_modules/.bin/tsc|eslint|vite` напрямую (см. «Команды»).
- `bun run lint` — десятки тысяч `prettier/prettier`-ошибок по всему репозиторию (предсуществующий форматный долг, не регрессия) — не чинить попутно.
- `src/components/sections/Hero.tsx`, `Hero3D.tsx`, `Services.tsx`, `src/components/Hero3DCube.tsx` — мёртвый код, нигде не импортируется (проверено grep'ом по `src/`) — не строить на них, не удалять без отдельного запроса.
- `.grid-bg` (~20 использований, 20–30% opacity, всегда с radial-mask) осознанно оставлен как есть, не запрещён брифом — не путать с `.text-gradient`, который был удалён (жил только на числах в `Results.tsx`, generic-SaaS приём под запретом брифа).
- `src/routeTree.gen.ts`, `vite.config.ts`, всё под `src/integrations/supabase/`, `src/lib/*.functions.ts` (`telegram.functions.ts`/`audit.functions.ts`), SEO/structured data (`STRUCTURED_DATA` в `src/routes/__root.tsx`, `head()` в маршрутах, `src/routes/sitemap[.]xml.ts`) — не редактировать без прямой необходимости.
- `/references/` — исходные постеры, **целиком** в прод не попадают ни при каких обстоятельствах (вшитый чешский текст ломает четырёхъязычность и дублирует H1). Разрешён только путь «кроп через `scripts/extract-ref-assets.mjs` → `src/assets/refs/` → `RefImage`». Существовавший ранее `src/assets/hero/macbook-photo.jpg` содержал весь референс вместе с текстом — это был реальный баг, из-за него на `/design-v1` дублировался заголовок.
- Внутри сервисных сцен на изображённых экранах вшиты **выдуманные метрики** (+220% / +180% / +150%, «+2 482 users», «2 499 Kč») и чужой товарный знак (Nike на витрине e-shop). `PRODUCT.md` принцип 5 запрещает выдуманные метрики. Кропы намеренно перекадрированы на маскота, в DOM эти цифры не выносятся — но **до продакшена рендеры надо перерисовать**.
- Нет тестового раннера (`vitest`/`jest`) — «зелёный набор» это `tsc --noEmit` + `eslint` + `vite build` + ручной просмотр.
- `google-chrome --headless=new --screenshot --window-size=W,H` на этой машине ненадёжен для узких (~390px, mobile) ширин — реально отдаёт то ~500px, то ~980px вместо запрошенной, PNG обрезается, а не масштабируется. Для мобильных скриншотов нужен CDP: `--remote-debugging-port` + `Emulation.setDeviceMetricsOverride` через WebSocket (`require('ws')` уже доступен как транзитивная зависимость в `node_modules`, ставить не нужно). Для десктопных ширин (≥1024px) `--window-size` работает точно — использовать его, не CDP: на десктопной ширине CDP-эмуляция специфически ломает scroll-driven макбук-сцену `DeviceHero`/`useHeroScroll` — зависает в промежуточном кадре анимации. Ещё два факта про headless-съёмку:
  - `--force-prefers-reduced-motion` **обязателен**, иначе кадр снимается на загрузочном экране приложения и выходит пустым;
  - полностраничный CDP-захват с `captureBeyondViewport: true` **не триггерит lazy-загрузку** картинок ниже сгиба — они выходят пустыми прямоугольниками и выглядят как баг вёрстки. Чтобы проверить такие секции, нужен реальный `window.scrollTo` + пауза, а не полностраничный кадр.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
