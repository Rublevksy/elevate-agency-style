/**
 * DEVELOPMENT ONLY — five hand-written concepts for a FICTIONAL brief.
 *
 * Loaded solely by `/builder?fixture=1` when `import.meta.env.DEV` is true
 * (the import sits behind that constant, so production builds drop this file).
 * It exists to QA the renderer, gallery, viewer and contact flow without a
 * model key. It is not model output, and the UI labels it as a fixture.
 *
 * The fixtures go through `parseDraft` + `assessDistinctness` like real output,
 * so they double as a check that the pipeline accepts a well-formed set.
 */
import type { Brief } from "./brief";
import type { DesignSpecDraft } from "./spec";

export const FIXTURE_BRIEF: Brief = {
  projectType: "eshop",
  project: {
    company: "Pražírna Lípa",
    industry: "Pražírna výběrové kávy",
    offering:
      "Malá pražírna, která praží výběrovou kávu v malých várkách, prodává ji online i v kavárně a nabízí předplatné pro domácnosti a kanceláře.",
    audience: "Lidé, kteří si kávu připravují doma a chtějí vědět, odkud pochází",
    goal: "Prodej kávy a předplatného online",
  },
  visual: {
    style: "Poctivý, řemeslný, ne přeslazený",
    mood: "Klidná rána",
    colors: "Teplé zemité tóny",
    typography: "",
    notes: "",
  },
  references: { urls: [], notes: "" },
};

const d = (x: DesignSpecDraft) => x;

