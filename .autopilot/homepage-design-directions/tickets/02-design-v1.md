# 02 — /design-v1: Reference-led premium studio

**Требования:** R10, R14–R20, R21–R26, R31, R31.1, R31.2 (мобильная адаптация), R32, R37
**Blocked by:** 01
**Зона:** `src/routes/design-v1.tsx`
**Волна:** 2
**Status:** ready

## Что должно заработать

Полноценная страница `/design-v1` — прямое продолжение уже утверждённой продакшен-визуальной системы, а не что-то новое. Это самое безопасное и самое «дотянутое до референса» из четырёх направлений: буквально то, что нарисовано на референсах `bcde04c7-e001-409f-ba79-a5789e48be49.png` (мобильный) и `ChatGPT Image 15 авг. 2026 г., 21_00_01.png` (десктопный) — чёрный фон, тонкий дугообразный синий световой росчерк, реальная фотография устройства, крупный белый заголовок с одной синей акцентной строкой, мелкий трекированный kicker, «SCROLL» вниз слева — доведённое до полной страницы.

Секции сверху вниз:
1. **Hero** — переиспользует существующий `DeviceHero` (`@/components/hero/DeviceHero`, реэкспортируй как есть с `variant="macbook"` на десктопе / `variant="iphone"` на мобильном — тем же паттерном, каким это уже собрано в `src/routes/index.tsx`) внутри `ExploreSwitcher`-обёрнутой страницы. Не копируй код `DeviceHero` — импортируй его напрямую; это единственная V-страница, которой разрешён такой реюз (см. `interfaces.md`).
2. **Подача услуг** — собственная (не импорт `ServiceStage.tsx`) композиция на тех же принципах: устройство/экран с реальным UI-содержимым (в духе `ScreenMockup` — браузерные точки, заголовок, статистика/линия роста), синхронизированный список 5 услуг слева из `t.ui.serviceStage`, авто-листание с паузой на hover/focus (тем же UX-паттерном, что и в проде — `useReducedMotion()` обязателен).
3. **Доказательный блок** — `t.trust`/`t.results` цифры, поданные тихо (числа как часть строки/подписи, не icon+heading+text карточки).
4. **CTA-блок** внизу — заголовок + кнопка на `/contact` (реальный прод-маршрут, не заглушка), используя `.heading-display-sm`.

`ExploreSwitcher` (`active="design-v1"`) — фиксированным элементом поверх всей страницы.

## Из брифа, дословно

> «V1 — Reference-led premium studio»
> «dark premium atmosphere», «blue accent language», «device presentation»
> «Use real assets/references wherever appropriate. If the references contain imagery or visual elements that can be directly reused safely, use them appropriately.»
> «The objective is to translate the visual quality and art direction of the references into a technically strong ELEVATE website.»

## Разделы спецификации

§V1 — Reference-led premium studio, Brand floor, Content rules, Verification (мобильная адаптация — история 5.2).

## Критерии приёмки

- [ ] `/design-v1` открывается напрямую по URL, без Nav/Footer прод-шелла, с видимым `ExploreSwitcher`
- [ ] Hero — реальный `DeviceHero` (не переизобретённая копия), скролл-сцена работает
- [ ] Секция услуг показывает все 5 позиций `t.ui.serviceStage` через реальный UI-мокап устройства, не карточки icon+текст
- [ ] На ширине `sm` (мобильный) все секции — hero, услуги, доказательный блок, CTA — не обрезаны, а адаптированы; переключение `DeviceHero` на `variant="iphone"` работает
- [ ] `prefers-reduced-motion` гейтит скролл-анимацию (через `useReducedMotion()`)
- [ ] Ни одного нового числа/отзыва/клиента — только `useT()` строки
- [ ] Focus-ring на CTA-кнопке и вкладках услуг темизирован из палитры, не браузерный дефолт; интерактивные элементы доступны с клавиатуры
- [ ] `node_modules/.bin/tsc --noEmit` зелёный
