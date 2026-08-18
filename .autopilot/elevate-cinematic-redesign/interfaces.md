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

## Новые i18n-ключи (владеет ticket 01)

Ticket 01 добавляет в `src/lib/i18n.ts`/`src/lib/pages-i18n.ts` реальные
4-язычные строки для: двух недостающих сервисных карточек (SEO, Aplikace —
см. ticket 01), коротких лейблов `ServiceStage`, нового шага CTA-формы
(мультивыбор функций + цель одной строкой). Тикеты 02/03/05 **только читают**
эти ключи через `useT()` — не добавляют параллельных ключей, чтобы не
конфликтовать по `i18n.ts` в одной волне.
