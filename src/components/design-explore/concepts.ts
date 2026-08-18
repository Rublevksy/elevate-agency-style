/**
 * Single source of truth for the four temporary homepage design directions
 * explored under /design-v1 … /design-v4. Consumed by the /design index page
 * and by ExploreSwitcher — never duplicate this list elsewhere.
 */
export interface DesignConcept {
  slug: "design-v1" | "design-v2" | "design-v3" | "design-v4";
  order: 1 | 2 | 3 | 4;
  name: string;
  oneLiner: string;
}

export const DESIGN_CONCEPTS: readonly DesignConcept[] = [
  {
    slug: "design-v1",
    order: 1,
    name: "V1 — Reference-led premium studio",
    oneLiner:
      "Скролл-driven device hero и дугообразный синий свет, доведённые до полной страницы — самое безопасное продолжение текущей прод-системы.",
  },
  {
    slug: "design-v2",
    order: 2,
    name: "V2 — Editorial / cinematic digital studio",
    oneLiner:
      "Журнальная подача: нумерованный rail слева, крупная сцена справа, каждая услуга — разворот, а не карточка.",
  },
  {
    slug: "design-v3",
    order: 3,
    name: "V3 — Interactive product showcase",
    oneLiner:
      "Интерфейс — это и есть контент: живой, кликабельный device-мокап управляет всей информационной иерархией страницы.",
  },
  {
    slug: "design-v4",
    order: 4,
    name: "V4 — Experimental premium technology studio",
    oneLiner:
      "Асимметричная техническая сетка и инженерная консоль-readout вместо ещё одной гладкой маркетинговой композиции.",
  },
];
