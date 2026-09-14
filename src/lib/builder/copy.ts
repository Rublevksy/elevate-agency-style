/**
 * Builder interface copy, CZ / EN / RU / UA.
 *
 * Feature-local on purpose, like `ExitIntentModal`'s COPY: none of these strings
 * exists in `i18n.ts`. Strings that DO exist are read from there instead of
 * being duplicated — contact labels and placeholders, and the budget ranges
 * (`t.contact.form.*`), so the Builder and the /contact stepper cannot drift.
 *
 * No claim appears here that the business has not verified: no response-time
 * promise, no counts, no guarantees.
 */
import type { Lang } from "@/lib/i18n";
import type { BuilderErrorCode } from "./errors";

type Field = { label: string; placeholder: string; hint?: string };

export type BuilderCopy = {
  meta: { title: string; description: string };
  intro: { eyebrow: string; title: string; lead: string };
  steps: [string, string, string, string, string, string];
  stepOf: (n: number, total: number) => string;
  optional: string;
  back: string;
  next: string;
  startOver: string;
  startOverConfirm: string;
  cancel: string;
  /** Explains why concept copy is in another language than the interface. */
  languageNote: (generatedIn: "CZ" | "EN" | "RU" | "UA") => string;
  restored: string;
  type: {
    title: string;
    options: Record<"web" | "eshop" | "app" | "branding", { label: string; hint: string }>;
  };
  project: {
    title: string;
    lead: string;
    company: Field;
    industry: Field;
    offering: Field;
    audience: Field;
    goal: Field;
  };
  visual: {
    title: string;
    lead: string;
    style: Field;
    mood: Field;
    colors: Field;
    typography: Field;
    notes: Field;
    styleChips: string[];
    moodChips: string[];
    chipsLabel: string;
  };
  references: {
    title: string;
    lead: string;
    url: Field;
    add: string;
    remove: string;
    notes: Field;
    urlNote: string;
    imagesNote: string;
    generate: string;
  };
  sheet: {
    title: string;
    empty: string;
    type: string;
    company: string;
    audience: string;
    goal: string;
    visual: string;
    references: string;
  };
  analysis: {
    eyebrow: string;
    title: string;
    activities: [string, string, string, string];
    note: string;
  };
  errors: Record<BuilderErrorCode | "UNKNOWN", string>;
  sync: {
    saving: string;
    saved: string;
    unsaved: string;
    retry: string;
    unsavedConcepts: string;
    saveConcepts: string;
    savingConcepts: string;
    refineNeedsSave: string;
    actionFailed: string;
  };
  failure: { title: string; retry: string; editBrief: string; direct: string; kept: string };
  concepts: {
    eyebrow: string;
    title: string;
    lead: string;
    concept: string;
    open: string;
    select: string;
    selected: string;
    refine: string;
    regenerate: string;
    regenerateConfirm: string;
    continue: string;
    selectFirst: string;
  };
  viewer: {
    close: string;
    desktop: string;
    mobile: string;
    positioning: string;
    rationale: string;
    system: string;
    palette: string;
    typography: string;
    layout: string;
    refineTitle: string;
    refineLabel: string;
    refinePlaceholder: string;
    refineSubmit: string;
    refining: string;
    refineError: string;
    revisions: string;
    revert: string;
    current: string;
    original: string;
    revision: (n: number) => string;
    reverted: string;
    placeholderNote: string;
  };
  renderer: { imagePlaceholder: string; menu: string };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    selected: string;
    change: string;
    company: string;
    budget: string;
    deadline: string;
    deadlines: Record<"asap" | "1m" | "1-3m" | "3m+" | "unsure", string>;
    message: Field;
    submit: string;
    sending: string;
    note: string;
    sendError: string;
  };
  success: { title: string; body: string; again: string };
  validation: {
    required: string;
    tooShort: string;
    tooLong: string;
    invalidEmail: string;
    invalidUrl: string;
    fix: string;
  };
};

