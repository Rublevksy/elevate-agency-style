# 01 — Design tokens, shared primitives, новые i18n-строки

**Требования:** R01, R04, R21, R22, R70, R120, R141, R142, R143, R144, R145, R146, R147, R148, R149
**Blocked by:** —
**Зона:** `src/styles.css`, `src/components/sections/SectionHeading.tsx`, `src/components/Nav.tsx`, `src/lib/i18n.ts`
**Волна:** 1
**Status:** ready

## Что должно заработать

Это фундамент, от которого зависят все остальные тикеты. После него: единая
визуальная система (типографика/тени/границы/motion-язык) готова к
использованию через уже существующие CSS custom properties и утилитные классы
— остальным тикетам не придётся изобретать свои; навигация выглядит
чуть более premium; в `i18n.ts` появляются все новые переводы, которые
понадобятся тикетам 02/03/05 (сами эти тикеты новых ключей не добавляют —
только читают то, что появится здесь).

## Из брифа, дословно

> «vytvoř / uprav design tokens; typography; spacing; surfaces; lighting; blue accent; shadows; borders; motion language»
> «Navigation musí být minimalistická a premium»
> «Каждый motion effect должен иметь смысл» / «Каждый визуальный элемент должен быть частью одной композиции»
> design must feel «cinematic; premium; modern; technological; restrained; intentional; expensive; professional»

## Разделы спецификации

spec.md §3 «Дизайн-токены / визуальная система», раздел «Навигация», Границы и швы.

## Что конкретно сделать

1. **`src/styles.css`** — не переписывать палитру (она уже `oklch(0.16 0.02 260)` navy/black + `oklch(0.65 0.18 255)` синий — соответствует брифу). Добавить/формализовать:
   - `--primary-glow-strong` (чуть более яркий/насыщенный оттенок того же синего, для дуги в hero — тикет 02 её использует).
   - Два яруса теней как утилитные классы, например `.shadow-ambient` (мягкая, большой blur, для «парящих» элементов) и `.shadow-contact` (плотная, для «стоящих на поверхности» объектов) — по образцу уже существующих `box-shadow` значений в `.btn-primary`/`.hover-lift`, не выдумывать новую цветовую температуру.
   - Утилитный класс `.surface-glass` (лёгкий blur + полупрозрачность) — **зарезервирован только для nav/оверлеев**, не использовать в карточках услуг/портфолио (см. запрет R17 «чрезмерный glassmorphism» в spec §2).
   - Задокументировать комментарием: единая easing-кривая для «намеренного» motion — `cubic-bezier(0.22, 1, 0.36, 1)` (уже используется в `.hover-lift`, `.nav-link`) — не создавать альтернативные кривые в новых тикетах.
   - Типографика: добавить 1–2 утилитных класса для крупных заголовков с `clamp()`-размером (fluid, не фиксированные брейкпоинты) и туже tracking на весе 800 — для использования в hero/ServiceStage заголовках (тикеты 02/03), не менять существующие `text-*` классы по всему сайту.
