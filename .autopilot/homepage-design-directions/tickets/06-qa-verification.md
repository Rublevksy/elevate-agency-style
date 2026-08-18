# 06 — QA: сборка, изоляция от прод-маршрутов, реальная визуальная проверка

**Требования:** R33–R36, R38–R50, R60i (verification)
**Blocked by:** 02, 03, 04, 05
**Зона:** repo-wide verification (правки — только точечные фиксы найденного, не новые фичи)
**Волна:** 3
**Status:** ready

## Что должно заработать

Финальный зелёный набор + настоящая визуальная приёмка всех пяти новых маршрутов, а не только «TypeScript компилируется».

1. **Typecheck/lint/build**: `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/eslint` scoped на все файлы, изменённые этой сборкой (`src/routes/__root.tsx`, `src/routes/design*.tsx`, `src/components/design-explore/**`) — зелёный, без новых ошибок сверх предсуществующего prettier-долга; `node_modules/.bin/vite build` — успешный, включает 5 новых маршрутов.
2. **Изоляция**: `git diff --stat -- src/routes/index.tsx` — пустой. `git diff -- src/routes/__root.tsx` — короткий, ограничен path-условием вокруг Nav/Footer/попапов. Поднять `node_modules/.bin/vite dev` в фоне; `curl` на `/`, `/services`, `/contact` — Nav/Footer по-прежнему в разметке; `curl` на `/design`, `/design-v1`…`/design-v4` — 200, разметка без Nav/Footer.
3. **Реальные скриншоты (закрывает R49/R50 буквально, не эмуляцией):**
   ```
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --headless=new --disable-gpu --no-sandbox \
     --screenshot=<путь>.png --window-size=<W>,<H> <dev-server-url>/design-vN
   ```
   Для каждого из `/design`, `/design-v1`…`/design-v4` (5 маршрутов) сними: десктоп `1440×1400` (hero + начало услуг) и мобильный `390×1200`. Для `/design-v2` дополнительно сними десктоп `1440×3200` (sticky-разворот + цитата-разворот не помещаются в 1400px). Сохрани все PNG в `.autopilot/homepage-design-directions/screenshots/`.
4. **Личный визуальный разбор каждого скриншота** — открой и прочитай каждый файл (не просто проверь, что он существует и не нулевого размера). По каждому из V1–V4 одним абзацем зафиксируй в `.autopilot/homepage-design-directions/qa-visual-notes.md`: что реально видно (не «должно быть»), совпадает ли с тезисом направления из spec.md §V1–V4, есть ли на кадре хоть один запрещённый паттерн из `craft-floor.md` Refuse (градиентный текст, decorative blur, одинаковые icon-карточки, hard-offset тени, generic градиент по фону) — если есть, это находка для фикса, не для отчёта как есть.
5. **Устранение находок**: любой реальный дефект, увиденный на скриншоте (не гипотетический) — почини точечно в файле соответствующего V (не переписывай направление целиком). Пересними только тот кадр, который чинил.
6. **Критика по calibration-риску** (см. spec.md §Критика предложенных направлений) — для каждого V явно ответь на записанный там риск: удержалось ли заявленное отличие в реально построенном коде/скриншоте, или направление выродилось к соседнему.

## Из брифа, дословно

> «RUN THE REAL DEVELOPMENT SERVER. VERIFY THE ACTUAL RENDERED BROWSER OUTPUT. Do not claim that a visual concept is complete merely because TypeScript compiles. I need to SEE the four concepts in the browser.»
> «Do not destroy existing functionality.»

## Разделы спецификации

Верификация (все пункты), §Критика предложенных направлений через Impeccable, Anti-patterns, Accessibility.

## Критерии приёмки

- [ ] `tsc`/`eslint`(scoped)/`vite build` зелёные
- [ ] `git diff --stat -- src/routes/index.tsx` пустой
- [ ] dev-сервер поднят, `curl`-проверка всех 8 маршрутов (3 прод + 5 новых) подтверждает ожидаемое присутствие/отсутствие Nav/Footer
- [ ] 9+ PNG-скриншотов реально сохранены в `.autopilot/homepage-design-directions/screenshots/` (5 маршрутов × desktop+mobile, +1 доп. кадр V2)
- [ ] `qa-visual-notes.md` написан — по абзацу на V1–V4 с честной оценкой по скриншоту, не по намерению
- [ ] Ни один скриншот не показывает запрещённый паттерн из `craft-floor.md` Refuse — либо почищено, либо явно названо в notes как остаточный риск с обоснованием
- [ ] dev-сервер оставлен запущенным (не убит в конце тикета) — он нужен пользователю для финального просмотра
