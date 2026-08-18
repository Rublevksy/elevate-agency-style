# Манифест требований

Источник: `2026-08-18-brief.md`. Строку из этого списка может снять **только пользователь**.

Режим — **full** (полный автомат): Phase 2 (Briefing) пройдена как self-briefing —
открытых вопросов пользователю не задавалось, решения по неоднозначностям записаны
как `ASSUMPTION` прямо в колонке «Основание» и попадут в финальный отчёт (Phase 8).

Не атомизировано в строки: процессные инструкции самому агенту, не описывающие
свойство готового продукта — §1 («сначала изучи»), §17 (порядок фаз как метод
работы — сами фазы дали R137–R140 там, где несут предметный объём), §18 («не жди
после каждого шага» → уже отражено выбором режима **full**), часть §22 (сам
предфазовый отчёт — доставляется в чате, не в готовом продукте).

| ID | Из брифа (дословно) | Статус | Основание | Где |
|----|---------------------|--------|-----------|-----|
| **§2 — References как обязательная часть ТЗ** | | | |
| R01 | «Используй их как visual design system / art direction: композиция; масштаб объектов; атмосфера; освещение; глубина; типографика; расположение текста; работа с MacBook/iPhone; cinematic feeling; blue/black/white palette; характер анимации; способы презентации услуг; переходы; визуальная иерархия; сочетание персонажа, устройств, интерфейсов и графики» | in-ticket | — | spec §3 |
| R02 | «Не копируй изображения буквально» | in-ticket | — | spec §2, §17 |
| R03 | «Не вставляй изображения как статичные баннеры там, где можно создать полноценный интерактивный интерфейс» | in-ticket | — | spec §2, §7 |
| R04 | «Возьми лучшее из всех референсов и создай из этого ЕДИНУЮ систему ELEVATE» | in-ticket | — | spec §3 |
| **§3 — Цель** | | | |
| R05 | сайт должен выглядеть как «дорогой premium digital studio / creative technology agency», не как template/SaaS landing/AI-generated website | in-ticket | — | spec §1 |
| R06 | пользователь сразу понимает 6 направлений: «современные веб-сайты; e-shopy; мобильные приложения; SEO и digital optimization; UI/UX и digital design; branding / logo / visual identity» | in-ticket | — | spec §1, §7 |
| R07 | «сайт не должен объяснять это огромным количеством текста» | in-ticket | — | spec §1, §7 |
| R08 | ощущения: «VISUAL IMPACT, TRUST, PROFESSIONALISM, PREMIUM QUALITY, TECHNOLOGY, MOTION, PRECISION» | in-ticket | — | spec §1, §17 |
| R09 | реакция «Эти ребята реально умеют делать digital products» | in-ticket | untestable по себе — используется как критерий слепой приёмки | spec §17 |
| **§4 — Запрещённые паттерны** | | | |
| R10 | запрещено: «стандартный SaaS landing page» | in-ticket | — | spec §2 |
| R11 | запрещено: «набор одинаковых карточек» / «обычный grid» | in-ticket | — | spec §2, §7 |
| R12 | запрещено: «generic AI website» | in-ticket | — | spec §2 |
| R13 | запрещено: «бесконечные rounded cards» | in-ticket | — | spec §2 |
| R14 | запрещено: «бессмысленные gradients» | in-ticket | — | spec §2 |
| R15 | запрещено: «стандартные hover animations» | in-ticket | — | spec §2 |
| R16 | запрещено: «случайные 3D objects» | in-ticket | — | spec §2 |
| R17 | запрещено: «чрезмерный glassmorphism» | in-ticket | — | spec §2 |
| R18 | запрещено: «визуальный хаос» | in-ticket | — | spec §2 |
| R19 | запрещено: «чрезмерное количество текста» | in-ticket | — | spec §2, §7 |
| R20 | запрещено: «бессмысленные анимации ради анимаций» | in-ticket | — | spec §2, §13 |
| R21 | «Каждый motion effect должен иметь смысл» | in-ticket | — | spec §2, §6, §13 |
| R22 | «Каждый визуальный элемент должен быть частью одной композиции» | in-ticket | — | spec §2, §3 |
| **§5 — Hero (desktop)** | | | |
| R23 | «Первый экран должен быть cinematic» | in-ticket | — | spec §5 |
| R24 | главный визуальный объект — MacBook с ELEVATE branding | in-ticket | — | spec §5 |
| R25 | MacBook как физический объект: «premium material; realistic lighting; depth; shadow; reflections» | in-ticket | — | spec §5 |
| R26 | MacBook — «subtle floating motion» (idle-анимация) | in-ticket | — | spec §5, §6 |
| R27 | фон: «dark blue / black / deep navy atmosphere» | in-ticket | — | spec §3, §5 |
| R28 | фон может включать flowing waves, light trails, particles, controlled glow, depth layers, cinematic lighting; «всё должно být velmi controlled» | in-ticket | — | spec §3, §5 |
| R29 | MacBook — «главный interactive object всего hero», не статичная картинка | in-ticket | — | spec §5, §6 |
| **§6 — Scroll experience** | | | |
| R30 | scroll-опыт — «jedna z nejdůležitějších částí redesignu» | in-ticket | — | spec §6 |
| R31 | «MacBook začíná reagovat na scroll» | in-ticket | — | spec §6 |
| R32 | MacBook «se plynule pohybuje» при скролле | in-ticket | — | spec §6 |
| R33 | MacBook «lehce se otáčí» при скролле | in-ticket | — | spec §6 |
| R34 | MacBook «mění scale» при скролле | in-ticket | — | spec §6 |
| R35 | «kamera se může přibližovat» | in-ticket | — | spec §6 |
| R36 | «displej se dostává do centra pozornosti» | in-ticket | — | spec §6 |
| R37 | «obsah displeje se mění» | in-ticket | — | spec §6 |
| R38 | «vzniká přirozený transition do sekce služeb» | in-ticket | — | spec §6, §7 |
| R39 | «Nechci několik nezávislých animací. Chci jeden souvislý motion sequence» | in-ticket | — | spec §6 |
| R40 | «Uživatel musí mít pocit, že skutečně "vstupuje" do digitálního produktu» | in-ticket | — | spec §6 |
| R41 | «Po dokončení sekce služeb se zařízení může vizuálně vrátit / uzavřít / odjet a stránka pokračuje standardnějším scrollem» | in-ticket | формулировка brief — «может» (опция), выбрана как часть единой motion-последовательности | spec §6 |
| **§7 — Služby** | | | |
| R42 | 5 услуг: «01 — Weby, 02 — SEO / Digital Optimization, 03 — E-shopy, 04 — Design / Branding, 05 — Aplikace» | in-ticket | — | spec §7 |
| R43 | запрещено: «NEPOUŽÍVEJ automaticky přesně tento text nebo obyčejné 5 cards» | in-ticket | — | spec §7 |
| R44 | «Podívej se na reference a vytvoř nejlepší způsob prezentace» | in-ticket | — | spec §3, §7 |
| R45 | услуги — «vizuální» | in-ticket | — | spec §7 |
| R46 | услуги — «interaktivní» | in-ticket | — | spec §7 |
| R47 | услуги — «propojené» (связаны между собой) | in-ticket | — | spec §7 |
| R48 | услуги — «lehce animované» | in-ticket | — | spec §7 |
| R49 | услуги — «s minimem textu» | in-ticket | — | spec §7 |
| R50 | услуги — «okamžitě pochopitelné» | in-ticket | — | spec §7 |
| R51 | «Můžeš vytvořit vlastní layout, pokud bude lepší než reference» | in-ticket | — | spec §7 |
| **§8 — 5 service card референсов** | | | |
| R52 | использовать: «charakter; vizuální jazyk; postavu; branding; zařízení; kompozici; způsob prezentace služby» из 5 сервисных визуалов | in-ticket | реализовано как язык композиции/UI, не как фотовставки персонажа — см. R131i–R133i | spec §3, §4, §7 |
| R53 | запрещено: «nesnaž se pouze vložit všech 5 obrázků za sebe» | in-ticket | — | spec §7 |
| R54 | «Vytvoř z nich kvalitní interactive service experience» | in-ticket | — | spec §7 |
| R55 | «Postavu ELEVATE a logo neměň» | in-ticket | — | spec §4 |
| **§9 — Postava a branding** | | | |
| R56 | не менять: «charakter postavy; její vzhled; logo ELEVATE; brand identity» | in-ticket | — | spec §4 |
| R57 | разрешено менять: «pozici; maskování; crop; scale; parallax; motion; lighting; reveal animations; compositing» | in-ticket | — | spec §4 |
| R58 | «nevytvářej nový character design» | in-ticket | — | spec §4 |
| **§10 — Portfolio / case studies** | | | |
| R59 | «Portfolio nemusí být první věc, kterou uživatel vidí. Nejdříve: identity → services → trust → proof» | in-ticket | — | spec §5–§9 (порядок секций) |
| R60 | «Používej pouze skutečné projekty, které už v projektu existují» | in-ticket | — | spec §9 |
| R61 | никогда не выдумывать: «klienty; testimonials; ratings; výsledky; procenta; loga; fake case studies» | in-ticket | — | spec §9, §17 |
| R62 | «Existující reálné case studies musí zůstat pravdivé» | in-ticket | — | spec §9 |
| **§11 — CTA / lead form** | | | |
| R63 | «Hlavním obchodním cílem webu je získat lead» | in-ticket | — | spec §10 |
| R64 | CTA не должна выглядеть как «Jméno / Email / Telefon / Odeslat» | in-ticket | — | spec §10 |
| R65 | «Chci modernější experience» | in-ticket | — | spec §10 |
| R66 | вести вопросами: «co potřebuje; jaký typ projektu řeší; co chce vytvořit; jaké funkce potřebuje; jaký má cíl» | in-ticket | — | spec §10 |
| R67 | «Budoucí AI konfigurátor / generování variant je součástí vize» | deferred | видение на будущее, не входит в объём этого захода — см. R69 (только подготовка UI/архитектуры сейчас) | spec §10, Out of Scope |
| R68 | «Pokud současná implementace AI konfigurátoru ještě není připravená, NEVYTVÁŘEJ falešnou backendovou funkcionalitu» | in-ticket | — | spec §10 |
| R69 | «Připrav UI a architecture tak, aby se dal později správně napojit» | in-ticket | — | spec §10 |
| **§12 — Navigace** | | | |
| R70 | «Navigation musí být minimalistická a premium» | in-ticket | — | spec §11 |
| R71 | языки: CZ / EN / RU / UA | in-ticket | — | spec §11 |
| R72 | «Musí zůstat zachována existující i18n architektura» | in-ticket | — | spec §11, §14 |
| R73 | «NEVYTVÁŘEJ nový i18n systém» | in-ticket | — | spec §11, §14 |
| R74 | «Používej existující `useT()` a současnou strukturu překladů» | in-ticket | — | spec §11, §14 |
| **§13 — Mobile** | | | |
| R75 | «Mobile není zmenšená desktopová verze. Musí být samostatně navržená» | in-ticket | — | spec §12 |
| R76 | «Na mobile může být hlavním hero objektem smartphone místo MacBooku» | in-ticket | — | spec §5, §12 |
| R77 | mobile-философия: «device; cinematic environment; motion; scroll; transition; services» | in-ticket | — | spec §12 |
| R78 | «vše musí být optimalizované pro mobile» | in-ticket | — | spec §12, §13 |
| R79 | «Žádné těžké efekty, které způsobí lag» | in-ticket | — | spec §12, §13 |
| **§14 — Performance** | | | |
| R80 | «Visual quality nesmí znamenat špatný performance» | in-ticket | — | spec §13 |
| R81 | приоритет: «PREMIUM VISUALS + SMOOTH 60FPS FEEL + FAST LOAD + MOBILE PERFORMANCE» | in-ticket | — | spec §13 |
| R82 | «transform/opacity animations» | in-ticket | — | spec §13 |
| R83 | «GPU-friendly motion» | in-ticket | — | spec §13 |
| R84 | «lazy loading» | in-ticket | — | spec §13 |
| R85 | «responsive assets» | in-ticket | — | spec §13 |
| R86 | «optimalizované images» | in-ticket | — | spec §13 |
| R87 | «správnou práci s viewportem» | in-ticket | — | spec §13 |
| R88 | «reduced-motion fallback» | in-ticket | — | spec §13, §17 |
| R89 | «Vyhni se zbytečným continuous animations» | in-ticket | — | spec §13 |
| **§15 — Nerozbíjet existující funkcionalitu** | | | |
| R90 | nerozbíjet: routing | in-ticket | — | spec §14 |
| R91 | nerozbíjet: TanStack Start | in-ticket | — | spec §14 |
| R92 | nerozbíjet: i18n | in-ticket | — | spec §14 |
| R93 | nerozbíjet: Supabase | in-ticket | — | spec §14 |
| R94 | nerozbíjet: Telegram lead pipeline | in-ticket | — | spec §14 |
| R95 | nerozbíjet: audit form | in-ticket | — | spec §14 |
| R96 | nerozbíjet: contact form | in-ticket | — | spec §14 |
| R97 | nerozbíjet: analytics | in-ticket | — | spec §14 |
| R98 | nerozbíjet: SEO | in-ticket | — | spec §14 |
| R99 | nerozbíjet: JSON-LD | in-ticket | — | spec §14 |
| R100 | nerozbíjet: OG metadata | in-ticket | — | spec §14 |
| R101 | nerozbíjet: existing case studies | in-ticket | — | spec §9, §14 |
| R102 | nerozbíjet: existing URLs | in-ticket | — | spec §14 |
| R103 | «Redesignuj vizuální vrstvu kolem těchto systémů» | in-ticket | — | spec §14 |
| **§16 — Soubory, které nesmíš bezdůvodně měnit** | | | |
| R104 | opatrně: `routeTree.gen.ts` | in-ticket | — | spec §14 |
| R105 | opatrně: `vite.config.ts` | in-ticket | — | spec §14 |
| R106 | opatrně: Supabase generated integration files | in-ticket | — | spec §14 |
| R107 | opatrně: server functions | in-ticket | — | spec §14 |
| R108 | opatrně: SEO / structured data | in-ticket | — | spec §14 |
| **§17 — Fáze (predmětný objem)** | | | |
| R109 | Phase 8 — postupně: «About, Services, Projects, Pricing, Audit, Contact, Insights atd.» | in-ticket | сайт-вайд роллаут визуальной системы, вне первого прохода по homepage | spec §15 |
| R110 | Phase 10 QA: «build; typecheck; lint; routing; i18n; responsive; performance; accessibility; animation behavior» | in-ticket | — | spec §16 |
| R137 | Phase 5: «Přepracuj další homepage sections» (Trust/Process/Results) | in-ticket | — | spec §8 |
| R138 | Phase 6: «Přepracuj prezentaci reálných projektů» | in-ticket | — | spec §9 |
| R139 | Phase 7: «Přepracuj lead capture experience» | in-ticket | — | spec §10 |
| R140 | Phase 9: «Každou důležitou sekci optimalizuj zvlášť pro mobile» | in-ticket | — | spec §12 |
| **§19 — Nepřepisuj zbytečně** | | | |
| R111 | nepřepisovat: fungující backend | in-ticket | — | spec §14 |
| R112 | nepřepisovat: server functions | in-ticket | — | spec §14 |
| R113 | nepřepisovat: routing | in-ticket | — | spec §14 |
| R114 | nepřepisovat: i18n | in-ticket | — | spec §14 |
| R115 | nepřepisovat: SEO | in-ticket | — | spec §14 |
| R116 | nepřepisovat: data layer | in-ticket | — | spec §14 |
| R117 | «Pokud lze něco reuse, reuse» | in-ticket | — | spec §14 |
| R118 | рефакторинг компонента разрешён, «ale změna musí mít důvod» | in-ticket | — | spec §14 |
| **§20 — Quality bar** | | | |
| R119 | тест: «Vypadá to opravdu jako premium digital studio, nebo jen jako hezčí běžný web?» — при «hezčí běžný web» → «NEAKCEPTUJ TO» | in-ticket | критерий слепой приёмки (G4) | spec §17 |
| R120 | design must feel: «cinematic; premium; modern; technological; restrained; intentional; expensive; professional», ne «AI generated» | in-ticket | — | spec §1, §17 |
| **§21 — Důležité** | | | |
| R121 | «Nekopíruj reference pixel-perfect» | in-ticket | — | spec §2, §17 |
| R122 | «Nekopíruj cizí web» | in-ticket | — | spec §2, §17 |
| R123 | «Nekopíruj konkrétní design» | in-ticket | — | spec §2, §17 |
| R124 | «REFERENCE = inspiration + art direction» | in-ticket | — | spec §2, §3 |
| R125 | «Výsledkem musí být vlastní ELEVATE Digital Studio experience» | in-ticket | — | spec §1, §3 |
| **Заключение** | | | |
| R129 | «Cílem je vytvořit kompletní nový visual experience ... při zachování fungujícího produktu a jeho business logiky» — не «upravit CSS» | in-ticket | — | spec §1, §14 |
| **§17 — Phase 1 VISUAL SYSTEM (пропущено при первой атомизации, добавлено по итогу независимой проверки G2)** | | | |
| R141 | «vytvoř / uprav design tokens» | in-ticket | добавлено после G2-проверки (см. `state.js.coverage`) | spec §3 |
| R142 | «typography» | in-ticket | — | spec §3 |
| R143 | «spacing» | in-ticket | — | spec §3 |
| R144 | «surfaces» | in-ticket | — | spec §3 |
| R145 | «lighting» | in-ticket | — | spec §3 |
| R146 | «blue accent» | in-ticket | — | spec §3 |
| R147 | «shadows» | in-ticket | — | spec §3 |
| R148 | «borders» | in-ticket | — | spec §3 |
| R149 | «motion language» | in-ticket | — | spec §3 |
| **Обнаруженные ограничения (implicit / ASSUMPTION, full mode)** | | | |
| R130i | *(подразумевается)* `prompt.md`, названный «главный master brief», физически пуст (0 байт) | placeholder | ASSUMPTION: текстом брифа считается сообщение пользователя в чате от 2026-08-18, записанное дословно в `2026-08-18-brief.md`; при появлении содержимого в `prompt.md` в будущем — свериться отдельно | отчёт Phase 8 |
| R131i | *(подразумевается)* 8 файлов в `/references` — цельные AI-сгенерированные рекламные композиты (запечённый фон, вымышленный текст на макетах вроде «ICONIC» / фейковые проценты), не слоёные assets с альфа-каналом персонажа | in-ticket | обнаружено при просмотре всех 8 файлов; определяет решение R132i | spec §4 |
| R132i | *(подразумевается)* «postavu neměň» + «нельзя вставлять как баннеры» вместе означают: персонаж из этих 8 референсов не переносится на сайт как фотовырезка (чистый alpha-cutout недостижим без сегментации/генерации изображений, которых в этой сессии нет) — художественный язык референсов (тёмный navy/black, голубой accent-glow, «презентует девайс с реальным экраном») переносится в кодовые интерактивные компоненты вместо | in-ticket | ASSUMPTION (full mode): без этого решения R55/R56/R58 («не менять персонажа») и R02/R03/R121 («не копировать буквально», «не баннерами») входят в прямое противоречие при попытке физически вырезать персонажа из растровых композитов | spec §4 |
| R133i | *(подразумевается)* нынешний `Hero3D.tsx` (плавающая dashboard-карточка) и `hero-mockup.jpg` (нечитаемый фейковый текст на дашборде) — ровно тот «generic AI dashboard» паттерн, который §4 брифа запрещает | in-ticket | обнаружено при чтении кода; обосновывает полную замену, не косметическую правку | spec §5, §7 |
| R134i | *(подразумевается)* «interaktivní» + «propojené» для услуг означает общий связывающий механизм (единый интерактивный «stage», переключаемый общим индексом/линией), а не 5 несвязанных карточек | in-ticket | ASSUMPTION (full mode) | spec §7 |
| R135i | *(подразумевается)* механизм реальных скриншотов уже существует (`src/lib/projects.tsx` → `screenshotUrl` / mshots) и должен быть переиспользован, не создан заново, для соблюдения R60/R117 | in-ticket | — | spec §9, §14 |
| R136i | *(подразумевается)* пошаговая CTA-анкета (R66) — новый фронтенд-компонент поверх существующего лид-пайплайна (Supabase/Telegram), не новый бэкенд — иначе конфликт с R68/R94/R111 | in-ticket | ASSUMPTION (full mode) | spec §10 |