2. **`src/components/sections/SectionHeading.tsx`** — применить чуть более выразительную типографику (использовать новый fluid-заголовочный класс), сохранить сигнатуру пропсов (`eyebrow`, `title`, `subtitle`) без изменений — компонент используется в нескольких живых секциях (`Contact.tsx` и др.), менять контракт нельзя.
3. **`src/components/Nav.tsx`** — точечная полировка: чуть крупнее логотип в незаскроленном состоянии, dropdown-меню (Services/Pricing) используют новый motion-easing вместо своего. Структура меню, языки CZ/EN/RU/UA, мобильное меню — **не менять**.
4. **`src/lib/i18n.ts`** — добавить для **всех 4 языков** (CZ/EN/RU/UA), не ломая существующие ключи:
   - Новую группу `ui.serviceStage` — массив из 5 объектов `{ title: string; tag: string }` (короткий заголовок ≤4 слов + одна строка ценности), для тикета 03. Порядок и содержание:
     1. Weby → CZ: «Weby, které prodávají» / «Rychlé, konverzní, na míru» — EN: «Websites that sell» / «Fast, conversion-focused, custom-built» — RU: «Сайты, которые продают» / «Быстро, конверсионно, под ключ» — UA: «Сайти, які продають» / «Швидко, конверсійно, під ключ»
     2. SEO → CZ: «SEO, které přináší výsledky» / «Vyšší návštěvnost a pozice» — EN: «SEO that delivers results» / «More traffic, better rankings» — RU: «SEO, которое приносит результат» / «Больше трафика и позиций» — UA: «SEO, яке приносить результат» / «Більше трафіку та позицій»
     3. E-shopy → CZ: «E-shopy, které vydělávají» / «Optimalizované na konverzi od první návštěvy» — EN: «E-shops that earn» / «Optimized to convert from day one» — RU: «Магазины, которые зарабатывают» / «Настроены на продажу с первого визита» — UA: «Магазини, які заробляють» / «Налаштовані на продаж з першого візиту»
     4. Design & Branding → CZ: «Značka, která zaujme» / «Vizuální identita i grafika» — EN: «A brand people notice» / «Visual identity and design» — RU: «Бренд, который запоминают» / «Визуальная айдентика и дизайн» — UA: «Бренд, який запам'ятовують» / «Візуальна ідентика та дизайн»
     5. Aplikace → CZ: «Aplikace, které lidé používají» / «iOS, Android, na míru» — EN: «Apps people actually use» / «iOS, Android, built to fit» — RU: «Приложения, которыми пользуются» / «iOS, Android, под задачу» — UA: «Застосунки, якими користуються» / «iOS, Android, під задачу»
   - В `contact.form` (все 4 языка) — новый шаг между «тип проекта» и «контактные данные»: добавить `stepTitles` четвёртый элемент (сейчас их 3 — «Jaký projekt řešíte?/Kontaktní údaje/Jaký je přibližný rozpočet?» — вставить новый заголовок вторым, сдвинув остальные), плюс новые массивы: `features: string[]` (6 опций + «Nejsem si jistý» / аналоги) и строки `goalLabel`, `goalPlaceholder`, `featuresLabel`. Опции features (CZ, аналогично перевести на остальные 3): «Online platby», «Rezervační systém», «Vícejazyčnost», «Blog / obsah», «Napojení na CRM», «Mobilní aplikace», «Nejsem si jistý». `goalLabel` CZ: «Jaký je váš hlavní cíl?» EN: «What's your main goal?» RU: «Какова ваша главная цель?» UA: «Яка ваша головна мета?». `goalPlaceholder` CZ: «Např. víc poptávek, rychlejší web, nový branding…» (аналогично перевести). Новый `stepTitles[1]` (второй шаг) CZ: «Co má projekt umět?» EN: «What should the project do?» RU: «Что должен уметь проект?» UA: «Що має вміти проєкт?». **Не переименовывать и не удалять существующие ключи** — только вставлять новые, сохраняя порядок остальных степов согласованным (см. тикет 05, который будет читать эти ключи по новым именам/индексам).

## Критерии приёмки

- [ ] `bun run build` и `bun run lint` проходят без новых ошибок
- [ ] `oklch`-палитра фона/акцента не изменена (осталась navy/black + один синий accent)
- [ ] Новый `.surface-glass` не применён нигде, кроме nav/оверлеев
- [ ] `SectionHeading` рендерится идентично по пропсам (снапшот визуально не «ломается» — заголовок остаётся заголовком, просто крупнее/чётче)
- [ ] `Nav.tsx`: языки CZ/EN/RU/UA, пункты меню, мобильное меню работают как раньше
- [ ] В `i18n.ts` для всех 4 языков присутствуют: `ui.serviceStage` (5 объектов), `contact.form.features`, `contact.form.goalLabel`, `contact.form.goalPlaceholder`, обновлённый `contact.form.stepTitles` (4 заголовка вместо 3) — без опечаток в существующих ключах
- [ ] Ни один существующий переводческий ключ не удалён и не переименован