const CZ: BuilderCopy = {
  meta: {
    title: "AI Project Builder — ELEVATE",
    description:
      "Popište svůj projekt a prohlédněte si pět odlišných vizuálních směrů webu, které pro vás připraví ELEVATE.",
  },
  intro: {
    eyebrow: "AI Project Builder",
    title: "Navrhněme směr vašeho webu.",
    lead: "Popište firmu a projekt. ELEVATE z toho připraví pět odlišných vizuálních směrů — prohlédnete si je, upravíte a jeden vyberete.",
  },
  steps: ["Typ", "Projekt", "Vizuál", "Reference", "Koncepty", "Kontakt"],
  stepOf: (n, total) => `Krok ${n} z ${total}`,
  optional: "nepovinné",
  back: "Zpět",
  next: "Pokračovat",
  startOver: "Začít znovu",
  startOverConfirm: "Opravdu začít znovu? Zadání i koncepty se smažou.",
  cancel: "Zrušit",
  languageNote: (lang) =>
    `Texty konceptů jsou v ${{ CZ: "češtině", EN: "angličtině", RU: "ruštině", UA: "ukrajinštině" }[lang]}, ve které vznikly. Pro texty v češtině vytvořte nové koncepty.`,
  restored: "Pokračujete v rozpracovaném zadání uloženém v tomto prohlížeči.",
  type: {
    title: "Co potřebujete vytvořit?",
    options: {
      web: { label: "Web", hint: "Firemní nebo prezentační web" },
      eshop: { label: "E-shop", hint: "Online prodej produktů" },
      app: { label: "Aplikace", hint: "Webová nebo mobilní aplikace" },
      branding: { label: "Branding", hint: "Identita značky a její použití" },
    },
  },
  project: {
    title: "Řekněte nám o projektu",
    lead: "Stačí pár vět. Čím konkrétnější, tím přesnější směry.",
    company: { label: "Název firmy nebo projektu", placeholder: "Např. Kavárna Lípa" },
    industry: { label: "Obor", placeholder: "Např. pražírna kávy" },
    offering: {
      label: "Čím se firma zabývá",
      placeholder: "Co nabízíte, čím se lišíte, jak zákazníci s vámi pracují…",
    },
    audience: { label: "Cílová skupina", placeholder: "Pro koho web je?" },
    goal: {
      label: "Hlavní cíl webu",
      placeholder: "Např. víc rezervací, prodej online, důvěryhodná prezentace",
    },
  },
  visual: {
    title: "Jaký má mít projekt výraz?",
    lead: "Pište vlastními slovy. Nic z toho není povinné — co necháte prázdné, navrhne ELEVATE.",
    style: {
      label: "Preferovaný vizuální styl",
      placeholder: "Např. čistý, editoriální, odvážný…",
    },
    mood: { label: "Nálada", placeholder: "Např. klidná, hřejivá, sebevědomá" },
    colors: { label: "Barvy", placeholder: "Např. tlumené zemité tóny, žádná neonová" },
    typography: {
      label: "Typografie",
      placeholder: "Např. elegantní patkové písmo, velké nadpisy",
    },
    notes: {
      label: "Cokoli dalšího",
      placeholder: "Co se vám líbí, co nechcete, na co nezapomenout…",
    },
    styleChips: ["Editoriální", "Minimalistický", "Odvážný", "Luxusní", "Technický", "Hravý"],
    moodChips: ["Klidná", "Hřejivá", "Sebevědomá", "Exkluzivní", "Přátelská", "Energická"],
    chipsLabel: "Rychlý výběr",
  },
  references: {
    title: "Máte reference?",
    lead: "Weby nebo popisy, které se vám líbí. Tento krok je nepovinný.",
    url: { label: "Odkaz na web", placeholder: "https://" },
    add: "Přidat odkaz",
    remove: "Odebrat odkaz",
    notes: {
      label: "Reference slovy",
      placeholder: "Např. líbí se mi klid stránek hotelových značek, fotky v přirozeném světle…",
    },
    urlNote: "Odkazy předáváme jako text. Návrh weby neotevírá ani nekopíruje.",
    imagesNote: "Obrázky zatím nahrát nelze — popište je prosím slovy.",
    generate: "Vytvořit pět konceptů",
  },
  sheet: {
    title: "Zadání",
    empty: "Zadání se skládá, jak odpovídáte.",
    type: "Typ",
    company: "Projekt",
    audience: "Pro koho",
    goal: "Cíl",
    visual: "Výraz",
    references: "Reference",
  },
  analysis: {
    eyebrow: "Analýza",
    title: "ELEVATE připravuje vaše směry",
    activities: [
      "Analyzuje podnikání",
      "Rozumí publiku",
      "Definuje design systém",
      "Vytváří vizuální směry",
    ],
    note: "Může to trvat minutu až dvě. Zadání zůstává uložené v tomto prohlížeči.",
  },
  errors: {
    AI_UNAVAILABLE:
      "Generování konceptů je teď nedostupné. Nic nového se nevytvořilo — zkuste to prosím později.",
    AI_BUSY: "Služba pro generování je momentálně přetížená. Zkuste to za chvíli znovu.",
    AI_TIMEOUT: "Generování trvalo příliš dlouho a bylo přerušeno. Zkuste to znovu.",
    AI_INVALID: "Návrhy neprošly naší kontrolou kvality, proto je nezobrazujeme. Zkuste to znovu.",
    RATE_LIMITED: "Dosáhli jste limitu generování. Zkuste to prosím za několik minut.",
    INVALID_INPUT: "Některé údaje v zadání nejsou platné. Zkontrolujte je prosím.",
    AI_REFUSED: "Tento požadavek nelze zpracovat. Upravte prosím zadání a zkuste to znovu.",
    PERSISTENCE_UNAVAILABLE:
      "Zadání teď nelze uložit na server. Nic se neztratilo — zůstává v tomto prohlížeči a zkusíme to znovu.",
    LEAD_NOT_FOUND:
      "Uložené zadání se nepodařilo najít. Vaše údaje zůstávají v prohlížeči a uloží se jako nové zadání.",
    LEAD_LOCKED: "Toto zadání už bylo odesláno a nelze ho měnit. Pro nový projekt začněte znovu.",
    CONCEPT_NOT_FOUND: "Tento koncept už není aktuální. Obnovte prosím stránku.",
    GENERATION_LIMIT:
      "Pro toto zadání jste vyčerpali počet generování. Vyberte jeden ze směrů, nebo nás kontaktujte přímo.",
    REVISION_LIMIT: "Pro toto zadání jste vyčerpali počet úprav.",
    REVISION_CONFLICT:
      "Koncept se mezitím změnil (možná v jiném okně). Načetli jsme aktuální verzi — zkuste úpravu znovu.",
    NO_SELECTION: "Nejdřív vyberte jeden směr.",
    UNKNOWN: "Něco se nepovedlo. Zkuste to prosím znovu.",
  },
  sync: {
    saving: "Ukládám…",
    saved: "Uloženo",
    unsaved: "Neuloženo",
    retry: "Zkusit znovu",
    unsavedConcepts: "Koncepty jsou zatím jen v tomto prohlížeči — uložení na server se nezdařilo.",
    saveConcepts: "Uložit koncepty",
    savingConcepts: "Ukládám koncepty…",
    refineNeedsSave: "Nejdřív uložte koncepty, pak je můžete upravovat.",
    actionFailed: "Změnu se nepodařilo uložit.",
  },
  failure: {
    title: "Koncepty se nepodařilo vytvořit",
    retry: "Zkusit znovu",
    editBrief: "Upravit zadání",
    direct: "Kontaktovat ELEVATE přímo",
    kept: "Vaše zadání zůstává uložené.",
  },
  concepts: {
    eyebrow: "Pět směrů",
    title: "Vyberte směr, který je vám nejblíž.",
    lead: "Každý koncept je strukturovaný návrh vykreslený systémem ELEVATE, ne hotový web. Texty a obrazové plochy jsou ilustrační.",
    concept: "Koncept",
    open: "Otevřít koncept",
    select: "Vybrat směr",
    selected: "Vybraný směr",
    refine: "Upravit s AI",
    regenerate: "Vytvořit nové koncepty",
    regenerateConfirm: "Vytvořit nové koncepty? Současné koncepty i jejich úpravy se nahradí.",
    continue: "Pokračovat ke kontaktu",
    selectFirst: "Nejdřív vyberte jeden směr.",
  },
  viewer: {
    close: "Zavřít",
    desktop: "Desktop",
    mobile: "Mobil",
    positioning: "Pozice značky",
    rationale: "Proč tento směr",
    system: "Design systém",
    palette: "Paleta",
    typography: "Typografie",
    layout: "Rozvržení",
    refineTitle: "Upravit s AI",
    refineLabel: "Co chcete na směru změnit?",
    refinePlaceholder: "Např. tmavší, prémiovější, větší typografie a méně textu.",
    refineSubmit: "Upravit koncept",
    refining: "Upravuji koncept…",
    refineError: "Úprava se nepodařila",
    revisions: "Historie úprav",
    revert: "Vrátit",
    current: "Aktuální",
    original: "Původní verze",
    revision: (n) => `Úprava ${n}`,
    reverted: "Vrácená verze",
    placeholderNote: "Ilustrační náhled — texty a obrazové plochy nejsou finální obsah.",
  },
  renderer: { imagePlaceholder: "Obrazová plocha", menu: "Menu" },
  contact: {
    eyebrow: "Poslední krok",
    title: "Pošlete nám projekt se zvoleným směrem",
    lead: "Zadání, zvolený koncept i vaše úpravy pošleme týmu ELEVATE.",
    selected: "Zvolený směr",
    change: "Změnit směr",
    company: "Firma",
    budget: "Rozpočet",
    deadline: "Termín",
    deadlines: {
      asap: "Co nejdříve",
      "1m": "Do měsíce",
      "1-3m": "Za 1–3 měsíce",
      "3m+": "Za více než 3 měsíce",
      unsure: "Zatím nevím",
    },
    message: { label: "Zpráva", placeholder: "Cokoli, co bychom měli vědět předem." },
    submit: "Odeslat zadání",
    sending: "Odesílám…",
    note: "Žádný spam. Údaje použijeme jen k odpovědi na vaše zadání.",
    sendError:
      "Odeslání se nezdařilo. Zadání zůstává uložené — zkuste to znovu, nebo nás kontaktujte přímo.",
  },
  success: {
    title: "Zadání odesláno",
    body: "Tým ELEVATE má vaše zadání i zvolený směr a ozve se vám s dalším krokem.",
    again: "Začít nový projekt",
  },
  validation: {
    required: "Toto pole je povinné.",
    tooShort: "Napište prosím trochu víc.",
    tooLong: "Text je příliš dlouhý.",
    invalidEmail: "Zadejte platný e-mail.",
    invalidUrl: "Zadejte platnou adresu, např. https://example.cz",
    fix: "Zkontrolujte prosím označená pole.",
  },
};