## Тикет-маппинг (Phase 4 — G3)

Все 144 строки со статусом `in-ticket` закрыты одним из 7 тасков; полная
Требования-строка каждого тикета — в `tickets/0N-*.md`, здесь — обратная
карта для быстрой проверки G3.

| Тикет | Требования |
|---|---|
| 01 — токены/примитивы/копирайт | R01, R04, R21, R22, R70, R120, R141–R149 |
| 02 — DeviceHero + scroll | R02, R03, R23–R41, R76, R77, R79, R133i |
| 03 — ServiceStage | R02, R03, R42–R58, R131i, R132i, R134i |
| 04 — сборка homepage | R08, R09, R19, R42, R59–R62, R101, R102, R129, R135i |
| 05 — CTA-анкета (шаг в `Contact.tsx`) | R63–R69, R66.1, R94, R96, R136i, R139 |
| 06 — роллаут на остальные страницы | R109, R118, R137–R140 |
| 07 — QA / приёмка | R05–R09, R10–R20, R55–R58, R60–R62, R71–R75, R78, R80–R125 (кроме уже отдельно закрытых выше) |

R130i (`prompt.md` пуст) — статус `placeholder`, тикета не требует: не
дефект кода, а зафиксированное допущение (см. «Открытые места» в spec.md).
R67 — статус `deferred`, сознательно не в тикетах (см. «Вне рамок» в spec.md).
