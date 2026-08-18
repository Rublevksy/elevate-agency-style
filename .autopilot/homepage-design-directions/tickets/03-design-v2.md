# 03 — /design-v2: Editorial / cinematic digital studio

**Требования:** R11, R14–R20, R21–R26, R31, R31.1, R31.2, R32, R33–R36
**Blocked by:** 01
**Зона:** `src/routes/design-v2.tsx`
**Волна:** 2
**Status:** ready

## Что должно заработать

Полноценная страница `/design-v2` — журнальная, редакционная подача, максимально отличная от V1 по композиции и типографике, но всё ещё узнаваемо ELEVATE (чёрный фон, синий акцент, логотип).

1. **Шрифты**: подключи через собственный `head()` маршрута `design-v2.tsx` (не трогай `__root.tsx` — там уже есть общий `Inter`-линк, добавь второй, не замени его) Google Fonts serif-гарнитуру с редакционным характером — **Fraunces** или **Newsreader** (`fonts.googleapis.com/css2?family=...`, `preconnect` не обязателен на уровне маршрута) — для display-заголовков. Тело и мелкие подписи — существующий Inter (не подключай второй sans повторно).
2. **Hero** — первый экран без устройства: крупный serif-заголовок (собранный из `t.hero.title1`/`title2`/`subtitle`), узкий трекированный uppercase-датлайн сверху (не «kicker ради привычки» — используй как редакционную дату/рубрику, например синтетический «Прага · Digital Studio» из уже существующих строк `t.trust`/`nav`, не выдумывай новый текст), один спокойный атмосферный визуальный элемент (полноширинная тёмная сцена/паттерн, без анимации 3D-устройства).
3. **Подача услуг** — sticky-разворот: слева нумерованный вертикальный список 5 услуг (`t.ui.serviceStage`, номера здесь осмысленны — это порядок оглавления, не декоративная нумерация), справа — крупная сцена активной услуги, кроссфейд/parallax **синхронизированный со скролл-позицией страницы** (используй `useScroll`/`useTransform` из `framer-motion`, тот же принцип, что в `useHeroScroll.ts`, но новый скролл-track внутри этой секции — не auto-timer, не hover-driven).
4. **Доказательный блок** — разворот-цитата: крупная типографика на цифрах `t.results`, без иконок/карточек.
5. **CTA** внизу на `/contact`.

`ExploreSwitcher` (`active="design-v2"`) поверх страницы.

**Запрещено на этой странице** (craft-floor Refuse — жёсткий пол для нового мира, не унаследованный): градиентный текст, decorative glass/blur, одинаковые icon+heading+text карточки как структура секции услуг, hard-offset тени, системный sans как display-голос.

## Из брифа, дословно

> «V2 — Editorial / cinematic digital studio»
> «scroll storytelling», «typography», «visual hierarchy»
> «Do not use generic SaaS templates. Do not use generic glassmorphism. Do not create a generic "dark website with blue gradients".»

## Разделы спецификации

§V2 — Editorial / cinematic digital studio, Anti-patterns, Brand floor, Content rules.

## Критерии приёмки

- [ ] `/design-v2` открывается напрямую, без Nav/Footer, с `ExploreSwitcher`
- [ ] Display-заголовки в новой serif-гарнитуре (не Inter), подключённой через собственный `head()` маршрута
- [ ] Hero не содержит 3D-устройства/скролл-сцены устройства — текст и одна атмосферная сцена
- [ ] Секция услуг — sticky-разворот с нумерованным rail слева и кроссфейдом справа, синхронизированным со скроллом (не auto-timer)
- [ ] Ни одной карточки icon+heading+text, ни одного градиентного текста, ни одного decorative-blur без функции
- [ ] Адаптивна на `sm` на всех секциях (hero, sticky-разворот услуг, цитата-разворот, CTA) — sticky-разворот на мобильном не ломается (допустимо линеаризовать rail+сцену в вертикальный поток)
- [ ] `prefers-reduced-motion` гейтит скролл/parallax через `useReducedMotion()`
- [ ] Focus-ring на нумерованном списке услуг и CTA темизирован из палитры; список услуг доступен с клавиатуры
- [ ] `node_modules/.bin/tsc --noEmit` зелёный
