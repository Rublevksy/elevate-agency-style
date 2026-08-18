# 02 — DeviceHero: кинематографичный hero + scroll-сцена (desktop MacBook / mobile iPhone)

**Требования:** R02, R03, R23, R24, R25, R26, R27, R28, R29, R29.1, R30, R31, R32, R33, R34, R35, R36, R37, R38, R39, R39.1, R40, R41, R76, R77, R79, R133i
**Blocked by:** 01
**Зона:** `src/components/hero/` (новая директория: `DeviceHero.tsx`, `useHeroScroll.ts`, при необходимости `DeviceShell.macbook.tsx` / `DeviceShell.iphone.tsx`)
**Волна:** 2
**Status:** ready

## Что должно заработать

Новый компонент `<DeviceHero variant="macbook" | "iphone" />`, который заменит
собой нынешний `Hero3DCube` в hero-секции homepage (сама замена в `index.tsx` —
задача тикета 04, здесь только сам компонент + его демонстрация работоспособной
в изоляции). При скролле через hero-секцию устройство (MacBook на десктопе,
iPhone на мобильном — не растянутый MacBook) плавно двигается/вращается/
меняет масштаб, контент экрана сменяется, в конце сцены устройство уменьшается/
уходит, и это управляется одним `scrollYProgress`, а не набором независимых
CSS/Intersection-анимаций. Всё выглядит как физический объект (материал,
тень, отражение, лёгкий rim-light), а не плоская картинка. `prefers-reduced-
motion` даёт статичный, но всё равно premium-выглядящий кадр.

## Из брифа, дословно

> «Главный визуальный объект — MacBook с ELEVATE branding... premium material; realistic lighting; depth; shadow; reflections; subtle floating motion»
> «фон: dark blue / black / deep navy atmosphere... flowing waves; subtle light trails; particles; controlled glow... всё должно být velmi controlled»
> «MacBook začíná reagovat na scroll... plynule pohybuje; lehce se otáčí; mění scale; kamera se může přibližovat; displej se dostává do centra pozornosti; obsah displeje se mění; vzniká přirozený transition do sekce služeb»
> «Nechci několik nezávislých animací. Chci jeden souvislý motion sequence.»
> «Po dokončení sekce služeb se zařízení může vizuálně vrátit / uzavřít / odjet»
> «Na mobile může být hlavním hero objektem smartphone místo MacBooku... Žádné těžké efekty, které způsobí lag»

## Разделы спецификации

spec.md §5–§6 (полностью), «Без Three.js/WebGL», «Framer Motion как единственный мотор», «MacBook/iPhone — собственная композиция», «Фон hero», Границы и швы (`DeviceHero`, `useHeroScroll`).

## Как реализовать (без кода — структура важнее)

- **Никакого Three.js/WebGL, никакой новой зависимости.** Только `framer-motion` (уже в проекте) + чистый CSS 3D (`perspective`, `rotateX/Y`, `transform-style: preserve-3d`) — тот же приём, что уже в `src/components/Hero3DCube.tsx` (можно взять оттуда идею структуры слоёв, не копировать код один в один — тот компонент остаётся жить своей жизнью, не трогать его).
- Устройство собирается из слоёв (панель корпуса, шарнир/рамка экрана, содержимое экрана как реальный DOM/картинка с лого + текстом ELEVATE, зеркальное отражение снизу через градиент) — не растровая референсная фотография.
- `useHeroScroll`: `useScroll({ target: heroRef, offset: [...] })` → один `scrollYProgress` → несколько `useTransform` дают `translateY`, `rotateX`, `rotateY`, `scale` устройства + `opacity` фоновых слоёв + индекс текущего «кадра» контента экрана. Экспортируется как один хук, возвращающий готовые style-объекты — сам `DeviceHero` не считает трансформы напрямую.
- Фон: один SVG `<path>` светящейся дуги + 2–3 blur-пятна (существующий паттерн `blur-[140px]` уже в `index.tsx`/`Contact.tsx` — переиспользовать интенсивность/цвет, не изобретать новые значения) + опционально до ~12 точек-частиц через `box-shadow`. Не более 3 одновременно движущихся фоновых слоёв (см. spec «velmi controlled»).
- Первый кадр (до гидратации/JS) обязан быть валидным статичным изображением сцены — устройство и текст на месте без ожидания скрипта (R39.1).
- `useReducedMotion()` из `framer-motion`: при `true` — выключить непрерывный idle-float и scroll-driven трансформы, оставить только простой opacity-переход между «начальным» и «конечным» кадром сцены.
- Mobile (`variant="iphone"`) — **отдельная композиция**, не `scale()` от десктопной: другие пропорции корпуса, при необходимости укороченный/облегчённый scroll-трек (меньше слоёв, меньше параллакс-глубины) — приоритет отсутствие лагов на слабых устройствах (R79) важнее полного повторения desktop-эффекта.
- Устройство использует **существующий чистый логотип** `src/assets/elevate-logo.svg` (через `Logo`/прямой импорт SVG) как контент экрана/крышки — не создавать новый лого-ассет, не импортировать ничего из `/references/`.

## Критерии приёмки

- [ ] `<DeviceHero variant="macbook" />` и `<DeviceHero variant="iphone" />` рендерятся без ошибок в изоляции (можно временно смонтировать на homepage для проверки — итоговая замена секции произойдёт в тикете 04)
- [ ] Все анимации используют только `transform`/`opacity` (проверить — нет анимируемых `top/left/width/height`)
- [ ] Один `scrollYProgress` управляет всей сценой — нет параллельных независимых `IntersectionObserver`/`setInterval` анимаций внутри hero
- [ ] `prefers-reduced-motion: reduce` → сцена статична (idle-float выключен, scroll-транформы заменены на простой fade)
- [ ] Первый рендер (SSR/до гидратации) показывает валидный кадр, не пустой экран
- [ ] Ни один файл из `/references/` не импортирован
- [ ] Логотип берётся из `src/assets/elevate-logo.svg`, сам файл не изменён
- [ ] Нет новых npm/bun-зависимостей в `package.json`
- [ ] На мобильном профиле throttling (Chrome DevTools 4x CPU slowdown) скролл не подвисает заметно