const EN: BuilderCopy = {
  meta: {
    title: "AI Project Builder — ELEVATE",
    description:
      "Describe your project and explore five distinct visual website directions prepared by ELEVATE.",
  },
  intro: {
    eyebrow: "AI Project Builder",
    title: "Let's shape the direction of your website.",
    lead: "Describe your business and project. ELEVATE turns it into five distinct visual directions — explore them, refine them and choose one.",
  },
  steps: ["Type", "Project", "Visual", "References", "Concepts", "Contact"],
  stepOf: (n, total) => `Step ${n} of ${total}`,
  optional: "optional",
  back: "Back",
  next: "Continue",
  startOver: "Start over",
  startOverConfirm: "Start over? Your brief and concepts will be deleted.",
  cancel: "Cancel",
  languageNote: (lang) =>
    `The concepts were written in ${{ CZ: "Czech", EN: "English", RU: "Russian", UA: "Ukrainian" }[lang]}, the language they were created in. Create new concepts for English copy.`,
  restored: "You are continuing a brief saved in this browser.",
  type: {
    title: "What do you need to create?",
    options: {
      web: { label: "Website", hint: "Company or presentation site" },
      eshop: { label: "E-shop", hint: "Selling products online" },
      app: { label: "Application", hint: "Web or mobile app" },
      branding: { label: "Branding", hint: "Brand identity and its use" },
    },
  },
  project: {
    title: "Tell us about the project",
    lead: "A few sentences are enough. The more specific, the sharper the directions.",
    company: { label: "Company or project name", placeholder: "e.g. Linden Coffee" },
    industry: { label: "Industry", placeholder: "e.g. coffee roastery" },
    offering: {
      label: "What the business does",
      placeholder: "What you offer, what sets you apart, how customers work with you…",
    },
    audience: { label: "Target audience", placeholder: "Who is the website for?" },
    goal: {
      label: "Primary goal",
      placeholder: "e.g. more bookings, online sales, a credible presence",
    },
  },
  visual: {
    title: "How should the project feel?",
    lead: "Use your own words. Nothing here is required — whatever you leave blank, ELEVATE will propose.",
    style: { label: "Preferred visual style", placeholder: "e.g. clean, editorial, bold…" },
    mood: { label: "Mood", placeholder: "e.g. calm, warm, confident" },
    colors: { label: "Colours", placeholder: "e.g. muted earthy tones, nothing neon" },
    typography: { label: "Typography", placeholder: "e.g. elegant serif, large headlines" },
    notes: {
      label: "Anything else",
      placeholder: "What you like, what you don't want, what not to forget…",
    },
    styleChips: ["Editorial", "Minimal", "Bold", "Luxurious", "Technical", "Playful"],
    moodChips: ["Calm", "Warm", "Confident", "Exclusive", "Friendly", "Energetic"],
    chipsLabel: "Quick picks",
  },
  references: {
    title: "Any references?",
    lead: "Websites or descriptions you like. This step is optional.",
    url: { label: "Website link", placeholder: "https://" },
    add: "Add link",
    remove: "Remove link",
    notes: {
      label: "References in words",
      placeholder: "e.g. the calm of hotel brand sites, photos in natural light…",
    },
    urlNote: "Links are passed on as text. The concepts never open or copy those sites.",
    imagesNote: "Image uploads are not available yet — please describe images in words.",
    generate: "Create five concepts",
  },
  sheet: {
    title: "Brief",
    empty: "Your brief takes shape as you answer.",
    type: "Type",
    company: "Project",
    audience: "For",
    goal: "Goal",
    visual: "Expression",
    references: "References",
  },
  analysis: {
    eyebrow: "Analysis",
    title: "ELEVATE is preparing your directions",
    activities: [
      "Analysing the business",
      "Understanding the audience",
      "Defining the design system",
      "Creating visual directions",
    ],
    note: "This can take a minute or two. Your brief stays saved in this browser.",
  },
  errors: {
    AI_UNAVAILABLE:
      "Concept generation is unavailable right now. Nothing new was generated — please try again later.",
    AI_BUSY: "The generation service is busy at the moment. Please try again shortly.",
    AI_TIMEOUT: "Generation took too long and was stopped. Please try again.",
    AI_INVALID:
      "The proposals did not pass our quality checks, so we are not showing them. Please try again.",
    RATE_LIMITED: "You have reached the generation limit. Please try again in a few minutes.",
    INVALID_INPUT: "Some details in the brief are not valid. Please check them.",
    AI_REFUSED: "This request can't be processed. Please adjust the brief and try again.",
    PERSISTENCE_UNAVAILABLE:
      "Your brief can't be saved to the server right now. Nothing is lost — it stays in this browser and we'll try again.",
    LEAD_NOT_FOUND:
      "Your saved brief could not be found. Your details stay in this browser and will be saved as a new brief.",
    LEAD_LOCKED:
      "This brief has already been sent and can't be changed. Start over for a new project.",
    CONCEPT_NOT_FOUND: "This concept is no longer current. Please reload the page.",
    GENERATION_LIMIT:
      "You've used all generations for this brief. Choose one of the directions, or contact us directly.",
    REVISION_LIMIT: "You've used all refinements for this brief.",
    REVISION_CONFLICT:
      "The concept changed in the meantime (perhaps in another window). We've loaded the current version — please try the refinement again.",
    NO_SELECTION: "Select one direction first.",
    UNKNOWN: "Something went wrong. Please try again.",
  },
  sync: {
    saving: "Saving…",
    saved: "Saved",
    unsaved: "Not saved",
    retry: "Try again",
    unsavedConcepts:
      "These concepts exist only in this browser so far — saving them to the server failed.",
    saveConcepts: "Save concepts",
    savingConcepts: "Saving concepts…",
    refineNeedsSave: "Save the concepts first, then you can refine them.",
    actionFailed: "The change could not be saved.",
  },
  failure: {
    title: "The concepts could not be created",
    retry: "Try again",
    editBrief: "Edit brief",
    direct: "Contact ELEVATE directly",
    kept: "Your brief is still saved.",
  },
  concepts: {
    eyebrow: "Five directions",
    title: "Choose the direction closest to you.",
    lead: "Each concept is a structured proposal rendered by ELEVATE's system, not a finished website. Copy and image areas are illustrative.",
    concept: "Concept",
    open: "Open concept",
    select: "Select direction",
    selected: "Selected direction",
    refine: "Refine with AI",
    regenerate: "Create new concepts",
    regenerateConfirm:
      "Create new concepts? The current concepts and their refinements will be replaced.",
    continue: "Continue to contact",
    selectFirst: "Select one direction first.",
  },
  viewer: {
    close: "Close",
    desktop: "Desktop",
    mobile: "Mobile",
    positioning: "Brand positioning",
    rationale: "Why this direction",
    system: "Design system",
    palette: "Palette",
    typography: "Typography",
    layout: "Layout",
    refineTitle: "Refine with AI",
    refineLabel: "What would you change?",
    refinePlaceholder: "e.g. darker, more premium, larger typography and less text.",
    refineSubmit: "Refine concept",
    refining: "Refining concept…",
    refineError: "The refinement failed",
    revisions: "Revision history",
    revert: "Restore",
    current: "Current",
    original: "Original",
    revision: (n) => `Revision ${n}`,
    reverted: "Restored version",
    placeholderNote: "Illustrative preview — copy and image areas are not final content.",
  },
  renderer: { imagePlaceholder: "Image area", menu: "Menu" },
  contact: {
    eyebrow: "Final step",
    title: "Send us the project with your chosen direction",
    lead: "Your brief, the chosen concept and your refinements go to the ELEVATE team.",
    selected: "Chosen direction",
    change: "Change direction",
    company: "Company",
    budget: "Budget",
    deadline: "Timeline",
    deadlines: {
      asap: "As soon as possible",
      "1m": "Within a month",
      "1-3m": "In 1–3 months",
      "3m+": "In more than 3 months",
      unsure: "Not sure yet",
    },
    message: { label: "Message", placeholder: "Anything we should know up front." },
    submit: "Send brief",
    sending: "Sending…",
    note: "No spam. We use your details only to reply to your brief.",
    sendError: "Sending failed. Your brief is still saved — try again, or contact us directly.",
  },
  success: {
    title: "Brief sent",
    body: "The ELEVATE team has your brief and chosen direction and will get back to you with the next step.",
    again: "Start a new project",
  },
  validation: {
    required: "This field is required.",
    tooShort: "Please write a little more.",
    tooLong: "The text is too long.",
    invalidEmail: "Enter a valid email.",
    invalidUrl: "Enter a valid address, e.g. https://example.com",
    fix: "Please check the highlighted fields.",
  },
};

