# 07 — QA: сборка, регрессии, критерий премиальности

**Требования:** R05, R06, R07, R08, R09, R10, R11, R12, R13, R14, R15, R16, R17, R18, R19, R20, R55, R56, R57, R58, R60, R61, R62, R71, R72, R73, R74, R75, R78, R80–R89, R90–R100, R101, R102, R103, R104–R108, R110, R111–R118, R119, R120, R121, R122, R123, R124, R125
**Blocked by:** 04, 05, 06
**Зона:** весь репозиторий (проверка/точечные фиксы, без новых фич)
**Волна:** 4
**Status:** ready

## Что должно заработать

Финальный проход: собрать проект, прогнать статические проверки, вручную
пройти ключевые маршруты на desktop и mobile-профиле, и приложить критерий
из брифа «Vypadá to opravdu jako premium digital studio, nebo jen jako
hezčí běžný web?» к каждой изменённой поверхности. Найденные мелкие дефекты —
чинить на месте (это тикет ревизии, не новых фич); что-то более крупное —
зафиксировать отдельным пунктом в отчёте, а не тихо расширять объём.

## Из брифа, дословно

> «PHASE 10 — QA: build; typecheck; lint; routing; i18n; responsive; performance; accessibility; animation behavior»
> «Vypadá to opravdu jako premium digital studio, nebo jen jako hezčí běžný web? Pokud druhá možnost: NEAKCEPTUJ TO.»
> «Nerozbíjej: routing; TanStack Start; i18n; Supabase; Telegram lead pipeline; audit form; contact form; analytics; SEO; JSON-LD; OG metadata; existing case studies; existing URLs»

## Чеклист

- [ ] `bun run build` — без ошибок
- [ ] `bun run lint` — без новых ошибок/предупреждений сверх уже существовавших до этого захода
- [ ] Роутинг: все существующие URL (`/`, `/about`, `/services`, `/services/*`, `/pricing`, `/pricing/*`, `/projects`, `/projects/$slug`, `/contact`, `/audit`, `/insights`, `/insights/$slug`) открываются без 404/белого экрана
- [ ] i18n: переключение CZ/EN/RU/UA на homepage и на `/contact` не даёт пустых строк/ключей вида `undefined` — особенно новые `ui.serviceStage` и `contact.form.features/goalLabel`
- [ ] Supabase-интеграция (`src/integrations/supabase/`) не тронута
- [ ] Telegram lead pipeline (`sendContactToTelegram`) и audit-форма (`sendAuditRequest`) по-прежнему успешно отправляют (проверить happy path вручную)
- [ ] Analytics (`src/lib/analytics.ts`, `initAnalytics`/`trackPageView`) не тронуты
- [ ] SEO/JSON-LD/OG: `STRUCTURED_DATA` в `__root.tsx`, `head()` каждого маршрута — не изменены случайно
- [ ] `src/routeTree.gen.ts`, `vite.config.ts` — не редактировались ни в одном тикете
- [ ] Ни один файл из `/references/` не попал в бандл (проверить импорты по всему `src/`)
- [ ] Логотип/бренд ELEVATE не изменён (сверить `elevate-logo.svg` не тронут, персонаж из референсов нигде не используется)
- [ ] Реальные кейсы портфолио (Biodent Clinic, N Home Praha, Exclusive Beauty, EuroMotors) — без выдуманных добавлений, тестимониалов, логотипов клиентов, процентов
- [ ] `prefers-reduced-motion` — hero и остальные новые анимации уважают его
- [ ] Mobile (реальный узкий вьюпорт + throttling) — DeviceHero не лагает, ServiceStage складывается в читаемый вертикальный поток, степпер на `/contact` удобен с клавиатуры телефона
- [ ] Ни одна секция не выглядит как «стандартный SaaS landing»/«одинаковые карточки в grid»/«лишний glassmorphism»/«бессмысленный gradient» — беглый визуальный проход по каждой изменённой поверхности с прямым вопросом «это премиальная студия или просто более симпатичный обычный сайт?»
- [ ] Референсы не скопированы буквально (сверить итоговый hero/ServiceStage — не повтор конкретного референс-кадра 1:1)

## Разделы спецификации

spec.md §16 QA-чеклист, §17 Критерий приёмки — это тот же список критериев, который будет применён в блайнд-приёмке Phase 8 (`G4`), только уже здесь, до неё.
