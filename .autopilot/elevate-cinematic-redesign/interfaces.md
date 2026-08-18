# Interfaces — ELEVATE cinematic redesign

## Стек и версии (проект уже существует — не переизобретать)

- React 19, TanStack Start/Router 1.16x, Vite 7, Tailwind CSS 4 (`@theme inline` в `src/styles.css`), TypeScript 5.8.
- Пакетный менеджер — **bun** (`bun.lockb` в корне). Команды: `bun install`, `bun run dev`, `bun run build`, `bun run lint`. Отдельного typecheck-скрипта нет (`vite build` не гарантирует полную проверку типов) — типы проверять `bunx tsc --noEmit`. Три команды вместе — это и есть «зелёный набор» для этого проекта: `bunx tsc --noEmit && bun run lint && bun run build`.
- `vite.config.ts` использует обёрнутый конфиг `@lovable.dev/vite-tanstack-config` с явным комментарием «не добавлять плагины вручную» — не редактировать (см. «Что нельзя трогать»).
- Уже в зависимостях и доступны без установки: `framer-motion`, `react-hook-form`, `@hookform/resolvers` (zod), `zod`, `lucide-react`, `embla-carousel-react`, `sonner` (toast).
- **Нет автотестов** в репозитории (нет `vitest`/`jest`, нет `test`-скрипта в `package.json`). Не добавлять тестовый раннер — вне рамок этого захода (см. spec.md «Тестовый пояс»). Проверка — `bun run build`, `tsc --noEmit` (через сборку), `bun run lint`, ручной просмотр.
- i18n — `src/lib/i18n.ts` (`translations`, `useT()`, `LangProvider`) + `src/lib/pages-i18n.ts` (`usePages()`). 4 языка: CZ (по умолчанию), EN, RU, UA. **Не создавать новую систему** — только добавлять ключи в существующую структуру, для всех 4 языков сразу.

## Отсутствующая зависимость

Если тикету не хватает пакета, которого нет в `package.json` — это `BLOCKED`, не самовольная установка. Сообщить в отчёте тикета, не ставить пакет тихо.

## Что нельзя трогать без прямой необходимости (R104–R108, R90–R118)

`src/routeTree.gen.ts` (генерируется роутером — не редактировать руками),
`vite.config.ts`, всё под `src/integrations/supabase/`, `src/lib/*.functions.ts`
(серверные функции — `telegram.functions.ts`, `audit.functions.ts`), SEO/structured
data (`STRUCTURED_DATA` в `src/routes/__root.tsx`, `head()` в любом маршруте,
`src/routes/sitemap[.]xml.ts`). Если задача тикета, кажется, требует их
поменять — это сигнал остановиться и сообщить, а не тихо продолжать.

**Не трогать содержимое `/references/`** — эти 8 файлов не импортируются в
production-код ни при каких обстоятельствах (см. spec.md «Персонаж и
логотип»). Единственный используемый бренд-ассет — уже существующий
`src/assets/elevate-logo.svg` / `elevate-hero-logo.png` через `src/components/
Logo.tsx` — не менять сам файл логотипа.

`src/components/sections/Hero.tsx`, `Hero3D.tsx`, `Services.tsx` — мёртвый код
(нигде не импортируется). Не использовать как основу, не удалять (не входит в
объём этого захода), не редактировать.

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `src/components/hero/DeviceHero.tsx` | композицией и мотором скролл-сцены hero | `<DeviceHero variant="macbook" \| "iphone" lang={Lang} />` | внутреннюю разбивку на слои/панели |
| `src/components/hero/useHeroScroll.ts` | маппинг `scrollYProgress → style` | хук, возвращающий объекты стилей по стадиям сцены | сырую механику `useScroll`/`useTransform` |
| `src/components/sections/ServiceStage.tsx` | связанной презентацией 5 услуг | `<ServiceStage />` (без пропсов, читает `useT()`/`usePages()` сама) | переключение активного индекса, per-service preview |
| `src/components/sections/Contact.tsx` (расширяется) | состоянием степпера лид-формы и сборкой payload | `<Contact />` (как сейчас) | новый шаг «функции/цель», вызывает существующий `sendContactToTelegram` как чёрный ящик — **контракт этой функции не меняется** |

Швы для проверки — те же публичные границы: компоненты монтируются в
`index.tsx`/маршруты как обычные секции, проверяются `tsc`/`eslint`/визуально —
как и весь остальной проект сегодня. Новых внешних контрактов нет.

## Дизайн-токены (владеет ticket 01, все остальные — только читают)

Новые/формализованные CSS custom properties и утилиты в `src/styles.css`
(имена решает ticket 01, ориентир из spec.md §3): единая easing-кривая
(`cubic-bezier(0.22, 1, 0.36, 1)` — уже используется, не менять значение),
`--primary-glow-strong`, ярусы теней (ambient/contact), `surface-glass`
(только nav/оверлеи). Тикеты 02/03/05/06 используют эти токены, не
изобретают свои.

## Из тикета 01 — токены и копирайт (готово, commit `bc49f57`)