export const FIXTURE_DRAFTS: DesignSpecDraft[] = [
  d({
    name: "Ranní rituál",
    archetype: "editorial",
    positioning: "Pražírna jako časopis o kávě — příběh původu je stejně důležitý jako balíček.",
    rationale:
      "Publikum chce vědět, odkud káva pochází. Editoriální rytmus s velkou typografií dává prostor příběhu a zpomaluje čtení jako ranní šálek.",
    keywords: ["příběh", "papír", "klid"],
    palette: {
      background: "#f4efe6",
      surface: "#ebe3d6",
      text: "#1d1a16",
      muted: "#655d53",
      accent: "#9a4a24",
      onAccent: "#ffffff",
    },
    typography: {
      display: "editorial-serif",
      body: "serif",
      scale: "monumental",
      displayWeight: "regular",
      displayCase: "sentence",
      tracking: "tight",
    },
    layout: {
      navigation: "centered-logo",
      hero: "typographic",
      grid: "asymmetric",
      density: "airy",
      width: "contained",
    },
    surface: { radius: "none", borders: "hairline", depth: "flat" },
    imagery: {
      style: "photography",
      treatment: "natural",
      subject: "Ruce nad pražicím bubnem v ranním světle",
    },
    motion: { level: "calm", signature: "fade-rise" },
    copy: {
      headline: "Káva, která zpomalí ráno.",
      subheadline:
        "Pražíme v malých várkách a ke každé kávě píšeme, odkud přišla a jak ji připravit.",
      primaryCta: "Vybrat kávu",
      secondaryCta: "Náš příběh",
      nav: ["Kávy", "Předplatné", "Příběhy", "Kavárna"],
    },
    sections: [
      {
        kind: "story",
        eyebrow: "Z pražírny",
        title: "Každá várka má svůj záznam",
        items: [
          { title: "Původ", text: "U každé kávy uvádíme farmu a oblast, ze které pochází." },
          {
            title: "Pražení",
            text: "Pražíme v malých várkách, abychom chuť udrželi pod kontrolou.",
          },
        ],
      },
      {
        kind: "services",
        title: "Jak si kávu dopřát",
        items: [
          { title: "Jednorázový nákup", text: "Balíčky zrnkové i mleté kávy." },
          { title: "Předplatné domů", text: "Čerstvě pražená káva v pravidelném rytmu." },
          { title: "Pro kanceláře", text: "Káva pro týmy, které ji pijí rády." },
        ],
      },
      { kind: "gallery", title: "Z kavárny a pražírny" },
      {
        kind: "cta",
        title: "Najděte svou ranní kávu",
        body: "Pomůžeme vám vybrat podle chuti i způsobu přípravy.",
      },
    ],
  }),
  d({
    name: "Tichý luxus",
    archetype: "luxury-minimal",
    positioning: "Výběrová káva jako tichý luxusní předmět — málo slov, hodně prostoru.",
    rationale:
      "Pro zákazníky, kteří vnímají kávu jako zážitek, funguje zdrženlivost. Tmavá scéna a monochromní fotografie posunou pražírnu k prémiovému vnímání.",
    keywords: ["ticho", "tma", "detail"],
    palette: {
      background: "#0f0e0c",
      surface: "#1a1815",
      text: "#f3efe8",
      muted: "#a39c92",
      accent: "#c8a46a",
      onAccent: "#111111",
    },
    typography: {
      display: "modern-grotesk",
      body: "sans",
      scale: "confident",
      displayWeight: "light",
      displayCase: "sentence",
      tracking: "tight",
    },
    layout: {
      navigation: "minimal-menu",
      hero: "full-bleed-media",
      grid: "centered",
      density: "airy",
      width: "wide",
    },
    surface: { radius: "subtle", borders: "none", depth: "soft-shadow" },
    imagery: {
      style: "photography",
      treatment: "monochrome",
      subject: "Detail šálku a páry v tlumeném světle",
    },
    motion: { level: "calm", signature: "scale-in" },
    copy: {
      headline: "Pražená pro ticho prvního doušku.",
      subheadline: "Výběrová káva z malých várek, připravená k tomu, abyste se u ní zastavili.",
      primaryCta: "Prohlédnout kávy",
      nav: ["Kávy", "Předplatné", "Kavárna"],
    },
    sections: [
      {
        kind: "showcase",
        eyebrow: "Výběr",
        title: "Méně druhů, více pozornosti",
        items: [
          { title: "Sezónní výběr", text: "Kávy se mění podle toho, co je právě nejlepší." },
          { title: "Pečlivé balení", text: "Balíček, který chrání aroma." },
        ],
      },
      {
        kind: "process",
        title: "Od zrna k šálku",
        items: [
          { title: "Výběr", text: "Hledáme kávy s jasným původem." },
          { title: "Pražení", text: "Malé várky, pečlivý profil." },
          { title: "Doručení", text: "Čerstvě po upražení." },
        ],
      },
      { kind: "cta", title: "Začněte předplatným" },
    ],
  }),
  d({
    name: "Pražírna nahlas",
    archetype: "bold-statement",
    positioning: "Sebevědomá pražírna s názorem — káva, o které se mluví.",
    rationale:
      "Odlišuje pražírnu od uhlazených konkurentů výraznou typografií a kontrastem. Hodí se, pokud chce značka oslovit mladší publikum a být vidět.",
    keywords: ["energie", "kontrast", "názor"],
    palette: {
      background: "#111111",
      surface: "#1d1d1d",
      text: "#fafafa",
      muted: "#b5b5b5",
      accent: "#ff5a1f",
      onAccent: "#111111",
    },
    typography: {
      display: "condensed",
      body: "sans",
      scale: "monumental",
      displayWeight: "black",
      displayCase: "uppercase",
      tracking: "normal",
    },
    layout: {
      navigation: "bar",
      hero: "centered-statement",
      grid: "structured",
      density: "compact",
      width: "wide",
    },
    surface: { radius: "none", borders: "strong", depth: "flat" },
    imagery: {
      style: "texture",
      treatment: "high-contrast",
      subject: "Zrnka kávy zblízka v ostrém světle",
    },
    motion: { level: "expressive", signature: "slide-reveal" },
    copy: {
      headline: "Káva bez kompromisů",
      subheadline: "Pražíme to, co bychom sami pili každý den. Vyberte si a ochutnejte rozdíl.",
      primaryCta: "Do obchodu",
      secondaryCta: "Předplatné",
      nav: ["Obchod", "Předplatné", "Pražírna", "Kontakt"],
    },
    sections: [
      {
        kind: "features",
        title: "Proč Lípa",
        items: [
          { title: "Malé várky", text: "Každá várka pod dohledem." },
          { title: "Jasný původ", text: "Víme, odkud káva je." },
          { title: "Čerstvost", text: "Posíláme brzy po upražení." },
        ],
      },
      {
        kind: "products",
        title: "Aktuální kávy",
        items: [
          { title: "Espresso směs", text: "Pro kávovar" },
          { title: "Filtr sezónní", text: "Pro překapávač" },
          { title: "Bezkofeinová", text: "Na večer" },
          { title: "Degustační sada", text: "Tři kávy" },
        ],
      },
      { kind: "cta", title: "Ochutnejte rozdíl" },
    ],
  }),
  d({
    name: "Káva domů",
    archetype: "conversion",
    positioning: "Nejjednodušší cesta od výběru kávy k pravidelnému předplatnému.",
    rationale:
      "Cílem je prodej a předplatné, proto směr staví produkty a jasné výzvy k akci hned do prvního pohledu a vede zákazníka krok za krokem.",
    keywords: ["jasnost", "důvěra", "nákup"],
    palette: {
      background: "#ffffff",
      surface: "#f2f5f3",
      text: "#14213d",
      muted: "#55606f",
      accent: "#1f7a4d",
      onAccent: "#ffffff",
    },
    typography: {
      display: "geometric",
      body: "sans",
      scale: "confident",
      displayWeight: "semibold",
      displayCase: "sentence",
      tracking: "normal",
    },
    layout: {
      navigation: "split-cta",
      hero: "product-stage",
      grid: "structured",
      density: "balanced",
      width: "contained",
    },
    surface: { radius: "rounded", borders: "hairline", depth: "soft-shadow" },
    imagery: {
      style: "product-cutout",
      treatment: "natural",
      subject: "Balíček kávy na čistém pozadí",
    },
    motion: { level: "moderate", signature: "fade-rise" },
    copy: {
      headline: "Čerstvá káva až k vašim dveřím",
      subheadline:
        "Vyberte si kávu nebo nastavte předplatné. Pražíme v malých várkách a posíláme po upražení.",
      primaryCta: "Nastavit předplatné",
      secondaryCta: "Koupit jednou",
      nav: ["Kávy", "Předplatné", "Pro firmy", "O nás"],
    },
    sections: [
      {
        kind: "products",
        eyebrow: "Obchod",
        title: "Oblíbené kávy",
        items: [
          { title: "Brazílie", text: "Čokoláda, oříšky" },
          { title: "Etiopie", text: "Květiny, citrus" },
          { title: "Kolumbie", text: "Karamel, švestka" },
          { title: "Espresso směs", text: "Plné tělo" },
        ],
      },
      {
        kind: "process",
        title: "Předplatné ve třech krocích",
        items: [
          { title: "Vyberte kávu", text: "Podle chuti nebo přípravy." },
          { title: "Zvolte rytmus", text: "Jak často chcete kávu dostávat." },
          { title: "Užívejte si", text: "Změnit nebo pozastavit jde kdykoli." },
        ],
      },
      {
        kind: "features",
        title: "Nakupování bez starostí",
        items: [
          { title: "Čerstvě pražená", text: "Posíláme brzy po upražení." },
          { title: "Flexibilní předplatné", text: "Bez závazků." },
        ],
      },
      { kind: "cta", title: "Vaše první balení čeká" },
    ],
  }),
  d({
    name: "Chuť krajiny",
    archetype: "warm-human",
    positioning: "Pražírna jako přátelské místo, kde se o kávě povídá s lidmi, kteří ji dělají.",
    rationale:
      "Teplé barvy, zaoblené tvary a ilustrace vytvářejí dojem blízkosti. Směr podporuje vztah se zákazníky, kteří se k pražírně rádi vracejí.",
    keywords: ["teplo", "lidé", "řemeslo"],
    palette: {
      background: "#f7ede2",
      surface: "#efe0cf",
      text: "#2b2118",
      muted: "#6a5646",
      accent: "#b8561f",
      onAccent: "#ffffff",
    },
    typography: {
      display: "rounded-humanist",
      body: "sans",
      scale: "confident",
      displayWeight: "semibold",
      displayCase: "sentence",
      tracking: "normal",
    },
    layout: {
      navigation: "bar",
      hero: "offset-collage",
      grid: "centered",
      density: "balanced",
      width: "contained",
    },
    surface: { radius: "pill", borders: "none", depth: "layered" },
    imagery: {
      style: "illustration",
      treatment: "duotone",
      subject: "Ilustrace kávové krajiny a sběru zrn",
    },
    motion: { level: "moderate", signature: "parallax-layers" },
    copy: {
      headline: "Káva s tváří lidí, kteří ji praží",
      subheadline: "Přijďte do kavárny, nebo si nás objednejte domů. Rádi poradíme, co ochutnat.",
      primaryCta: "Ochutnat",
      secondaryCta: "Navštívit kavárnu",
      nav: ["Kávy", "Kavárna", "Předplatné", "Kontakt"],
    },
    sections: [
      {
        kind: "story",
        title: "Pražírna za rohem",
        items: [
          { title: "Lidé", text: "Kávu pražíme sami a rádi o ní mluvíme." },
          { title: "Místo", text: "Kavárna, kde můžete ochutnat, než si vyberete." },
        ],
      },
      {
        kind: "services",
        title: "Co u nás najdete",
        items: [
          { title: "Kávy domů", text: "Zrnková i mletá káva." },
          { title: "Předplatné", text: "Pravidelná dávka čerstvé kávy." },
          { title: "Kavárna", text: "Místo pro chvíli nad šálkem." },
        ],
      },
      { kind: "gallery", title: "Z našeho dne" },
      { kind: "cta", title: "Zastavte se na kávu" },
    ],
  }),
];

