# 01 — RefImage: общий слой подачи референс-графики

**Требования:** R23, R32, R47i, R48i, G02
**Blocked by:** —
**Зона:** `src/components/design-explore/RefImage.tsx`, `src/components/design-explore/concepts.ts`
**Волна:** 1
**Status:** ready

## Что должно заработать

Один общий компонент, через который все четыре направления показывают референс-графику — чтобы `<picture>`/webp/lazy/размеры не переизобретались четырьмя исполнителями по-разному.

1. **`src/components/design-explore/RefImage.tsx`**
   - Импортирует все 14 файлов из `src/assets/refs/` (7 имён × `webp` + `jpg`) статически через Vite-импорты — не строит пути строками в рантайме (иначе Vite их не соберёт).
   - Экспортирует `export type RefName = "hero-macbook" | "hero-iphone" | "svc-web" | "svc-eshop" | "svc-app" | "svc-seo" | "svc-branding"` и компонент:
     `<RefImage name={RefName} alt={string} className?={string} imgClassName?={string} priority?={boolean} sizes?={string} />`
   - Рендерит `<picture>` с `<source type="image/webp">` + `<img>` (jpg fallback).
   - `priority` (по умолчанию `false`): `true` → `loading="eager"` + `fetchPriority="high"`; `false` → `loading="lazy"`. Всегда `decoding="async"`.
   - **Обязательно задаёт внутренние размеры** — зашей в компонент таблицу натуральных пропорций каждого ассета (значения в `interfaces.md`, раздел «Референс-ассеты») и проставляй `width`/`height` на `<img>`, чтобы не было CLS. Вёрстка сверху может переопределять размер через `className`/`imgClassName`.
   - Ничего не знает о конкретном направлении — никакой вёрстки секций внутри.
2. **`concepts.ts`** — обнови `oneLiner` четырёх направлений под новые тезисы (см. `spec.md` §Четыре направления): V1 «Референс оживший», V2 «Кинематографические главы», V3 «Стол студии», V4 «Аппаратная». `slug`/`order`/структуру не меняй — на них завязаны `ExploreSwitcher` и `/design`.

## Из брифа, дословно

> «НЕ заменяй реальные референсные изображения примитивными CSS-заглушками или generic mockup.»
> «реальные изображения из /references там, где они предназначены»

## Разделы спецификации

§Пайплайн ассетов, §Границы и швы.

## Критерии приёмки

- [ ] `RefImage` рендерит `<picture>` с webp-источником и jpg-фолбэком
- [ ] Все 7 имён работают; путь к файлу не собирается строкой в рантайме
- [ ] `width`/`height` проставлены из таблицы натуральных пропорций (нет CLS)
- [ ] `priority` переключает eager/lazy
- [ ] `concepts.ts` обновлён, `slug`/`order` не тронуты, `/design` и `ExploreSwitcher` не сломаны
- [ ] `node_modules/.bin/tsc --noEmit` — 0 ошибок