- CSS (`src/styles.css`): `--primary-glow-strong` (custom property), `.shadow-ambient`, `.shadow-contact`, `.surface-glass` (только nav/оверлеи), `.heading-display` / `.heading-display-sm` (fluid `clamp()`-заголовки, вес 800) — использовать эти классы, не изобретать новые тени/заголовочные размеры.
- `SectionHeading` (`src/components/sections/SectionHeading.tsx`) — сигнатура пропсов не изменилась (`eyebrow?`, `title`, `subtitle?`), внутри теперь `heading-display-sm`.
- `Nav.tsx` — логотип `h-10 md:h-12` в незаскроленном состоянии / `h-9 md:h-11` заскроленном; dropdown’ы используют стандартный easing.
- i18n (`src/lib/i18n.ts`, все 4 языка CZ/EN/RU/UA): `ui.serviceStage: {title, tag}[5]` (порядок: Weby, SEO, E-shopy, Design & Branding, Aplikace — ключи для тикета 03); `contact.form.features: string[7]`, `contact.form.featuresLabel`, `contact.form.goalLabel`, `contact.form.goalPlaceholder` (для тикета 05); `contact.form.stepTitles` теперь **4 элемента** (было 3) — новый второй элемент "Co má projekt umět?"/аналоги — **тикет 05 обязан пересчитать индексы шагов** (`Contact.tsx` сейчас всё ещё жёстко использует `f.stepTitles[0..2]` под старые 3 шага — это несоответствие ожидаемо и закрывается тикетом 05, не является багом тикета 01).
- Команды в песочнице: `bun`/`bunx` могут быть недоступны — использовать бинарники напрямую из `node_modules/.bin/` (`node_modules/.bin/tsc`, `node_modules/.bin/eslint`, `node_modules/.bin/vite build`) как эквивалент.
- **Известный факт репозитория**: `bun run lint` возвращает тысячи `prettier/prettier`-ошибок форматирования по всему репозиторию — это не регрессия тикета 01 (проверено — ошибки лежат в нетронутых участках файлов), а уже существовавший до этого захода технический долг форматирования. Не пытаться чинить его попутно — вне рамок редизайна.

## Из тикета 05 — CTA-анкета (готово, commit `78b7a33`)

- `Contact.tsx`: `StepKey = 1 | 2 | 3 | 4`. Шаг 2 (новый, необязательный) — мультивыбор `featureIdxs: number[]` + `goal: string`. Порядок: 1 тип проекта → 2 функции/цель → 3 контакты → 4 бюджет.
- `sendContactToTelegram` payload-контракт **не менялся** — features/goal добавляются в конец существующего `message` как `${f.featuresLabel} ...` / `${f.goalLabel} ...` строк.
- `featureIdxs`/`goal` — держатся в локальном state компонента, нигде не отправляются как отдельные API-поля — это и есть задел под R69 (будущий AI-конфигуратор сможет прочитать их оттуда, когда появится).

## Из тикета 03 — ServiceStage (готово, commit `cb26801`)

- `src/components/sections/ServiceStage.tsx` — `export function ServiceStage()`, без пропсов, читает `useT()` сама. Рендерит `<section id="services">`.
- Внутри: `role="tablist"/"tab"/"tabpanel"`, активная панель — `<Link>` на реальный маршрут из `SERVICE_ROUTES` (тот же порядок, что `t.ui.serviceStage`): `/services/web`, `/audit`, `/services/eshop`, `/services`, `/contact`.
- Auto-advance каждые 5200мс, останавливается на hover/focus и навсегда после первого клика; выключен при `prefers-reduced-motion`.
- Использует токены тикета 01: `.heading-display-sm`, `.shadow-contact`, `.hover-lift`, единый easing `[0.22, 1, 0.36, 1]`.
- **Ещё не вмонтирован ни в один маршрут** — это задача тикета 04 (`import { ServiceStage } from "@/components/sections/ServiceStage"` в `src/routes/index.tsx`, замена инлайн-секции «SERVICES — only 3»).

## Из тикета 02 — DeviceHero (готово, commit `7e57968`)

- `<DeviceHero variant="macbook" | "iphone" lang={Lang} />` — `src/components/hero/DeviceHero.tsx`. Самодостаточная секция: сама владеет своим scroll-треком (`height: 220vh` desktop / `170vh` iphone) и sticky-стадией — просто монтируется на место старого `<Hero3DCube />`, ничего больше не требуется.
- `useHeroScroll(targetRef, variant) → HeroSceneStyle` — `src/components/hero/useHeroScroll.ts`. Один `scrollYProgress` управляет всем; `reducedMotion: boolean` в возврате — статичный кадр вместо анимации.
- `DeviceShellMacbook`/`DeviceShellIphone` — не экспортируются наружу пакета, внутренняя деталь `DeviceHero`.
- Экран устройства крутит 4 кадра (`HERO_SCREEN_FRAME_COUNT = 4`): кадр 0 — лого ELEVATE, кадры 1–3 — первые 3 элемента `t.ui.serviceStage` (тикет 01) — это и есть переход «hero → services» (R37/R38), **ничего нового в i18n не добавлено**, только чтение.
- **Ещё не вмонтирован ни в один маршрут** — задача тикета 04.