const RU: BuilderCopy = {
  meta: {
    title: "AI Project Builder — ELEVATE",
    description:
      "Опишите проект и посмотрите пять разных визуальных направлений сайта, которые подготовит ELEVATE.",
  },
  intro: {
    eyebrow: "AI Project Builder",
    title: "Определим направление вашего сайта.",
    lead: "Опишите компанию и проект. ELEVATE подготовит пять разных визуальных направлений — посмотрите, доработайте и выберите одно.",
  },
  steps: ["Тип", "Проект", "Визуал", "Референсы", "Концепции", "Контакт"],
  stepOf: (n, total) => `Шаг ${n} из ${total}`,
  optional: "необязательно",
  back: "Назад",
  next: "Продолжить",
  startOver: "Начать заново",
  startOverConfirm: "Начать заново? Бриф и концепции будут удалены.",
  cancel: "Отмена",
  languageNote: (lang) =>
    `Тексты концепций написаны на ${{ CZ: "чешском", EN: "английском", RU: "русском", UA: "украинском" }[lang]} — языке, на котором они созданы. Для текстов на русском создайте новые концепции.`,
  restored: "Вы продолжаете бриф, сохранённый в этом браузере.",
  type: {
    title: "Что нужно создать?",
    options: {
      web: { label: "Сайт", hint: "Корпоративный или презентационный сайт" },
      eshop: { label: "Интернет-магазин", hint: "Продажа товаров онлайн" },
      app: { label: "Приложение", hint: "Веб- или мобильное приложение" },
      branding: { label: "Брендинг", hint: "Айдентика бренда и её применение" },
    },
  },
  project: {
    title: "Расскажите о проекте",
    lead: "Достаточно нескольких предложений. Чем конкретнее, тем точнее направления.",
    company: { label: "Название компании или проекта", placeholder: "Например, Кофейня Липа" },
    industry: { label: "Сфера", placeholder: "Например, обжарка кофе" },
    offering: {
      label: "Чем занимается компания",
      placeholder: "Что вы предлагаете, чем отличаетесь, как с вами работают клиенты…",
    },
    audience: { label: "Целевая аудитория", placeholder: "Для кого этот сайт?" },
    goal: {
      label: "Главная цель",
      placeholder: "Например, больше бронирований, продажи онлайн, доверие",
    },
  },
  visual: {
    title: "Каким должен быть характер проекта?",
    lead: "Пишите своими словами. Ничего не обязательно — то, что вы оставите пустым, предложит ELEVATE.",
    style: {
      label: "Предпочтительный стиль",
      placeholder: "Например, чистый, редакционный, смелый…",
    },
    mood: { label: "Настроение", placeholder: "Например, спокойное, тёплое, уверенное" },
    colors: { label: "Цвета", placeholder: "Например, приглушённые природные тона, без неона" },
    typography: {
      label: "Типографика",
      placeholder: "Например, элегантная антиква, крупные заголовки",
    },
    notes: { label: "Что-то ещё", placeholder: "Что нравится, чего не хотите, о чём не забыть…" },
    styleChips: [
      "Редакционный",
      "Минималистичный",
      "Смелый",
      "Роскошный",
      "Технологичный",
      "Игривый",
    ],
    moodChips: ["Спокойное", "Тёплое", "Уверенное", "Эксклюзивное", "Дружелюбное", "Энергичное"],
    chipsLabel: "Быстрый выбор",
  },
  references: {
    title: "Есть референсы?",
    lead: "Сайты или описания, которые вам нравятся. Этот шаг необязателен.",
    url: { label: "Ссылка на сайт", placeholder: "https://" },
    add: "Добавить ссылку",
    remove: "Удалить ссылку",
    notes: {
      label: "Референсы словами",
      placeholder: "Например, спокойствие сайтов отелей, фото при естественном свете…",
    },
    urlNote: "Ссылки передаются как текст. Концепции не открывают и не копируют эти сайты.",
    imagesNote: "Загрузка изображений пока недоступна — опишите их, пожалуйста, словами.",
    generate: "Создать пять концепций",
  },
  sheet: {
    title: "Бриф",
    empty: "Бриф собирается по мере ваших ответов.",
    type: "Тип",
    company: "Проект",
    audience: "Для кого",
    goal: "Цель",
    visual: "Характер",
    references: "Референсы",
  },
  analysis: {
    eyebrow: "Анализ",
    title: "ELEVATE готовит ваши направления",
    activities: [
      "Анализирует бизнес",
      "Понимает аудиторию",
      "Определяет дизайн-систему",
      "Создаёт визуальные направления",
    ],
    note: "Это может занять минуту-две. Бриф сохраняется в этом браузере.",
  },
  errors: {
    AI_UNAVAILABLE:
      "Генерация концепций сейчас недоступна. Ничего нового не создано — попробуйте позже.",
    AI_BUSY: "Сервис генерации сейчас перегружен. Попробуйте ещё раз чуть позже.",
    AI_TIMEOUT: "Генерация заняла слишком много времени и была прервана. Попробуйте ещё раз.",
    AI_INVALID:
      "Предложения не прошли нашу проверку качества, поэтому мы их не показываем. Попробуйте ещё раз.",
    RATE_LIMITED: "Достигнут лимит генераций. Попробуйте через несколько минут.",
    INVALID_INPUT: "Некоторые данные брифа некорректны. Проверьте их, пожалуйста.",
    AI_REFUSED:
      "Этот запрос не может быть обработан. Измените, пожалуйста, бриф и попробуйте снова.",
    PERSISTENCE_UNAVAILABLE:
      "Сейчас не удаётся сохранить бриф на сервере. Ничего не потеряно — он остаётся в этом браузере, и мы попробуем снова.",
    LEAD_NOT_FOUND:
      "Сохранённый бриф не найден. Ваши данные остаются в браузере и будут сохранены как новый бриф.",
    LEAD_LOCKED:
      "Этот бриф уже отправлен и не может быть изменён. Для нового проекта начните заново.",
    CONCEPT_NOT_FOUND: "Эта концепция уже неактуальна. Обновите, пожалуйста, страницу.",
    GENERATION_LIMIT:
      "Для этого брифа исчерпан лимит генераций. Выберите одно из направлений или свяжитесь с нами напрямую.",
    REVISION_LIMIT: "Для этого брифа исчерпан лимит доработок.",
    REVISION_CONFLICT:
      "Концепция тем временем изменилась (возможно, в другом окне). Мы загрузили актуальную версию — попробуйте доработку снова.",
    NO_SELECTION: "Сначала выберите одно направление.",
    UNKNOWN: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  sync: {
    saving: "Сохраняю…",
    saved: "Сохранено",
    unsaved: "Не сохранено",
    retry: "Попробовать снова",
    unsavedConcepts:
      "Эти концепции пока есть только в этом браузере — сохранить их на сервере не удалось.",
    saveConcepts: "Сохранить концепции",
    savingConcepts: "Сохраняю концепции…",
    refineNeedsSave: "Сначала сохраните концепции, затем их можно дорабатывать.",
    actionFailed: "Не удалось сохранить изменение.",
  },
  failure: {
    title: "Не удалось создать концепции",
    retry: "Попробовать снова",
    editBrief: "Изменить бриф",
    direct: "Связаться с ELEVATE напрямую",
    kept: "Ваш бриф сохранён.",
  },
  concepts: {
    eyebrow: "Пять направлений",
    title: "Выберите направление, которое вам ближе.",
    lead: "Каждая концепция — структурированное предложение, отрисованное системой ELEVATE, а не готовый сайт. Тексты и изображения иллюстративны.",
    concept: "Концепция",
    open: "Открыть концепцию",
    select: "Выбрать направление",
    selected: "Выбранное направление",
    refine: "Доработать с AI",
    regenerate: "Создать новые концепции",
    regenerateConfirm: "Создать новые концепции? Текущие концепции и их доработки будут заменены.",
    continue: "Перейти к контакту",
    selectFirst: "Сначала выберите одно направление.",
  },
  viewer: {
    close: "Закрыть",
    desktop: "Десктоп",
    mobile: "Мобильный",
    positioning: "Позиционирование",
    rationale: "Почему это направление",
    system: "Дизайн-система",
    palette: "Палитра",
    typography: "Типографика",
    layout: "Компоновка",
    refineTitle: "Доработать с AI",
    refineLabel: "Что бы вы изменили?",
    refinePlaceholder: "Например, темнее, премиальнее, крупнее типографика и меньше текста.",
    refineSubmit: "Доработать концепцию",
    refining: "Дорабатываю концепцию…",
    refineError: "Доработка не удалась",
    revisions: "История правок",
    revert: "Вернуть",
    current: "Текущая",
    original: "Исходная версия",
    revision: (n) => `Правка ${n}`,
    reverted: "Возвращённая версия",
    placeholderNote:
      "Иллюстративный превью — тексты и изображения не являются финальным контентом.",
  },
  renderer: { imagePlaceholder: "Место для изображения", menu: "Меню" },
  contact: {
    eyebrow: "Последний шаг",
    title: "Отправьте нам проект с выбранным направлением",
    lead: "Бриф, выбранная концепция и ваши правки уйдут команде ELEVATE.",
    selected: "Выбранное направление",
    change: "Изменить направление",
    company: "Компания",
    budget: "Бюджет",
    deadline: "Сроки",
    deadlines: {
      asap: "Как можно скорее",
      "1m": "В течение месяца",
      "1-3m": "Через 1–3 месяца",
      "3m+": "Более чем через 3 месяца",
      unsure: "Пока не знаю",
    },
    message: { label: "Сообщение", placeholder: "Всё, что нам стоит знать заранее." },
    submit: "Отправить бриф",
    sending: "Отправляю…",
    note: "Без спама. Данные используются только для ответа на ваш бриф.",
    sendError:
      "Отправить не удалось. Бриф сохранён — попробуйте снова или свяжитесь с нами напрямую.",
  },
  success: {
    title: "Бриф отправлен",
    body: "Команда ELEVATE получила ваш бриф и выбранное направление и свяжется с вами насчёт следующего шага.",
    again: "Начать новый проект",
  },
  validation: {
    required: "Это поле обязательно.",
    tooShort: "Напишите, пожалуйста, чуть подробнее.",
    tooLong: "Текст слишком длинный.",
    invalidEmail: "Введите корректный e-mail.",
    invalidUrl: "Введите корректный адрес, например https://example.com",
    fix: "Проверьте, пожалуйста, отмеченные поля.",
  },
};

const UA: BuilderCopy = {
  meta: {
    title: "AI Project Builder — ELEVATE",
    description:
      "Опишіть проєкт і перегляньте п'ять різних візуальних напрямів сайту, які підготує ELEVATE.",
  },
  intro: {
    eyebrow: "AI Project Builder",
    title: "Визначмо напрям вашого сайту.",
    lead: "Опишіть компанію та проєкт. ELEVATE підготує п'ять різних візуальних напрямів — перегляньте, доопрацюйте й оберіть один.",
  },
  steps: ["Тип", "Проєкт", "Візуал", "Референси", "Концепції", "Контакт"],
  stepOf: (n, total) => `Крок ${n} з ${total}`,
  optional: "необов'язково",
  back: "Назад",
  next: "Продовжити",
  startOver: "Почати знову",
  startOverConfirm: "Почати знову? Бриф і концепції буде видалено.",
  cancel: "Скасувати",
  languageNote: (lang) =>
    `Тексти концепцій написані ${{ CZ: "чеською", EN: "англійською", RU: "російською", UA: "українською" }[lang]} — мовою, якою їх створено. Для текстів українською створіть нові концепції.`,
  restored: "Ви продовжуєте бриф, збережений у цьому браузері.",
  type: {
    title: "Що потрібно створити?",
    options: {
      web: { label: "Сайт", hint: "Корпоративний або презентаційний сайт" },
      eshop: { label: "Інтернет-магазин", hint: "Продаж товарів онлайн" },
      app: { label: "Застосунок", hint: "Веб- або мобільний застосунок" },
      branding: { label: "Брендинг", hint: "Айдентика бренду та її застосування" },
    },
  },
  project: {
    title: "Розкажіть про проєкт",
    lead: "Достатньо кількох речень. Що конкретніше, то точніші напрями.",
    company: { label: "Назва компанії або проєкту", placeholder: "Наприклад, Кав'ярня Липа" },
    industry: { label: "Галузь", placeholder: "Наприклад, обсмажування кави" },
    offering: {
      label: "Чим займається компанія",
      placeholder: "Що ви пропонуєте, чим відрізняєтеся, як із вами працюють клієнти…",
    },
    audience: { label: "Цільова аудиторія", placeholder: "Для кого цей сайт?" },
    goal: {
      label: "Головна мета",
      placeholder: "Наприклад, більше бронювань, продажі онлайн, довіра",
    },
  },
  visual: {
    title: "Яким має бути характер проєкту?",
    lead: "Пишіть своїми словами. Нічого не обов'язково — те, що залишите порожнім, запропонує ELEVATE.",
    style: { label: "Бажаний стиль", placeholder: "Наприклад, чистий, редакційний, сміливий…" },
    mood: { label: "Настрій", placeholder: "Наприклад, спокійний, теплий, упевнений" },
    colors: { label: "Кольори", placeholder: "Наприклад, приглушені природні тони, без неону" },
    typography: {
      label: "Типографіка",
      placeholder: "Наприклад, елегантна антиква, великі заголовки",
    },
    notes: { label: "Щось іще", placeholder: "Що подобається, чого не хочете, про що не забути…" },
    styleChips: [
      "Редакційний",
      "Мінімалістичний",
      "Сміливий",
      "Розкішний",
      "Технологічний",
      "Грайливий",
    ],
    moodChips: ["Спокійний", "Теплий", "Упевнений", "Ексклюзивний", "Дружній", "Енергійний"],
    chipsLabel: "Швидкий вибір",
  },
  references: {
    title: "Є референси?",
    lead: "Сайти або описи, які вам подобаються. Цей крок необов'язковий.",
    url: { label: "Посилання на сайт", placeholder: "https://" },
    add: "Додати посилання",
    remove: "Видалити посилання",
    notes: {
      label: "Референси словами",
      placeholder: "Наприклад, спокій сайтів готелів, фото в природному світлі…",
    },
    urlNote: "Посилання передаються як текст. Концепції не відкривають і не копіюють ці сайти.",
    imagesNote: "Завантаження зображень поки недоступне — опишіть їх, будь ласка, словами.",
    generate: "Створити п'ять концепцій",
  },
  sheet: {
    title: "Бриф",
    empty: "Бриф складається з ваших відповідей.",
    type: "Тип",
    company: "Проєкт",
    audience: "Для кого",
    goal: "Мета",
    visual: "Характер",
    references: "Референси",
  },
  analysis: {
    eyebrow: "Аналіз",
    title: "ELEVATE готує ваші напрями",
    activities: [
      "Аналізує бізнес",
      "Розуміє аудиторію",
      "Визначає дизайн-систему",
      "Створює візуальні напрями",
    ],
    note: "Це може тривати хвилину-дві. Бриф зберігається в цьому браузері.",
  },
  errors: {
    AI_UNAVAILABLE:
      "Генерація концепцій зараз недоступна. Нічого нового не створено — спробуйте пізніше.",
    AI_BUSY: "Сервіс генерації зараз перевантажений. Спробуйте ще раз трохи згодом.",
    AI_TIMEOUT: "Генерація тривала надто довго й була перервана. Спробуйте ще раз.",
    AI_INVALID:
      "Пропозиції не пройшли нашу перевірку якості, тому ми їх не показуємо. Спробуйте ще раз.",
    RATE_LIMITED: "Досягнуто ліміту генерацій. Спробуйте за кілька хвилин.",
    INVALID_INPUT: "Деякі дані брифу некоректні. Перевірте їх, будь ласка.",
    AI_REFUSED: "Цей запит не може бути оброблено. Змініть, будь ласка, бриф і спробуйте знову.",
    PERSISTENCE_UNAVAILABLE:
      "Зараз не вдається зберегти бриф на сервері. Нічого не втрачено — він залишається в цьому браузері, і ми спробуємо знову.",
    LEAD_NOT_FOUND:
      "Збережений бриф не знайдено. Ваші дані залишаються в браузері й будуть збережені як новий бриф.",
    LEAD_LOCKED: "Цей бриф уже надіслано, його не можна змінити. Для нового проєкту почніть знову.",
    CONCEPT_NOT_FOUND: "Ця концепція вже неактуальна. Оновіть, будь ласка, сторінку.",
    GENERATION_LIMIT:
      "Для цього брифу вичерпано ліміт генерацій. Оберіть один із напрямів або зв'яжіться з нами напряму.",
    REVISION_LIMIT: "Для цього брифу вичерпано ліміт доопрацювань.",
    REVISION_CONFLICT:
      "Концепція тим часом змінилася (можливо, в іншому вікні). Ми завантажили актуальну версію — спробуйте доопрацювання знову.",
    NO_SELECTION: "Спершу оберіть один напрям.",
    UNKNOWN: "Щось пішло не так. Спробуйте ще раз.",
  },
  sync: {
    saving: "Зберігаю…",
    saved: "Збережено",
    unsaved: "Не збережено",
    retry: "Спробувати знову",
    unsavedConcepts:
      "Ці концепції поки що є лише в цьому браузері — зберегти їх на сервері не вдалося.",
    saveConcepts: "Зберегти концепції",
    savingConcepts: "Зберігаю концепції…",
    refineNeedsSave: "Спершу збережіть концепції, потім їх можна доопрацьовувати.",
    actionFailed: "Не вдалося зберегти зміну.",
  },
  failure: {
    title: "Не вдалося створити концепції",
    retry: "Спробувати знову",
    editBrief: "Змінити бриф",
    direct: "Зв'язатися з ELEVATE напряму",
    kept: "Ваш бриф збережено.",
  },
  concepts: {
    eyebrow: "П'ять напрямів",
    title: "Оберіть напрям, який вам ближчий.",
    lead: "Кожна концепція — структурована пропозиція, відмальована системою ELEVATE, а не готовий сайт. Тексти й зображення ілюстративні.",
    concept: "Концепція",
    open: "Відкрити концепцію",
    select: "Обрати напрям",
    selected: "Обраний напрям",
    refine: "Доопрацювати з AI",
    regenerate: "Створити нові концепції",
    regenerateConfirm:
      "Створити нові концепції? Поточні концепції та їхні доопрацювання буде замінено.",
    continue: "Перейти до контакту",
    selectFirst: "Спершу оберіть один напрям.",
  },
  viewer: {
    close: "Закрити",
    desktop: "Десктоп",
    mobile: "Мобільний",
    positioning: "Позиціонування",
    rationale: "Чому цей напрям",
    system: "Дизайн-система",
    palette: "Палітра",
    typography: "Типографіка",
    layout: "Компонування",
    refineTitle: "Доопрацювати з AI",
    refineLabel: "Що б ви змінили?",
    refinePlaceholder: "Наприклад, темніше, преміальніше, більша типографіка й менше тексту.",
    refineSubmit: "Доопрацювати концепцію",
    refining: "Доопрацьовую концепцію…",
    refineError: "Доопрацювання не вдалося",
    revisions: "Історія правок",
    revert: "Повернути",
    current: "Поточна",
    original: "Початкова версія",
    revision: (n) => `Правка ${n}`,
    reverted: "Повернена версія",
    placeholderNote: "Ілюстративний превʼю — тексти й зображення не є фінальним контентом.",
  },
  renderer: { imagePlaceholder: "Місце для зображення", menu: "Меню" },
  contact: {
    eyebrow: "Останній крок",
    title: "Надішліть нам проєкт з обраним напрямом",
    lead: "Бриф, обрана концепція та ваші правки підуть команді ELEVATE.",
    selected: "Обраний напрям",
    change: "Змінити напрям",
    company: "Компанія",
    budget: "Бюджет",
    deadline: "Терміни",
    deadlines: {
      asap: "Якнайшвидше",
      "1m": "Протягом місяця",
      "1-3m": "За 1–3 місяці",
      "3m+": "Більше ніж за 3 місяці",
      unsure: "Поки не знаю",
    },
    message: { label: "Повідомлення", placeholder: "Усе, що нам варто знати заздалегідь." },
    submit: "Надіслати бриф",
    sending: "Надсилаю…",
    note: "Без спаму. Дані використовуються лише для відповіді на ваш бриф.",
    sendError:
      "Надіслати не вдалося. Бриф збережено — спробуйте знову або зв'яжіться з нами напряму.",
  },
  success: {
    title: "Бриф надіслано",
    body: "Команда ELEVATE отримала ваш бриф і обраний напрям та зв'яжеться з вами щодо наступного кроку.",
    again: "Почати новий проєкт",
  },
  validation: {
    required: "Це поле обов'язкове.",
    tooShort: "Напишіть, будь ласка, трохи докладніше.",
    tooLong: "Текст задовгий.",
    invalidEmail: "Введіть коректний e-mail.",
    invalidUrl: "Введіть коректну адресу, наприклад https://example.com",
    fix: "Перевірте, будь ласка, позначені поля.",
  },
};

export const BUILDER_COPY: Record<Lang, BuilderCopy> = { CZ, EN, RU, UA };
