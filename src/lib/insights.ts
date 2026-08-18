/**
 * Insights / blog content — fully localized per language.
 * Each article has a stable canonical `id`, locale-specific `slug` and content
 * for every supported language. The `/insights/$slug` route resolves a slug
 * across all locales, so links remain valid regardless of active language.
 */
import type { Lang } from "@/lib/i18n";

export type InsightSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type LocalizedArticle = {
  /** Locale-specific URL slug (must be unique across all articles + locales). */
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  lead: string;
  sections: InsightSection[];
  faq?: { q: string; a: string }[];
};

export type Insight = {
  /** Stable canonical ID used for `related` references. Never shown in URLs. */
  id: string;
  /** ISO date string. */
  publishedAt: string;
  readingMinutes: number;
  /** Other article IDs to surface as related. */
  related?: string[];
  i18n: Record<Lang, LocalizedArticle>;
};

/** Resolved article view for a single language (flattened i18n). */
export type ResolvedInsight = Omit<Insight, "i18n"> & LocalizedArticle;

// ──────────────────────────────────────────────────────────────────────────────
// Articles
// ──────────────────────────────────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    id: "common-website-mistakes-2026",
    publishedAt: "2026-04-12",
    readingMinutes: 7,
    related: ["ux-trust-conversion", "cost-of-quality-web"],
    i18n: {
      CZ: {
        slug: "nejcastejsi-chyby-firemnich-webu-2026",
        title: "Nejčastější chyby firemních webů v roce 2026",
        excerpt:
          "Co dnes brzdí české firemní weby nejvíc — a proč to není o vizuálu, ale o rozhodování a struktuře.",
        category: "Web strategie",
        lead:
          "Většina firemních webů, které dnes vidíme, není technicky špatná. Problém je jinde: web nebyl postavený s jasným rozhodnutím, co má dělat. Tady je pět chyb, které potkáváme nejčastěji.",
        sections: [
          {
            heading: "1. Hero, který nic neříká",
            paragraphs: [
              "Návštěvník má tři sekundy, aby pochopil, co děláte, pro koho a proč by ho to mělo zajímat. „Vítejte na našem webu“ tuhle otázku nezodpoví.",
              "Hero musí konkrétně pojmenovat výsledek, který klient získá. Ne službu — výsledek.",
            ],
          },
          {
            heading: "2. Žádná jasná další akce",
            paragraphs: [
              "Web bez jasného next step je drahá vizitka. Každá sekce by měla mít buď tlačítko, nebo důvod jít na další sekci.",
              "Primární CTA musí být v heroovi, v hlavičce a opakovaně v obsahu. Sekundární CTA snižuje bariéru pro váhající návštěvníky.",
            ],
          },
          {
            heading: "3. Trust signály až ve footru",
            paragraphs: [
              "Reference, certifikace, jména klientů patří nahoru, ne dolů. Čím dříve klient vidí důvod vám věřit, tím větší šance, že dočte stránku.",
            ],
          },
          {
            heading: "4. Mobil jako dodatek",
            paragraphs: [
              "70 % návštěvnosti přichází z mobilu. Pokud se hůř čte, pomaleji načítá nebo CTA mizí pod záhybem, ztrácíte větší část publika ještě před tím, než dostane šanci.",
            ],
          },
          {
            heading: "5. Žádné měření, žádná iterace",
            paragraphs: [
              "Web spuštěný bez analytiky je střelba naslepo. Bez dat nevíte, kde lidé odpadávají. První měsíc po spuštění je nejdůležitější — a obvykle se promrhá.",
            ],
          },
        ],
        faq: [
          {
            q: "Jak často by se měl firemní web aktualizovat?",
            a: "Strukturální audit jednou za 12–18 měsíců, obsahové iterace průběžně. Kompletní redesign typicky každé 3–4 roky.",
          },
          {
            q: "Stačí mi šablona, nebo potřebuju web na míru?",
            a: "Šablona je v pořádku tam, kde nejde o konverzi a značku. Pokud má web být obchodním kanálem, šablonové řešení vás dlouhodobě stojí víc.",
          },
        ],
      },
      EN: {
        slug: "common-company-website-mistakes-2026",
        title: "The most common company website mistakes in 2026",
        excerpt:
          "What slows corporate websites down today — and why it's not about visuals, but about decisions and structure.",
        category: "Web strategy",
        lead:
          "Most corporate websites aren't technically broken. The problem is elsewhere: the site was never built around a clear decision about what it should do. Here are five mistakes we see most often.",
        sections: [
          {
            heading: "1. A hero that says nothing",
            paragraphs: [
              "Visitors have three seconds to understand what you do, for whom, and why they should care. \"Welcome to our website\" doesn't answer any of that.",
              "The hero must name the outcome the client gets. Not the service — the outcome.",
            ],
          },
          {
            heading: "2. No clear next action",
            paragraphs: [
              "A site with no clear next step is an expensive business card. Every section should either have a button or a reason to keep scrolling.",
              "The primary CTA belongs in the hero, in the header, and repeated through the content. A secondary CTA lowers the barrier for hesitant visitors.",
            ],
          },
          {
            heading: "3. Trust signals stuck in the footer",
            paragraphs: [
              "Case studies, certifications, client logos belong at the top — not the bottom. The sooner visitors see a reason to trust you, the more likely they'll keep reading.",
            ],
          },
          {
            heading: "4. Mobile treated as an afterthought",
            paragraphs: [
              "70% of traffic is mobile. If your site is harder to read, slower to load, or your CTA disappears below the fold, you lose most of your audience before they even get a chance.",
            ],
          },
          {
            heading: "5. No measurement, no iteration",
            paragraphs: [
              "A site launched without analytics is shooting blind. Without data you don't know where people drop off. The first month after launch matters most — and usually gets wasted.",
            ],
          },
        ],
        faq: [
          {
            q: "How often should a company website be updated?",
            a: "A structural audit every 12–18 months, content iterations continuously. A full redesign typically every 3–4 years.",
          },
          {
            q: "Is a template enough, or do I need custom?",
            a: "Templates work where conversion and brand don't matter. If the site is a sales channel, a template ends up costing more long term.",
          },
        ],
      },
      RU: {
        slug: "rasprostranyonnye-oshibki-saytov-2026",
        title: "Самые частые ошибки корпоративных сайтов в 2026",
        excerpt:
          "Что больше всего тормозит корпоративные сайты сегодня — и почему дело не в визуале, а в решениях и структуре.",
        category: "Веб-стратегия",
        lead:
          "Большинство корпоративных сайтов технически в порядке. Проблема глубже: сайт построен без чёткого решения о том, что он должен делать. Вот пять самых частых ошибок.",
        sections: [
          {
            heading: "1. Hero, который ничего не говорит",
            paragraphs: [
              "У посетителя есть три секунды, чтобы понять, что вы делаете, для кого и почему ему это важно. «Добро пожаловать на наш сайт» на этот вопрос не отвечает.",
              "Hero должен называть результат, который получит клиент. Не услугу — результат.",
            ],
          },
          {
            heading: "2. Нет ясного следующего шага",
            paragraphs: [
              "Сайт без чёткого next step — дорогая визитка. В каждой секции должна быть либо кнопка, либо причина листать дальше.",
              "Основной CTA должен быть в hero, в шапке и повторяться по странице. Вторичный CTA снижает барьер для сомневающихся.",
            ],
          },
          {
            heading: "3. Trust-сигналы только в футере",
            paragraphs: [
              "Кейсы, сертификаты, логотипы клиентов — наверх, не вниз. Чем раньше посетитель увидит повод вам верить, тем выше шанс, что он дочитает страницу.",
            ],
          },
          {
            heading: "4. Мобайл как дополнение",
            paragraphs: [
              "70% трафика — мобильный. Если сайт хуже читается, медленнее грузится или CTA уходит за экран, вы теряете большую часть аудитории ещё до старта.",
            ],
          },
          {
            heading: "5. Нет аналитики, нет итераций",
            paragraphs: [
              "Сайт без аналитики — стрельба вслепую. Без данных не видно, где люди уходят. Первый месяц после запуска важнее всего — и обычно его упускают.",
            ],
          },
        ],
        faq: [
          {
            q: "Как часто нужно обновлять корпоративный сайт?",
            a: "Структурный аудит раз в 12–18 месяцев, контент — постоянно. Полный редизайн обычно каждые 3–4 года.",
          },
          {
            q: "Достаточно ли шаблона, или нужен сайт на заказ?",
            a: "Шаблон подходит там, где конверсия и бренд не важны. Если сайт — это канал продаж, шаблон в перспективе обходится дороже.",
          },
        ],
      },
      UA: {
        slug: "naychastishi-pomylky-saytiv-2026",
        title: "Найчастіші помилки корпоративних сайтів у 2026",
        excerpt:
          "Що сьогодні найбільше гальмує корпоративні сайти — і чому це не про візуал, а про рішення та структуру.",
        category: "Веб-стратегія",
        lead:
          "Більшість корпоративних сайтів технічно не зламані. Проблема в іншому: сайт побудований без чіткого рішення, що він має робити. Ось п'ять найпоширеніших помилок.",
        sections: [
          {
            heading: "1. Hero, який нічого не каже",
            paragraphs: [
              "У відвідувача є три секунди, щоб зрозуміти, що ви робите, для кого і чому це важливо. «Ласкаво просимо на наш сайт» на це питання не відповідає.",
              "Hero має називати результат, який отримає клієнт. Не послугу — результат.",
            ],
          },
          {
            heading: "2. Немає чіткого наступного кроку",
            paragraphs: [
              "Сайт без зрозумілого next step — дорога візитка. У кожному блоці має бути або кнопка, або причина гортати далі.",
              "Основний CTA — в hero, в шапці й повторно по контенту. Вторинний CTA знижує бар'єр для тих, хто вагається.",
            ],
          },
          {
            heading: "3. Trust-сигнали лише у футері",
            paragraphs: [
              "Кейси, сертифікати, логотипи клієнтів — нагору, не вниз. Що раніше відвідувач побачить причину вам довіряти, то вища ймовірність, що він дочитає сторінку.",
            ],
          },
          {
            heading: "4. Мобайл як додаток",
            paragraphs: [
              "70% трафіку — мобільний. Якщо сайт гірше читається, повільніше вантажиться чи CTA зникає за екраном, ви втрачаєте більшу частину аудиторії ще до старту.",
            ],
          },
          {
            heading: "5. Без вимірювання — без ітерацій",
            paragraphs: [
              "Сайт без аналітики — стрільба наосліп. Без даних не видно, де люди відсіюються. Перший місяць після запуску — найважливіший, і зазвичай його втрачають.",
            ],
          },
        ],
        faq: [
          {
            q: "Як часто оновлювати корпоративний сайт?",
            a: "Структурний аудит раз на 12–18 місяців, контент — постійно. Повний редизайн зазвичай кожні 3–4 роки.",
          },
          {
            q: "Достатньо шаблона чи треба сайт на замовлення?",
            a: "Шаблон годиться там, де конверсія і бренд не критичні. Якщо сайт — це канал продажу, шаблон у перспективі коштує дорожче.",
          },
        ],
      },
    },
  },
  {
    id: "ux-trust-conversion",
    publishedAt: "2026-03-04",
    readingMinutes: 8,
    related: ["common-website-mistakes-2026", "cost-of-quality-web"],
    i18n: {
      CZ: {
        slug: "ux-duvera-konverze",
        title: "Jak moderní UX ovlivňuje důvěru a konverze",
        excerpt:
          "Důvěra se na webu netvoří texty „proč my“. Tvoří se tisícem malých UX rozhodnutí, kterých si návštěvník nikdy nevšimne — a přesto je cítí.",
        category: "UX",
        lead:
          "Konverze není o triku ani o agresivním CTA. Konverze je výsledek důvěry, kterou si web musí zasloužit dřív, než cokoli žádá. Moderní UX je nástroj, jak tuhle důvěru postavit metodicky.",
        sections: [
          {
            heading: "Důvěra je nasčítaný dojem",
            paragraphs: [
              "Návštěvník v prvních vteřinách nevyhodnocuje obsah — vyhodnocuje signály. Typografie, kontrast, rytmus, kvalita fotek, plynulost interakcí.",
            ],
          },
          {
            heading: "Vizuální hierarchie = rozhodovací mapa",
            paragraphs: [
              "Dobré UX vede oko po stránce tam, kam má. Hierarchie nadpisů, barevné akcenty, white space rozhodují o tom, co vůbec dojde k vědomí.",
            ],
            list: [
              "Jeden primární CTA na obrazovku, ne tři",
              "Rozdíl mezi primárním a sekundárním CTA musí být na první pohled patrný",
              "Trust signály blízko CTA, ne v jiné sekci",
              "Formuláře krátké — ptejte se jen na to, co skutečně potřebujete",
            ],
          },
          {
            heading: "Rychlost je UX prvek",
            paragraphs: [
              "Každých 100 ms načítání = měřitelný pokles konverze. Performance dnes není jen technický KPI, je to UX rozhodnutí.",
            ],
          },
          {
            heading: "Mikrointerakce: malé, ale zásadní",
            paragraphs: [
              "Hover stavy, jemné přechody, loading indikátory, potvrzovací stavy — věci, kterých si návštěvník nevšimne, dokud nechybí.",
            ],
          },
          {
            heading: "Empatie ve formulářích",
            paragraphs: [
              "Formulář je moment, kdy klient nejvíc váhá. Každé extra políčko je důvod odejít. Validace v reálném čase, jasné chybové hlášky.",
            ],
          },
        ],
        faq: [
          {
            q: "Co je nejdůležitější UX prvek pro konverzi?",
            a: "Jasná hierarchie. Pokud návštěvník na první pohled neví, co je nejdůležitější, žádné další optimalizace to nezachrání.",
          },
          {
            q: "Jak měřit kvalitu UX?",
            a: "Kombinace kvantitativních dat (bounce rate, scroll depth, konverze) a kvalitativních (heatmapy, session recording, user testing).",
          },
        ],
      },
      EN: {
        slug: "ux-trust-conversion",
        title: "How modern UX shapes trust and conversion",
        excerpt:
          "Trust isn't built by \"why us\" copy. It's built by thousands of small UX decisions a visitor never notices — yet feels.",
        category: "UX",
        lead:
          "Conversion isn't a trick or an aggressive CTA. Conversion is the result of trust a site has to earn before it asks for anything. Modern UX is the tool that builds that trust methodically.",
        sections: [
          {
            heading: "Trust is a cumulative impression",
            paragraphs: [
              "In the first seconds visitors don't evaluate content — they evaluate signals. Typography, contrast, rhythm, image quality, smoothness of interactions.",
            ],
          },
          {
            heading: "Visual hierarchy = decision map",
            paragraphs: [
              "Good UX guides the eye where it should go. Heading hierarchy, colour accents and white space decide what even reaches awareness.",
            ],
            list: [
              "One primary CTA per screen, not three",
              "The gap between primary and secondary CTA must be obvious at a glance",
              "Trust signals near the CTA, not in a different section",
              "Short forms — ask only for what you really need",
            ],
          },
          {
            heading: "Speed is a UX element",
            paragraphs: [
              "Every 100 ms of load time is a measurable drop in conversion. Performance today isn't only a technical KPI — it's a UX decision.",
            ],
          },
          {
            heading: "Microinteractions: small but pivotal",
            paragraphs: [
              "Hover states, soft transitions, loading indicators, confirmation states — things visitors don't notice until they're missing.",
            ],
          },
          {
            heading: "Empathy in forms",
            paragraphs: [
              "Forms are the moment clients hesitate most. Every extra field is a reason to leave. Real-time validation, clear error messages, no surprises.",
            ],
          },
        ],
        faq: [
          {
            q: "What's the single most important UX element for conversion?",
            a: "A clear hierarchy. If visitors can't tell what matters most at a glance, no other optimisation will save it.",
          },
          {
            q: "How do you measure UX quality?",
            a: "A mix of quantitative data (bounce, scroll depth, completed conversions) and qualitative (heatmaps, session recording, user testing).",
          },
        ],
      },
      RU: {
        slug: "ux-doverie-konversiya",
        title: "Как современный UX формирует доверие и конверсию",
        excerpt:
          "Доверие создаётся не текстами «почему мы». Его строят тысячи мелких UX-решений, которых посетитель не замечает — но чувствует.",
        category: "UX",
        lead:
          "Конверсия — это не трюк и не агрессивный CTA. Конверсия — результат доверия, которое сайт должен заслужить, прежде чем о чём-то просить. Современный UX — инструмент, который выстраивает это доверие методично.",
        sections: [
          {
            heading: "Доверие — это сумма впечатлений",
            paragraphs: [
              "В первые секунды посетитель оценивает не контент, а сигналы: типографику, контраст, ритм, качество фото, плавность взаимодействий.",
            ],
          },
          {
            heading: "Визуальная иерархия = карта решений",
            paragraphs: [
              "Хороший UX ведёт взгляд туда, куда нужно. Иерархия заголовков, цветовые акценты, white space решают, что вообще дойдёт до сознания.",
            ],
            list: [
              "Один основной CTA на экран, а не три",
              "Разница между основным и вторичным CTA должна быть видна сразу",
              "Trust-сигналы рядом с CTA, а не в другом блоке",
              "Короткие формы — спрашивайте только то, что действительно нужно",
            ],
          },
          {
            heading: "Скорость — это элемент UX",
            paragraphs: [
              "Каждые 100 мс загрузки = измеримое падение конверсии. Производительность сегодня — не только техническая метрика, а UX-решение.",
            ],
          },
          {
            heading: "Микровзаимодействия: маленькие, но ключевые",
            paragraphs: [
              "Hover-состояния, мягкие переходы, индикаторы загрузки, состояния подтверждения — вещи, которых не замечаешь, пока их нет.",
            ],
          },
          {
            heading: "Эмпатия в формах",
            paragraphs: [
              "Форма — момент, когда клиент колеблется больше всего. Каждое лишнее поле — повод уйти. Валидация в реальном времени, понятные ошибки, никаких сюрпризов.",
            ],
          },
        ],
        faq: [
          {
            q: "Какой UX-элемент важнее всего для конверсии?",
            a: "Ясная иерархия. Если посетитель сразу не видит, что главное, никакие другие оптимизации не спасут.",
          },
          {
            q: "Как измерять качество UX?",
            a: "Сочетание количественных данных (bounce, scroll depth, завершённые конверсии) и качественных (heatmaps, session recording, user testing).",
          },
        ],
      },
      UA: {
        slug: "ux-dovira-konversiya",
        title: "Як сучасний UX формує довіру та конверсію",
        excerpt:
          "Довіра створюється не текстами «чому ми». Її будують тисячі дрібних UX-рішень, яких відвідувач не помічає — але відчуває.",
        category: "UX",
        lead:
          "Конверсія — це не трюк і не агресивний CTA. Конверсія — результат довіри, яку сайт має заслужити, перш ніж щось просити. Сучасний UX — інструмент, що будує цю довіру методично.",
        sections: [
          {
            heading: "Довіра — це сума вражень",
            paragraphs: [
              "У перші секунди відвідувач оцінює не контент, а сигнали: типографіку, контраст, ритм, якість фото, плавність взаємодій.",
            ],
          },
          {
            heading: "Візуальна ієрархія = карта рішень",
            paragraphs: [
              "Хороший UX веде погляд туди, куди треба. Ієрархія заголовків, кольорові акценти, white space вирішують, що взагалі дійде до свідомості.",
            ],
            list: [
              "Один основний CTA на екран, а не три",
              "Різниця між основним і вторинним CTA має бути видна одразу",
              "Trust-сигнали поряд із CTA, не в іншій секції",
              "Короткі форми — питайте лише те, що дійсно потрібно",
            ],
          },
          {
            heading: "Швидкість — це елемент UX",
            paragraphs: [
              "Кожні 100 мс завантаження = вимірне падіння конверсії. Продуктивність сьогодні — не лише технічна метрика, а UX-рішення.",
            ],
          },
          {
            heading: "Мікровзаємодії: малі, але ключові",
            paragraphs: [
              "Hover-стани, м'які переходи, індикатори завантаження, стани підтвердження — речі, яких не помічаєш, поки їх немає.",
            ],
          },
          {
            heading: "Емпатія у формах",
            paragraphs: [
              "Форма — момент, коли клієнт вагається найбільше. Кожне зайве поле — привід піти. Валідація в реальному часі, зрозумілі помилки, ніяких сюрпризів.",
            ],
          },
        ],
        faq: [
          {
            q: "Який UX-елемент найважливіший для конверсії?",
            a: "Чітка ієрархія. Якщо відвідувач одразу не бачить, що головне, інші оптимізації не врятують.",
          },
          {
            q: "Як виміряти якість UX?",
            a: "Поєднання кількісних даних (bounce, scroll depth, завершені конверсії) та якісних (heatmaps, session recording, user testing).",
          },
        ],
      },
    },
  },
  {
    id: "cost-of-quality-web",
    publishedAt: "2026-02-18",
    readingMinutes: 9,
    related: ["common-website-mistakes-2026", "ux-trust-conversion"],
    i18n: {
      CZ: {
        slug: "kolik-stoji-kvalitni-web",
        title: "Kolik stojí kvalitní web a proč levné řešení často nestačí",
        excerpt:
          "Otevřený rozhovor o cenách, rozpočtech a o tom, proč nejlevnější nabídka skoro vždy vyjde nejdráž.",
        category: "Byznys",
        lead:
          "„Kolik to bude stát?“ je první otázka každého klienta — a zaslouží si poctivou odpověď, ne marketingovou. V tomhle článku rozebíráme reálné rozpočty českého trhu.",
        sections: [
          {
            heading: "Tři cenové úrovně, které dnes existují",
            paragraphs: ["Trh se v praxi rozpadl do tří jasných pásem. Každé má své opodstatnění."],
            list: [
              "Šablonové weby (5–25 000 Kč): rychlé, vizuálně omezené.",
              "Profesionální weby na míru (60–200 000 Kč): vlastní design, UX strategie, výkon a SEO jako standard.",
              "Komplexní digitální projekty (200 000 Kč+): e-commerce, integrace, vícejazyčné weby.",
            ],
          },
          {
            heading: "Proč levné řešení vyjde dráž",
            paragraphs: [
              "Levný web typicky neřeší strategii. Jen překlopí požadavky do šablony.",
              "Za rok končíte u redesignu. Zaplatíte podruhé — často víc, protože je třeba opravit i základ.",
            ],
          },
          {
            heading: "Co se skrývá v ceně kvalitního webu",
            paragraphs: ["Když mluvíme o 100–150 tisících, je dobré vědět, za co konkrétně klient platí."],
            list: [
              "Strategická příprava: workshop, výzkum, definice cílů a KPI",
              "UX architektura a klikatelný prototyp",
              "Vlastní vizuální systém — typografie, barvy, ikonografie",
              "Vývoj postavený na výkonu, SEO a přístupnosti",
              "Měření, analytika a 30 dní podpory po spuštění",
            ],
          },
          {
            heading: "Návratnost: jak to spočítat",
            paragraphs: [
              "Pokud váš klient přinese 30 000 Kč obratu a web vám přivede tři měsíčně, návratnost 120 000 Kč je 1,3 měsíce.",
            ],
          },
        ],
        faq: [
          {
            q: "Můžu začít s levným webem a později upgradovat?",
            a: "V principu ano, ale prakticky vyjde stejně draho jako rovnou postavit kvalitní web.",
          },
          {
            q: "Jak dlouho trvá kvalitní web?",
            a: "Standardní firemní web 6–10 týdnů. E-shop typicky 10–14 týdnů.",
          },
        ],
      },
      EN: {
        slug: "cost-of-a-quality-website",
        title: "What a quality website actually costs — and why cheap often isn't",
        excerpt:
          "An honest take on budgets and why the cheapest quote almost always ends up costing the most.",
        category: "Business",
        lead:
          "\"How much will it cost?\" is the first question every client asks — and it deserves an honest answer, not a marketing one. Here are the real budget tiers we see on the market.",
        sections: [
          {
            heading: "Three price tiers that exist today",
            paragraphs: ["The market splits into three clear bands. Each has its place."],
            list: [
              "Template sites (€200–1k): fast, limited visually.",
              "Professional custom websites (€2.5k–8k): own design, UX strategy, performance and SEO as a standard.",
              "Complex digital projects (€8k+): e-commerce, integrations, multilingual.",
            ],
          },
          {
            heading: "Why cheap ends up more expensive",
            paragraphs: [
              "Cheap sites don't address strategy — they just push requirements into a template.",
              "Within a year you're paying for a redesign. Often more, because the foundation needs fixing too.",
            ],
          },
          {
            heading: "What's actually inside a quality website price",
            paragraphs: ["When you spend €4–6k on a website, here's what that money is buying."],
            list: [
              "Strategic prep: workshop, research, goals and KPI",
              "UX architecture and clickable prototype before development",
              "Custom visual system — typography, colours, iconography",
              "Build optimised for performance, SEO and accessibility",
              "Measurement, analytics and 30 days of post-launch support",
            ],
          },
          {
            heading: "Return on investment",
            paragraphs: [
              "If your average client is worth €1.2k and the site brings three a month, a €5k investment pays back in just over a month.",
            ],
          },
        ],
        faq: [
          {
            q: "Can I start cheap and upgrade later?",
            a: "In theory yes, in practice it usually costs the same as building it properly from the start.",
          },
          {
            q: "How long does a quality website take?",
            a: "A standard corporate site takes 6–10 weeks. An e-shop typically 10–14 weeks.",
          },
        ],
      },
      RU: {
        slug: "skolko-stoit-kachestvennyy-sayt",
        title: "Сколько стоит качественный сайт — и почему дешёвое решение часто дороже",
        excerpt:
          "Откровенный разговор о бюджетах и о том, почему самое дешёвое предложение почти всегда выходит дороже всего.",
        category: "Бизнес",
        lead:
          "«Сколько это будет стоить?» — первый вопрос любого клиента. Он заслуживает честного ответа, а не маркетингового. Разбираем реальные бюджеты рынка.",
        sections: [
          {
            heading: "Три ценовых уровня",
            paragraphs: ["Рынок делится на три чётких диапазона. У каждого есть своё место."],
            list: [
              "Шаблонные сайты (200–1000 €): быстро, визуально ограниченно.",
              "Профессиональные сайты на заказ (2,5–8 тыс. €): свой дизайн, UX-стратегия, производительность и SEO как стандарт.",
              "Сложные digital-проекты (8 тыс. €+): e-commerce, интеграции, мультиязычность.",
            ],
          },
          {
            heading: "Почему дёшево выходит дорого",
            paragraphs: [
              "Дешёвые сайты не работают со стратегией — они просто переносят пожелания в шаблон.",
              "Через год вы платите за редизайн. Часто больше, потому что нужно чинить и основу.",
            ],
          },
          {
            heading: "Что входит в цену качественного сайта",
            paragraphs: ["Когда речь о 4–6 тыс. €, важно понимать, за что конкретно платит клиент."],
            list: [
              "Стратегическая подготовка: воркшоп, исследование, цели и KPI",
              "UX-архитектура и кликабельный прототип до разработки",
              "Свой визуальный язык — типографика, цвета, иконография",
              "Разработка с фокусом на скорость, SEO и доступность",
              "Аналитика и 30 дней поддержки после запуска",
            ],
          },
          {
            heading: "Возврат инвестиций",
            paragraphs: [
              "Если ваш клиент в среднем приносит 1200 €, а сайт даёт трёх в месяц, инвестиция в 5000 € окупается чуть больше чем за месяц.",
            ],
          },
        ],
        faq: [
          {
            q: "Можно начать дёшево и улучшить позже?",
            a: "Теоретически да, на практике это стоит примерно столько же, сколько сделать качественно сразу.",
          },
          {
            q: "Сколько занимает качественный сайт?",
            a: "Стандартный корпоративный — 6–10 недель. E-shop обычно 10–14 недель.",
          },
        ],
      },
      UA: {
        slug: "skilky-koshtuye-yakisnyy-sayt",
        title: "Скільки коштує якісний сайт — і чому дешеве рішення часто дорожче",
        excerpt:
          "Відверта розмова про бюджети та про те, чому найдешевша пропозиція майже завжди виходить найдорожче.",
        category: "Бізнес",
        lead:
          "«Скільки це коштуватиме?» — перше питання будь-якого клієнта. Воно заслуговує на чесну відповідь, а не маркетингову. Розглядаємо реальні бюджети ринку.",
        sections: [
          {
            heading: "Три цінові рівні",
            paragraphs: ["Ринок ділиться на три чіткі діапазони. Кожен має своє місце."],
            list: [
              "Шаблонні сайти (200–1000 €): швидко, візуально обмежено.",
              "Професійні сайти на замовлення (2,5–8 тис. €): власний дизайн, UX-стратегія, продуктивність і SEO як стандарт.",
              "Складні digital-проєкти (8 тис. €+): e-commerce, інтеграції, мультимовність.",
            ],
          },
          {
            heading: "Чому дешево виходить дорого",
            paragraphs: [
              "Дешеві сайти не працюють зі стратегією — вони просто переносять побажання в шаблон.",
              "За рік ви платите за редизайн. Часто більше, бо треба ремонтувати й основу.",
            ],
          },
          {
            heading: "Що входить у ціну якісного сайту",
            paragraphs: ["Коли йдеться про 4–6 тис. €, варто розуміти, за що саме платить клієнт."],
            list: [
              "Стратегічна підготовка: воркшоп, дослідження, цілі та KPI",
              "UX-архітектура і клікабельний прототип до розробки",
              "Власна візуальна мова — типографіка, кольори, іконографіка",
              "Розробка з фокусом на швидкість, SEO та доступність",
              "Аналітика і 30 днів підтримки після запуску",
            ],
          },
          {
            heading: "Повернення інвестицій",
            paragraphs: [
              "Якщо ваш клієнт у середньому приносить 1200 €, а сайт дає трьох на місяць, інвестиція в 5000 € окупається трохи більше ніж за місяць.",
            ],
          },
        ],
        faq: [
          {
            q: "Можна почати дешево і покращити пізніше?",
            a: "Теоретично так, на практиці це коштує приблизно стільки ж, як зробити якісно одразу.",
          },
          {
            q: "Скільки триває якісний сайт?",
            a: "Стандартний корпоративний — 6–10 тижнів. E-shop зазвичай 10–14 тижнів.",
          },
        ],
      },
    },
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Locale-aware helpers
// ──────────────────────────────────────────────────────────────────────────────

const DEFAULT_LANG: Lang = "CZ";

function resolve(insight: Insight, lang: Lang): ResolvedInsight {
  const localized = insight.i18n[lang] ?? insight.i18n[DEFAULT_LANG];
  const { i18n: _i18n, ...meta } = insight;
  return { ...meta, ...localized };
}

/** All articles resolved into the requested language. */
export function getInsightsForLang(lang: Lang): ResolvedInsight[] {
  return INSIGHTS.map((i) => resolve(i, lang));
}

/**
 * Find an article by ANY of its locale slugs.
 * Returns the article resolved into the language whose slug matched, so the
 * URL and the rendered content always stay aligned.
 */
export function getInsightByAnySlug(slug: string): ResolvedInsight | undefined {
  for (const insight of INSIGHTS) {
    for (const lang of Object.keys(insight.i18n) as Lang[]) {
      if (insight.i18n[lang].slug === slug) return resolve(insight, lang);
    }
  }
  return undefined;
}

/** Look up an article by canonical id, resolved into a language. */
export function getInsightById(id: string, lang: Lang): ResolvedInsight | undefined {
  const insight = INSIGHTS.find((i) => i.id === id);
  return insight ? resolve(insight, lang) : undefined;
}

/** Every slug across every locale — used for the sitemap. */
export const ALL_INSIGHT_SLUGS: string[] = INSIGHTS.flatMap((i) =>
  (Object.keys(i.i18n) as Lang[]).map((l) => i.i18n[l].slug),
);