## Из тикета 06 — роллаут (готово, commit `612b443`)

Точечный проход по About/Services/Pricing/Projects/Audit/Insights — `.hover-lift`
и `SectionHeading` применены там, где были самодельные дубликаты; авторская
вёрстка отдельных страниц (services.branding, services.design) сознательно не
унифицирована. `.grid-bg` не тронут (оставлен на тикет 07). `/projects`-карточка
портфолио живёт в `src/components/sections/Portfolio.tsx`, вне зоны этого
тикета — сверка с новой карточкой портфолио homepage (тикет 04) осталась
открытым пунктом для тикета 07.

## Из тикета 04 — сборка homepage (готово, commit `f99e203`)

`src/routes/index.tsx` теперь: `DeviceHero` (macbook/iphone через `hidden md:block`/`md:hidden`) → `ServiceStage` (все 5) → 9 существующих trust-секций (без изменений) → портфолио (реальные проекты, токены `.hover-lift`/`.shadow-contact`) → InstagramStrip → CTA (токены `.shadow-ambient`/`.heading-display-sm`). `Hero3DCube.tsx` остался в репозитории неиспользуемым (не удалён).

**Открытый мелкий пункт для тикета 07**: копирайт CTA-баннера на homepage (`t.cta.title`/`t.cta.subtitle`) не менялся — по-прежнему generic «Máš projekt? Pojďme ho posunout», без явного намёка «дальше короткий диалог, не форма». Не блокирующе (реальная форма на `/contact` уже не выглядит как форма), но стоит решить в финальной сверке: либо добавить новую i18n-строку, либо сознательно принять как есть.

## Из тикета 07 — QA pass (готово, commit `5a59d0d`)

- `.text-gradient` удалён из `src/styles.css` (был только на stat-counter числах `Results.tsx`, заменён на `text-foreground`) — generic-SaaS приём на числах, попал под запрет брифа. Проверено repo-wide grep — других использований не было.
- `.grid-bg` **оставлен как есть** — ~20 использований сайтвайд, 20-30% opacity, всегда с radial mask — осознанное решение тикета 07: это не тот «громкий» grid-паттерн, который запрещает бриф.
- Homepage CTA (`t.cta.subtitle`, все 4 языка CZ/EN/RU/UA в `src/lib/i18n.ts`) — copy обновлён на «короткий диалог, не форма», без изменения `t.cta.title`/`t.cta.btn` и без новых i18n-ключей.
- Нет новых публичных сигнатур — только copy/CSS. `tsc --noEmit`, `vite build` — чисто; `eslint` — 149 prettier/prettier ошибок, все допредсуществующие (сверено `git stash diff`, те же строки падают до/после).
- Визуальный/mobile QA — структурный (роуты, i18n-ключи, reduced-motion код-пути, реальность данных через чтение исходников), без браузерного рендера — инструмент браузера недоступен в этой песочнице (тот же лимит, что у тикетов 02/03).

## Из тикета 08 — G4-репарация reduced-motion (готово, commit `f7b156b`)

Не часть исходного плана из 7 тикетов — вырезан в Phase 8 после того, как
независимая blind-проверка (G4) нашла реальный дрифт: манифест отмечал R88
(«reduced-motion fallback») как `done`, но `Contact.tsx` (главная CTA-
поверхность) не имел никакой обработки `prefers-reduced-motion` вовсе, в
отличие от hero/ServiceStage. Один глобальный `@media (prefers-reduced-
motion: reduce)` блок в `src/styles.css` (внутри `@layer base`) гасит все
CSS keyframe-анимации/transitions сайтвайд через `!important` (обязателен —
Tailwind-утилиты живут в более позднем cascade layer) — без изменений в
компонентах. Дополняет, не конфликтует с JS-уровня `useReducedMotion()` в
hero/ServiceStage (те управляют Framer Motion через inline-стили, эту
CSS-правку не задевают).

**Побочная находка (не пофикшена, вне рамок тикета)**: `animate-fade-in`/
`animate-scale-in` (используются в `Contact.tsx`, `ContactWidget.tsx`,
`__root.tsx`) сейчас компилируются в ноль CSS-правил — в `styles.css` есть
голые `@keyframes fade-in`/`scale-in` без соответствующего `--animate-fade-in`/
`--animate-scale-in` токена в Tailwind v4 theme, поэтому классы никогда не
генерируются. Предсуществующий баг, не связан с reduced-motion и ни с одним
тикетом редизайна — см. `state.js` → `debt.preExisting`.

## Новые i18n-ключи (владеет ticket 01)

Ticket 01 добавляет в `src/lib/i18n.ts`/`src/lib/pages-i18n.ts` реальные
4-язычные строки для: двух недостающих сервисных карточек (SEO, Aplikace —
см. ticket 01), коротких лейблов `ServiceStage`, нового шага CTA-формы
(мультивыбор функций + цель одной строкой). Тикеты 02/03/05 **только читают**
эти ключи через `useT()` — не добавляют параллельных ключей, чтобы не
конфликтовать по `i18n.ts` в одной волне.
