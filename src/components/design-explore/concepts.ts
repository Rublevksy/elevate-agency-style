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
    name: "V1 — «Референс оживший» (Reference-led premium studio)",
    oneLiner:
      "Композиция главного референса один в один: фото MacBook, живой текст слева, прочерчивающаяся SVG-дуга и каскад из 5 карточек с маскотами по нумерованному rail.",
  },
  {
    slug: "design-v2",
    order: 2,
    name: "V2 — «Кинематографические главы» (Editorial / cinematic)",
    oneLiner:
      "Не страница с секциями, а фильм из глав: каждая услуга — полнокадровая сцена с закреплённым поверх текстом и монтажной склейкой вместо fade.",
  },
  {
    slug: "design-v3",
    order: 3,
    name: "V3 — «Стол студии» (Interactive product showcase)",
    oneLiner:
      "Маскот — ведущий: переключение услуги одновременно меняет реальную фотосцену и живой DOM-интерфейс в browser-window рядом с ней.",
  },
  {
    slug: "design-v4",
    order: 4,
    name: "V4 — «Аппаратная» (Experimental premium technology studio)",
    oneLiner:
      "Страница как приборная панель: настоящая фотография препарируется прочерчивающейся технической разметкой, а линия-сканер собирает композицию по модулям.",
  },
];
