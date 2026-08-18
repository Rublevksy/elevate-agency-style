# 04 — Сборка homepage: hero, услуги, портфолио, CTA на новых компонентах

**Требования:** R08, R09, R19, R42 (замыкание gap — все 5 услуг на homepage), R59, R60, R61, R62, R101, R102, R135i, R129
**Blocked by:** 02, 03
**Зона:** `src/routes/index.tsx`
**Волна:** 3
**Status:** ready

## Что должно заработать

`src/routes/index.tsx` — единственный реально используемый файл homepage
(`Hero.tsx`/`Hero3D.tsx`/`Services.tsx` из `src/components/sections/` — мёртвый
код, не используется нигде и не является основой). Внутри него:

1. Hero-секция заменяется на `<DeviceHero variant="macbook" />` (текущий
   `<Hero3DCube />` убирается из hero — сам `Hero3DCube.tsx` не удаляется как
   файл, просто перестаёт использоваться здесь).
2. Инлайн-секция «SERVICES — only 3» заменяется на `<ServiceStage />` — теперь
   на homepage видно 5 услуг, а не 3.
3. Инлайн-секция «PORTFOLIO — only 3» — визуальный refresh под новые токены
   (тени/типографика из тикета 01), источник данных (`ProjectVisual`,
   `useProjects`) остаётся прежним, реальные 4 проекта — не добавлять
   выдуманные.
4. Инлайн CTA-секция (заголовок + одна кнопка на `/contact`) — точечная
   доработка копирайта/визуала под новую систему, поясняющая, что дальше не
   форма «Имя/Email/Телефон», а короткий диалог (сам степпер уже живёт на
   `/contact`, дорабатывается тикетом 05 — здесь не дублировать его).
5. Остальные 9 секций (`IndustryStrip`, `TechStack`, `StudioPhilosophy`,
   `ProcessTimeline`, `Collaboration`, `WhyElevate`, `Results`, `TrustBar`,
   `InstagramStrip`) — **порядок и состав не менять**, они автоматически
   выигрывают от токенов тикета 01 (общие CSS custom properties/`SectionHeading`)
   без правки их собственных файлов.

Итоговый порядок секций страницы: Hero → ServiceStage → (Industry → TechStack →
StudioPhilosophy → ProcessTimeline → Collaboration → WhyElevate → Results →
TrustBar) → Portfolio → InstagramStrip → CTA.

## Из брифа, дословно

> «Portfolio nemusí být první věc, kterou uživatel vidí. Nejdříve: identity → services → trust → proof.»
> «Používej pouze skutečné projekty, které už v projektu existují» / «Nikdy nevymýšlej: klienty; testimonials; ratings; výsledky; procenta; loga; fake case studies»
> «Cílem je vytvořit kompletní nový visual experience ... při zachování fungujícího produktu a jeho business logiky»

## Разделы спецификации

spec.md «Реальная архитектура — поправка после независимой проверки G2» (архитектура homepage), §9 Portfolio, история #13/#14.

## Критерии приёмки

- [ ] `bun run build` проходит без ошибок; маршрут `/` рендерится
- [ ] Порядок секций на странице соответствует списку выше
- [ ] Homepage показывает все 5 услуг (через `ServiceStage`), не 3
- [ ] Портфолио показывает только реальные существующие проекты (`useProjects()`), никаких новых выдуманных карточек
- [ ] `head()`/SEO-метаданные маршрута `/` не изменены (title/description/og/canonical — как были)
- [ ] `IndustryStrip`/`TechStack`/`StudioPhilosophy`/`ProcessTimeline`/`Collaboration`/`WhyElevate`/`Results`/`TrustBar`/`InstagramStrip` — сами файлы не редактировались в этом тикете
- [ ] `Hero3DCube.tsx` не удалён как файл (просто больше не используется на этой странице)
- [ ] Мобильная версия hero использует `<DeviceHero variant="iphone" />`, не растянутый desktop-вариант
