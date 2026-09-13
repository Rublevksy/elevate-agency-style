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
