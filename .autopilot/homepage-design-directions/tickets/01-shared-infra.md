# 01 — Изоляция маршрутов + общий переключатель направлений

**Требования:** R27, R29, R30, R47, R57i, R58i, R59i, A01→R29/R52
**Blocked by:** —
**Зона:** `src/routes/__root.tsx`, `src/routes/design.tsx`, `src/components/design-explore/`
**Волна:** 1
**Status:** ready

## Что должно заработать

Инфраструктура, на которой поедут все четыре V-страницы, и ничего больше — сами V-страницы строят следующие тикеты.

1. **Точечная правка `src/routes/__root.tsx` → `SiteShell`.** Сейчас там безусловно рендерятся `<Nav/>`, `<Footer/>`, `<FloatingCta/>` (уже гейтится через `pathname !== "/contact"`), `<ContactWidget/>`, `<ExitIntentModal/>`, `<CookieBanner/>`, `<PageLoader/>`. Добавь условие «путь начинается с `/design`» (охватывает `/design`, `/design-v1`…`/design-v4`) и по этому условию **не рендери** `Nav`, `Footer`, `FloatingCta`, `ContactWidget`, `ExitIntentModal`, `CookieBanner` — тем же паттерном, что уже используется для `FloatingCta` на `/contact`. `TopProgressBar` и `PageLoader` оставь как есть (нейтральны, не мешают изоляции). `RootShell` (`<html>/<head>`, шрифты, favicon, JSON-LD) не трогай вообще — это не часть шелла сайта, это HTML-документ. Правка должна быть короткой (несколько строк) и **не изменять поведение ни одного существующего маршрута** — после неё `/`, `/services`, `/contact` и т.д. должны выглядеть и работать ровно как раньше.
2. **`src/components/design-explore/concepts.ts`** — единственный источник правды о четырёх направлениях: массив с `slug` (`"design-v1"`…`"design-v4"`), `order` (1–4), `name` (человекочитаемое имя направления, например «V1 — Reference-led premium studio»), `oneLiner` (одна строка сути на русском или английском — сути направления из спецификации, не маркетинговый текст). Импортируется и переключателем, и страницей-указателем — не дублировать список в двух местах.
3. **`src/components/design-explore/ExploreSwitcher.tsx`** — маленький `fixed` (не `sticky`) бар/бейдж, рендерится каждым V-маршрутом внутри себя (не глобально из `__root.tsx`): показывает все 4 направления как ссылки (активное — визуально выделено, без ссылки на себя же или как неактивная), плюс отдельную ссылку «← ELEVATE.CZ» на `/`. Принимает `active: DesignConcept["slug"]`. Не переиспользует `Nav.tsx` (другой визуальный регистр, не должен тянуть прод-меню/языковой переключатель/дропдауны).
4. **`src/routes/design.tsx`** — новый top-level маршрут `/design`: простая страница-указатель, чёрный фон, логотип (`<Logo/>`), заголовок в духе «Выберите направление», и 4 карточки-ссылки на `/design-v1`…`/design-v4` из `DESIGN_CONCEPTS` (имя + `oneLiner` каждой). Не обязана быть визуально изощрённой — это оглавление, не пятое направление.

## Из брифа, дословно

> «Build a temporary visual exploration area/route that allows me to switch between: /design-v1 /design-v2 /design-v3 /design-v4 or an equivalent clearly isolated visual showcase.»
> «The production homepage must remain protected until I choose a direction.»
> «Do not destroy existing functionality.»
> «Do not modify: ... routing architecture ... unless absolutely required for the isolated visual exploration.»

## Разделы спецификации

Решения по реализации §«Маршрутизация и изоляция», Границы и швы, Пользовательские истории №1–2.

## Критерии приёмки

- [ ] `git diff -- src/routes/index.tsx` пустой (продакшен-главная не тронута)
- [ ] `git diff -- src/routes/__root.tsx` короткий, читаемый, ограничен добавлением path-условия вокруг Nav/Footer/попапов
- [ ] `/` и `/services` (или любой другой существующий маршрут) по-прежнему рендерят Nav и Footer как раньше
- [ ] `/design` открывается напрямую, показывает логотип и 4 ссылки на design-v1…v4 с осмысленными названиями/описаниями из `concepts.ts`
- [ ] `ExploreSwitcher` — переиспользуемый компонент, принимает `active`, экспортирует активную/неактивные ссылки на все 4 + возврат на `/`
- [ ] Все ссылки `ExploreSwitcher` и карточки `/design` доступны с клавиатуры (`Tab`+`Enter`), с видимым focus-ring из палитры (не браузерный дефолт)
- [ ] `node_modules/.bin/tsc --noEmit` зелёный