/**
 * Set B (`/builder?fixture=b`) — a second fictional brief, in Ukrainian, built
 * to reach every renderer path set A does not: the split-media hero (twice,
 * structured and centered grids), mono display and body faces, the restrained
 * scale, abstract-shapes and type-only imagery. It also carries the edge cases
 * a model will produce: a headline near its 90-character limit, sections with
 * no items, products without items, four-column features, five nav items, a
 * split-cta navigation without a secondary CTA, and Cyrillic in every face.
 */
export const FIXTURE_BRIEF_B: Brief = {
  projectType: "web",
  project: {
    company: "Студія Шари",
    industry: "Архітектурне бюро",
    offering:
      "Невелике архітектурне бюро, яке проєктує приватні будинки та інтер'єри і супроводжує будівництво від ескізу до здачі.",
    audience: "Родини, які планують будувати власний дім",
    goal: "Запити на консультацію щодо проєкту",
  },
  visual: { style: "Точний, спокійний", mood: "Впевнений", colors: "", typography: "", notes: "" },
  references: { urls: [], notes: "" },
};

export const FIXTURE_DRAFTS_B: DesignSpecDraft[] = [
  d({
    name: "Креслення",
    archetype: "technical-precise",
    positioning: "Бюро як точний інструмент — кожне рішення видно, як на кресленні.",
    rationale:
      "Родини, які будують дім, шукають передбачуваність. Моноширинна типографіка і сувора сітка передають точність і контроль над процесом.",
    keywords: ["точність", "сітка", "процес"],
    palette: {
      background: "#f5f5f2",
      surface: "#eaeae5",
      text: "#111111",
      muted: "#55554f",
      accent: "#2f5bea",
      onAccent: "#ffffff",
    },
    typography: {
      display: "mono",
      body: "mono",
      scale: "restrained",
      displayWeight: "semibold",
      displayCase: "sentence",
      tracking: "tight",
    },
    layout: {
      navigation: "split-cta",
      hero: "split-media",
      grid: "structured",
      density: "compact",
      width: "wide",
    },
    surface: { radius: "none", borders: "hairline", depth: "flat" },
    imagery: {
      style: "abstract-shapes",
      treatment: "monochrome",
      subject: "Аксонометрія будинку, лінії та площини",
    },
    motion: { level: "calm", signature: "slide-reveal" },
    copy: {
      headline:
        "Дім, спроєктований так само точно, як його креслення від першої лінії до останньої деталі",
      subheadline: "Проєктуємо приватні будинки та інтер'єри і супроводжуємо будівництво до здачі.",
      primaryCta: "Замовити консультацію",
      nav: ["Проєкти", "Процес", "Бюро", "Контакт"],
    },
    sections: [
      {
        kind: "features",
        eyebrow: "Підхід",
        title: "Що отримує замовник",
        items: [
          { title: "Ескіз", text: "Перші варіанти планування." },
          { title: "Проєкт", text: "Повна документація для будівництва." },
          { title: "Інтер'єр", text: "Матеріали, світло, меблі." },
          { title: "Нагляд", text: "Супровід на будмайданчику." },
        ],
      },
      {
        kind: "process",
        title: "Як ми працюємо",
        items: [
          { title: "Знайомство", text: "Розмова про ваш спосіб життя." },
          { title: "Концепція", text: "Об'єм, світло, орієнтація." },
          { title: "Документація", text: "Креслення для підрядника." },
          { title: "Будівництво", text: "Авторський нагляд." },
        ],
      },
      { kind: "cta", title: "Почнімо з розмови" },
    ],
  }),
  d({
    name: "Світло і маса",
    archetype: "immersive-visual",
    positioning: "Архітектура, яку спершу відчувають, а вже потім читають.",
    rationale:
      "Великі зображення і темна сцена занурюють у простір. Напрям підходить, якщо бюро хоче, щоб роботи говорили самі за себе.",
    keywords: ["простір", "світло", "тиша"],
    palette: {
      background: "#0d1411",
      surface: "#16201b",
      text: "#eef4f0",
      muted: "#9fb3a8",
      accent: "#7fd4a8",
      onAccent: "#0d1411",
    },
    typography: {
      display: "geometric",
      body: "sans",
      scale: "confident",
      displayWeight: "black",
      displayCase: "uppercase",
      tracking: "wide",
    },
    layout: {
      navigation: "minimal-menu",
      hero: "split-media",
      grid: "centered",
      density: "airy",
      width: "contained",
    },
    surface: { radius: "rounded", borders: "none", depth: "layered" },
    imagery: {
      style: "photography",
      treatment: "duotone",
      subject: "Вітальня з великим вікном на світанку",
    },
    motion: { level: "expressive", signature: "parallax-layers" },
    copy: {
      headline: "Простір, у якому хочеться жити",
      subheadline: "Будинки та інтер'єри, спроєктовані навколо світла і ваших звичок.",
      primaryCta: "Переглянути проєкти",
      secondaryCta: "Написати нам",
      nav: ["Проєкти", "Бюро", "Контакт"],
    },
    sections: [
      {
        kind: "showcase",
        title: "Будинок, що відкривається до саду",
        items: [
          { title: "Світло", text: "Орієнтація кімнат за сонцем." },
          { title: "Матеріал", text: "Дерево, камінь, вапно." },
        ],
      },
      { kind: "gallery", title: "Деталі наших проєктів" },
      {
        kind: "story",
        title: "Бюро, яке слухає",
        body: "Кожен проєкт починаємо з того, як ви живете, а не з того, як виглядає фасад.",
      },
      { kind: "cta", title: "Розкажіть про свій дім" },
    ],
  }),
  d({
    name: "Тиша матеріалу",
    archetype: "luxury-minimal",
    positioning: "Мінімум слів, максимум уваги до матеріалу і пропорцій.",
    rationale:
      "Стримана типографіка з антиквою і майже порожня сторінка підкреслюють якість. Напрям для клієнтів, які цінують спокій більше за ефекти.",
    keywords: ["пропорція", "матеріал", "спокій"],
    palette: {
      background: "#ece7df",
      surface: "#e2dbd0",
      text: "#1f1b16",
      muted: "#5f574d",
      accent: "#6b4f3a",
      onAccent: "#ffffff",
    },
    typography: {
      display: "editorial-serif",
      body: "serif",
      scale: "confident",
      displayWeight: "light",
      displayCase: "sentence",
      tracking: "normal",
    },
    layout: {
      navigation: "centered-logo",
      hero: "centered-statement",
      grid: "centered",
      density: "airy",
      width: "contained",
    },
    surface: { radius: "none", borders: "none", depth: "flat" },
    imagery: {
      style: "type-only",
      treatment: "natural",
      subject: "Типографічна композиція з ініціалом бюро",
    },
    motion: { level: "calm", signature: "fade-rise" },
    copy: {
      headline: "Архітектура тиші",
      subheadline: "Приватні будинки та інтер'єри з увагою до матеріалу.",
      primaryCta: "Домовитися про зустріч",
      nav: ["Бюро", "Проєкти", "Контакт"],
    },
    sections: [
      {
        kind: "services",
        title: "Що ми робимо",
        body: "Проєктування будинків, інтер'єрів і супровід будівництва.",
      },
      { kind: "products", title: "Вибрані роботи" },
      { kind: "cta", title: "Зустріньмося" },
    ],
  }),
  d({
    name: "Відкрита студія",
    archetype: "playful-vivid",
    positioning: "Бюро, з яким будувати дім весело, а не страшно.",
    rationale:
      "Яскравий колір і округлі форми знімають напругу, яку викликає будівництво. Напрям для молодих родин, які будують вперше.",
    keywords: ["легкість", "колір", "відкритість"],
    palette: {
      background: "#ffe14d",
      surface: "#fff0a6",
      text: "#1a1400",
      muted: "#4a3f00",
      accent: "#1a1400",
      onAccent: "#ffe14d",
    },
    typography: {
      display: "rounded-humanist",
      body: "sans",
      scale: "monumental",
      displayWeight: "black",
      displayCase: "sentence",
      tracking: "tight",
    },
    layout: {
      navigation: "bar",
      hero: "typographic",
      grid: "asymmetric",
      density: "compact",
      width: "wide",
    },
    surface: { radius: "pill", borders: "strong", depth: "flat" },
    imagery: {
      style: "illustration",
      treatment: "high-contrast",
      subject: "Ілюстрація будинку з садом і родиною",
    },
    motion: { level: "expressive", signature: "scale-in" },
    copy: {
      headline: "Будуємо ваш перший дім разом",
      subheadline: "Пояснюємо кожен крок простими словами і малюємо, поки не стане зрозуміло.",
      primaryCta: "Почати",
      secondaryCta: "Як це працює",
      nav: ["Проєкти", "Процес", "Бюро", "Питання", "Контакт"],
    },
    sections: [
      {
        kind: "features",
        title: "Чому з нами простіше",
        items: [
          { title: "Зрозуміло", text: "Без складних термінів." },
          { title: "Наочно", text: "Малюємо кожне рішення." },
          { title: "Поруч", text: "На зв'язку весь час." },
        ],
      },
      { kind: "gallery", title: "Будинки, які ми намалювали" },
      {
        kind: "process",
        title: "Два кроки до початку",
        items: [
          { title: "Зустріч", text: "Розкажіть, як живете." },
          { title: "Ескіз", text: "Показуємо перші ідеї." },
        ],
      },
      { kind: "cta", title: "Намалюймо ваш дім" },
    ],
  }),
  d({
    name: "Чиста заявка",
    archetype: "conversion",
    positioning: "Найкоротший шлях від першого враження до запиту на консультацію.",
    rationale:
      "Мета — запити, тому напрям одразу показує послуги й заклик до дії та прибирає все, що відволікає від форми.",
    keywords: ["ясність", "дія", "довіра"],
    palette: {
      background: "#ffffff",
      surface: "#f3f5f7",
      text: "#0b1b2b",
      muted: "#4c5a68",
      accent: "#e4572e",
      onAccent: "#ffffff",
    },
    typography: {
      display: "modern-grotesk",
      body: "sans",
      scale: "confident",
      displayWeight: "semibold",
      displayCase: "sentence",
      tracking: "normal",
    },
    layout: {
      navigation: "split-cta",
      hero: "full-bleed-media",
      grid: "structured",
      density: "balanced",
      width: "wide",
    },
    surface: { radius: "subtle", borders: "hairline", depth: "soft-shadow" },
    imagery: {
      style: "product-cutout",
      treatment: "monochrome",
      subject: "Макет будинку на світлому столі",
    },
    motion: { level: "moderate", signature: "fade-rise" },
    copy: {
      headline: "Проєкт вашого будинку — від першої консультації до ключів",
      subheadline:
        "Залиште запит, і архітектор зв'яжеться з вами, щоб обговорити ділянку та побажання.",
      primaryCta: "Залишити запит",
      secondaryCta: "Послуги",
      nav: ["Послуги", "Проєкти", "Бюро", "Контакт"],
    },
    sections: [
      {
        kind: "products",
        title: "Типи проєктів",
        items: [
          { title: "Приватний будинок", text: "Від ескізу до документації" },
          { title: "Реконструкція", text: "Нове життя старого дому" },
          { title: "Інтер'єр", text: "Повний дизайн-проєкт" },
          { title: "Нагляд", text: "Супровід будівництва" },
        ],
      },
      {
        kind: "features",
        title: "Що входить у консультацію",
        items: [
          { title: "Огляд ділянки", text: "Обмеження та можливості." },
          { title: "Ваші побажання", text: "Склад родини, спосіб життя." },
        ],
      },
      { kind: "cta", title: "Обговорімо ваш будинок" },
    ],
  }),
];
