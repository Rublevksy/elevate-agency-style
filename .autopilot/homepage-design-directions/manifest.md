# Манифест требований

Источник: `2026-08-18-brief.md`. Строку из этого списка может снять **только пользователь**.

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| R01 | «Before changing the production website, inspect the existing project and understand what is already implemented» | done | — | отчёт (git status/diff, компоненты, архитектура — сделано в preflight) |
| R02 | «Use the installed Impeccable skill as the PRIMARY design-engineering system for this entire task. Do not treat Impeccable as optional» | done | craft-floor.md применён при постройке каждого V; критика на этапе спецификации и постфактум (qa-visual-notes.md) | ticket 02-06, commit `c4f56be` |
| R03 | «Use Impeccable to make the visual decisions regarding: composition / typography / spacing / hierarchy / responsive design / interaction / motion / visual polish / accessibility / design critique» | done | все 8 осей отработаны по каждому V (см. §V1-V4 в spec.md), доступность — focus-ring/клавиатура/min-w-0 проверены в ticket 06 | ticket 02-06 |
| R04 | «Also inspect the COMPLETE /references directory... Actually inspect and analyze every relevant reference and extract the visual language from them» | done | — | отчёт (все 8 файлов открыты и разобраны в preflight) |
| R05 | внимание к: hero composition / typography / image treatment / device presentation / dark premium atmosphere / blue accent language / spacing / visual hierarchy / cards-screens / UI elements / scroll storytelling / motion concepts / desktop composition / mobile composition | done | подтверждено скриншотами desktop+mobile всех 4V | ticket 02-06 |
| R06 | «Do NOT immediately redesign the production homepage» | done | `git diff --stat -- src/routes/index.tsx` пуст, подтверждено финально | ticket 06 |
| R07 | «Do NOT make another small CSS patch» | done | весь ран — новые файлы, `styles.css` не тронут ни разу | ticket 01-06 |
| R08 | «Do NOT simply modify the current hero» | done | `DeviceHero`/`useHeroScroll` переиспользованы как есть в ticket 02, не редактировались (кроме забытого импорта в WIP-файле — см. R62i) | ticket 01-06 |
| R09 | «First create FOUR genuinely different visual directions for the ELEVATE homepage... They must be real design concepts, not four minor variations» | done | 4 маршрута реально разные по композиции/типографике/motion, подтверждено чтением кода и скриншотами | ticket 02-06 |
| R10 | «V1 — Reference-led premium studio» | done | — | ticket 02, commit `0e71d6e` |
| R11 | «V2 — Editorial / cinematic digital studio» | done | — | ticket 03, commit `ab80cec` |
| R12 | «V3 — Interactive product showcase» | done | — | ticket 04, commit `bc6b52f` |
| R13 | «V4 — Experimental premium technology studio» | done | — | ticket 05, commit `f1f7050` |
| R14 | каждое направление — явно разный «hero composition» | done | V1 device-scroll, V2 текст+figure-plate без устройства, V3 browser-window-доминанта, V4 асимметричная grid-пара — 4 разных композиции, подтверждено чтением всех 4 файлов | ticket 02/03/04/05 |
| R15 | ...«typography treatment» | done | V1 Inter (унаследовано), V2 Newsreader serif, V3 Space Grotesk, V4 Syne+Space Mono — 4 разных шрифтовых пары | ticket 02/03/04/05 |
| R16 | ...«visual storytelling» | done | V1 продолжение прод-нарратива, V2 журнальный разворот, V3 живой продукт-демо, V4 инженерный лог/консоль | ticket 02/03/04/05 |
| R17 | ...«device / product presentation» | done | V1 реальное фото macbook/iphone, V2 без устройства (текст+атмосфера), V3 browser-окно, V4 консоль-readout — не повтор одного паттерна | ticket 02/03/04/05 |
| R18 | ...«information hierarchy» | done | разный порядок/доминанта секций на каждой странице, проверено чтением | ticket 02/03/04/05 |
| R19 | ...«animation concept» | done | V1 scroll-driven device transform, V2 scroll-synced crossfade, V3 click/hover scene-replay, V4 scan-line+cursor-parallax — 4 разных механики | ticket 02/03/04/05 |
| R20 | ...«scroll behavior» | done | см. R19 — источник анимации (устройство/текст/интеракция/сетка) разный на каждой | ticket 02/03/04/05 |
| R21 | «All four directions must still feel like ELEVATE» | done | чёрный фон + синий акцент + `<Logo/>` на всех четырёх, подтверждено чтением | ticket 01, 02, 03, 04, 05 |
| R22 | «black / near-black foundation» | done | `bg-background`/чёрный на всех четырёх | ticket 02, 03, 04, 05 |
| R23 | «ELEVATE logo» | done | `<Logo/>` на всех четырёх (плюс в `ExploreSwitcher`/`/design`) | ticket 01, 02, 03, 04, 05 |
| R24 | «blue accent» | done | `--primary`/`SIGNAL`-тон на всех четырёх, разная роль (акцент слова / акцент строки / цвет интерфейса / данные) | ticket 02, 03, 04, 05 |
| R25 | «premium digital-studio positioning» | done | реальные `t.hero`/`t.trust`/`t.results` тексты, ничего не выдумано | ticket 02, 03, 04, 05 |
| R26 | «Do not invent a completely unrelated brand» | done | ни на одной странице нет нового имени/лого/слогана | ticket 02, 03, 04, 05 |
| R27 | «The four concepts must be VISUALLY VIEWABLE IN THE BROWSER» | done | — | ticket 01, commit `1e154dd` |
| R28 | «Do not only describe V1/V2/V3/V4 in text» | done | 4 реальных .tsx-маршрута, не текстовое описание | ticket 02, 03, 04, 05 |
| R29 | «Build a temporary visual exploration area/route that allows me to switch between: /design-v1 /design-v2 /design-v3 /design-v4» | done | — | ticket 01, commit `1e154dd` (маршруты design-v1..v4 сами появятся в тикетах 02-05) |
| R30 | «The production homepage must remain protected until I choose a direction» | done | `git diff --stat -- src/routes/index.tsx` пуст, подтверждено | ticket 01, commit `1e154dd`; повторно проверяется ticket 06 |
| R31 | «Each concept should be sufficiently developed that I can judge: hero / typography / composition / devices-screens / visual hierarchy / motion direction / overall premium feeling» | done | все четыре — hero+услуги+доказательный блок+CTA, не только hero | ticket 02, 03, 04, 05 |
| R32 | «Use real assets/references wherever appropriate. If the references contain imagery or visual elements that can be directly reused safely, use them appropriately» | done | V1 — реальные референс-фото через `DeviceHero`; V2/V3/V4 — извлечённые мотивы (rail, browser-chrome, readout), не файлы | ticket 02 (фото), 03/04/05 (извлечённые мотивы) |
| R33 | «Do not replace the reference direction with generic AI-generated agency UI» | done | подтверждено чтением всех 4 файлов (см. interfaces.md записи по тикетам) — ticket 06 делает финальный скриншот-проход | ticket 02, 03, 04, 05; повторно — ticket 06 |
| R34 | «Do not use generic SaaS templates» | done | ни на одной странице нет icon+heading+text сетки как структуры секции | ticket 02, 03, 04, 05; повторно — ticket 06 |
| R35 | «Do not use generic glassmorphism» | done | `backdrop-filter`/glass не используется ни на одной из четырёх (только `ExploreSwitcher`, что по спеке допустимо — nav/оверлей) | ticket 02, 03, 04, 05; повторно — ticket 06 |
| R36 | «Do not create a generic "dark website with blue gradients"» | done | фон не залит градиентом ни на одной; V4 (риск-направление) держит насыщенность в конкретных панелях/акцентах, не по всему фону | ticket 02, 03, 04, 05 (особо ticket 05); повторно — ticket 06 |
| R37 | «The objective is to translate the visual quality and art direction of the references into a technically strong ELEVATE website» | done | извлечённый визуальный язык (кикер+заголовок+акцент, rail-паттерн, browser-chrome, readout-панель) переведён в 4 рабочих технически чистых маршрута | ticket 02, 03, 04, 05 |
| R38 | «Before implementation: 1. inspect git status and current diff» | done | — | отчёт |
| R39 | «2. inspect the existing relevant components» | done | — | отчёт (Explore-агент: routing/hero/ServiceStage/i18n/tokens/Nav) |
| R40 | «3. inspect PRODUCT.md» | done | — | отчёт (прочитан целиком в системном контексте) |
| R41 | «4. inspect prompt.md» | done | — | отчёт (файл пуст — зафиксировано) |
| R42 | «5. inspect the complete /references directory» | done | — | дубль R04, см. там |
| R43 | «6. inspect the installed Impeccable configuration/skills» | done | — | отчёт (SKILL.md, new-work.md, craft-floor.md прочитаны) |
| R44 | «7. understand the current architecture» | done | — | отчёт (Explore-агент) |
| R45 | «Then use Impeccable to critique the proposed directions» | done | критика на этапе спецификации (spec.md) + пост-построечная проверка удержания отличий (qa-visual-notes.md, ticket 06) | ticket 06, commit `c4f56be` |
| R46 | «Do not destroy existing functionality» | done | `git diff --stat` на index.tsx/__root.tsx пуст/минимален; прод-маршруты (`/`, `/services`, `/contact`) проверены curl'ом — Nav/Footer на месте | ticket 06, commit `c4f56be` |
| R47 | «Do not modify: Supabase / Telegram integration / routing architecture / SEO/structured data / existing case-study data / business logic unless absolutely required for the isolated visual exploration» | done | диф на `__root.tsx` — ~10 строк, только `SiteShell`, `head()`/`RootShell` не тронуты | ticket 01, commit `1e154dd` |
| R48 | «RUN THE REAL DEVELOPMENT SERVER» | done | `vite dev` поднят на :4173, оставлен запущенным | ticket 06 |
| R49 | «VERIFY THE ACTUAL RENDERED BROWSER OUTPUT. Do not claim that a visual concept is complete merely because TypeScript compiles» | done | реальные headless-Chrome скриншоты всех 5 маршрутов на desktop(1440)+mobile(390), лично просмотрены и разобраны построчно в `qa-visual-notes.md`; по пути найден и починен настоящий баг (мобильное переполнение) — верификация не формальная | ticket 06, commit `c4f56be`, `.autopilot/homepage-design-directions/screenshots/` |
| R50 | «I need to SEE the four concepts in the browser» | done | то же — скриншоты реальны, не эмуляция; dev-сервер также оставлен для пользователя лично посмотреть | ticket 06 |
| R51 | финальный отчёт, п.1 «what was inspected» | in-spec | — | Phase 8 report (не тикет — формат финального отчёта) |
| R52 | финальный отчёт, п.2 «what was created» | in-spec | — | Phase 8 report |
| R53 | финальный отчёт, п.3-6 «where I can view V1/V2/V3/V4» | in-spec | — | Phase 8 report |
| R54 | финальный отчёт, п.7 «which direction you recommend and why» | in-spec | — | Phase 8 report |
| R55 | «DO NOT choose the final production direction yourself. The user must choose V1, V2, V3 or V4» | in-spec | — | Phase 8 report (рекомендация помечена как рекомендация, не выбор) |
| R56 | «Only after the user chooses a direction should the production rebuild begin» | in-spec | — | spec §Вне рамок — эта сборка заканчивается на экспонировании 4 концептов, тикета на продакшен-рефакторинг нет и не должно быть |
| R57i | *(подразумевается)* нужен способ переключаться между V1-V4 внутри самих страниц, не только зная URL | done | реализовано `ExploreSwitcher` | ticket 01, commit `1e154dd` |
| R58i | *(подразумевается)* `src/routes/index.tsx` (продакшен-главная) не редактируется этой сборкой вообще | done | `git diff --stat` пуст, подтверждено | ticket 01, commit `1e154dd` |
| R59i | *(подразумевается)* изоляция от общего Nav/Footer-шелла требует точечной правки `__root.tsx`/`SiteShell` | done | `isDesignExplore` path-guard, тем же паттерном что `FloatingCta` | ticket 01, commit `1e154dd` |
| R60i | *(подразумевается)* эксплорейшн-страницы не должны ломать typecheck/build/lint остального сайта | done | `tsc --noEmit` — 0 ошибок; `vite build` — успешен, все 5 маршрутов в SSR-манифесте; eslint scoped — чисто (кроме предсуществующего prettier-долга) | ticket 06, commit `c4f56be` |
| R61i | *(подразумевается)* никаких выдуманных бизнес-фактов/метрик/отзывов сверх того, что уже есть в i18n/projects-i18n | done | все 4 файла — только `useT()`-строки; единственные не-i18n тексты — декоративные (V2 «Fig. 01 — Praha», V4 терминальные подписи «elevate@studio:~$», «ONLINE») — UI-хром, не бизнес-факты | ticket 02, 03, 04, 05 |
| R62i | *(подразумевается)* уже закоммиченные незакоммиченные правки hero (`DeviceShell.macbook.tsx`, `useHeroScroll.ts`, новые `src/assets/hero/*`, `ScreenMockup.tsx`) — не откатываются и не обязаны быть завершены этой сборкой; допустимо переиспользовать эти реальные ассеты (referenced-фото macbook/iphone) как материал для V1 | deferred | эти правки принадлежат отдельной, уже прерванной сессии по продакшен-hero — не часть этого брифа; трогать их — не задача этого рана | отчёт |

## Что не вошло (deferred)

- **R62i** — WIP правки текущего продакшен-hero (два изменённых файла + новые ассеты) оставлены как есть, не форсируются к завершению в этом ране.

*(R49/R50 сняты с deferred/placeholder после обнаружения headless-Chrome в песочнице — см. spec.md §Верификация.)*
