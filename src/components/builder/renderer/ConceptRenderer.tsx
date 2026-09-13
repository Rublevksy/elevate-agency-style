/**
 * ELEVATE's concept renderer: a trusted DesignSpec → a believable website.
 *
 * The model chose a direction from closed vocabularies; this file owns every
 * decision about how that direction is drawn — composition, spacing,
 * typography, components and responsive behaviour. It renders text only as
 * React text nodes, never HTML, and no spec value is ever turned into a class
 * name.
 *
 * Responsive by CONTAINER, not viewport (`@container` + `@min-[720px]:`): the
 * same concept lays itself out as a phone site inside a 390px frame and as a
 * desktop site inside a 1280px frame, wherever that frame sits on the page.
 *
 *   variant "page"       the whole concept (Open concept)
 *   variant "thumbnail"  navigation, hero and the first section (the gallery)
 */
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { EASE } from "@/components/cinematic";
import type { DesignSection, DesignSpec } from "@/lib/builder/spec";
import { resolveTheme, type Theme } from "./theme";
import { Visual } from "./Visual";

export type RendererCopy = { imagePlaceholder: string; menu: string };

// Full class strings, so Tailwind can see them (never assembled at runtime).
const WIDE_COLS: Record<number, string> = {
  3: "@min-[960px]:grid-cols-3",
  4: "@min-[960px]:grid-cols-4",
};
const STEP_COLS: Record<number, string> = {
  2: "@min-[720px]:grid-cols-2",
  3: "@min-[720px]:grid-cols-3",
  4: "@min-[720px]:grid-cols-4",
};

type Ctx = { theme: Theme; brand: string; tagline: string; copy: RendererCopy; animate: boolean };

export function ConceptRenderer({
  spec,
  brand,
  tagline,
  copy,
  variant = "page",
  animate = false,
}: {
  spec: DesignSpec;
  /** The client's company name, from the brief — never from the model. */
  brand: string;
  /** The client's industry, from the brief. */
  tagline: string;
  copy: RendererCopy;
  variant?: "page" | "thumbnail";
  animate?: boolean;
}) {
  const theme = resolveTheme(spec);
  const ctx: Ctx = { theme, brand: brand || spec.name, tagline, copy, animate };
  const sections = variant === "thumbnail" ? spec.sections.slice(0, 1) : spec.sections;

  return (
    <div
      className="@container relative w-full overflow-hidden"
      style={{
        ...theme.vars,
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: theme.fonts.body,
        fontSize: theme.size.body,
        lineHeight: 1.6,
      }}
    >
      <Nav ctx={ctx} />
      <Hero ctx={ctx} />
      {sections.map((section, i) => (
        <Section key={`${section.kind}-${i}`} ctx={ctx} section={section} index={i} />
      ))}
      {variant === "page" && <Footer ctx={ctx} />}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Primitives                                                                */
/* ------------------------------------------------------------------------ */

function Frame({ ctx, children, style }: { ctx: Ctx; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: ctx.theme.maxWidth, paddingInline: ctx.theme.space.gutter, ...style }}
    >
      {children}
    </div>
  );
}

function Reveal({
  ctx,
  children,
  delay = 0,
  className,
  style,
}: {
  ctx: Ctx;
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  if (!ctx.animate) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  const { level, signature } = ctx.theme.spec.motion;
  const amount = level === "calm" ? 0.6 : level === "moderate" ? 1 : 1.6;
  const duration = level === "calm" ? 1 : level === "moderate" ? 0.75 : 0.6;
  const from =
    signature === "slide-reveal"
      ? { opacity: 0, x: -28 * amount }
      : signature === "scale-in"
        ? { opacity: 0, scale: 1 - 0.04 * amount }
        : signature === "parallax-layers"
          ? { opacity: 0, y: 36 * amount }
          : { opacity: 0, y: 20 * amount };
  return (
    <motion.div
      className={className}
      style={style}
      initial={from}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        ease: EASE,
        delay: signature === "parallax-layers" ? delay * 1.6 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

function Heading({
  ctx,
  as: Tag = "h2",
  size,
  children,
  style,
}: {
  ctx: Ctx;
  as?: "h1" | "h2" | "h3";
  size: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Tag className="m-0 text-balance" style={{ ...ctx.theme.display, fontSize: size, ...style }}>
      {children}
    </Tag>
  );
}

function Eyebrow({
  ctx,
  children,
  style,
}: {
  ctx: Ctx;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <p
      className="m-0"
      style={{
        fontSize: ctx.theme.size.small,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontWeight: 600,
        color: "var(--c-accent)",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Button({
  ctx,
  children,
  kind = "primary",
  inverted = false,
}: {
  ctx: Ctx;
  children: ReactNode;
  kind?: "primary" | "secondary";
  inverted?: boolean;
}) {
  const t = ctx.theme;
  const base: CSSProperties = {
    borderRadius: t.buttonRadius,
    padding: "0.8em 1.35em",
    fontSize: t.size.nav,
    fontWeight: 600,
    fontFamily: t.fonts.body,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };
  if (kind === "secondary") {
    return (
      <span
        className="inline-flex items-center gap-[0.5em]"
        style={{
          ...base,
          color: inverted ? "var(--c-on-accent)" : "var(--c-text)",
          border: `1px solid ${inverted ? "var(--c-on-accent)" : t.alpha(t.spec.palette.text, 0.28)}`,
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-[0.5em]"
      style={{
        ...base,
        background: inverted ? "var(--c-on-accent)" : "var(--c-accent)",
        color: inverted ? "var(--c-accent)" : "var(--c-on-accent)",
        boxShadow: t.spec.surface.depth === "flat" ? undefined : t.shadow,
      }}
    >
      {children}
      <ArrowRight style={{ width: "1em", height: "1em" }} aria-hidden />
    </span>
  );
}

function Logo({ ctx }: { ctx: Ctx }) {
  const t = ctx.theme;
  const mark = ["bold-statement", "conversion", "playful-vivid", "technical-precise"].includes(
    t.spec.archetype,
  );
  return (
    <span className="inline-flex min-w-0 items-center gap-[0.5em]">
      {mark && (
        <span
          aria-hidden
          className="inline-block shrink-0"
          style={{
            width: "0.8em",
            height: "0.8em",
            background: "var(--c-accent)",
            borderRadius:
              t.spec.surface.radius === "none" ? 0 : t.spec.surface.radius === "subtle" ? 3 : 999,
          }}
        />
      )}
      <span
        className="truncate"
        style={{
          ...t.display,
          fontSize: `calc(${t.size.nav} * 1.35)`,
          lineHeight: 1,
          letterSpacing: t.display.letterSpacing,
        }}
      >
        {ctx.brand}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Navigation                                                                */
/* ------------------------------------------------------------------------ */

function Nav({ ctx }: { ctx: Ctx }) {
  const t = ctx.theme;
  const { navigation } = t.spec.layout;
  const items = t.spec.copy.nav;
  const link = (label: string) => (
    <span key={label} style={{ fontSize: t.size.nav, color: "var(--c-muted)" }}>
      {label}
    </span>
  );
  const bordered = t.spec.surface.borders !== "none" || navigation === "centered-logo";

  return (
    <header style={{ borderBottom: bordered ? `1px solid var(--c-line)` : undefined }}>
      <Frame ctx={ctx} style={{ paddingBlock: "clamp(14px, 2cqi, 26px)" }}>
        {/* Phone width: every direction collapses to brand + menu. */}
        <div className="flex items-center justify-between gap-4 @min-[720px]:hidden">
          <Logo ctx={ctx} />
          <span className="inline-flex items-center gap-2" style={{ fontSize: t.size.nav }}>
            <Menu style={{ width: "1.3em", height: "1.3em" }} aria-hidden />
          </span>
        </div>

        <div className="hidden items-center gap-8 @min-[720px]:flex">
          {navigation === "bar" && (
            <>
              <Logo ctx={ctx} />
              <nav className="ml-auto flex items-center gap-7">{items.map(link)}</nav>
              <Button ctx={ctx}>{t.spec.copy.primaryCta}</Button>
            </>
          )}
          {navigation === "centered-logo" && (
            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-6">
              <nav className="flex items-center gap-6">
                {items.slice(0, Math.ceil(items.length / 2)).map(link)}
              </nav>
              <Logo ctx={ctx} />
              <nav className="flex items-center justify-end gap-6">
                {items.slice(Math.ceil(items.length / 2)).map(link)}
              </nav>
            </div>
          )}
          {navigation === "minimal-menu" && (
            <>
              <Logo ctx={ctx} />
              <span
                className="ml-auto inline-flex items-center gap-3"
                style={{
                  fontSize: t.size.nav,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {ctx.copy.menu}
                <Menu style={{ width: "1.2em", height: "1.2em" }} aria-hidden />
              </span>
            </>
          )}
          {navigation === "split-cta" && (
            <>
              <Logo ctx={ctx} />
              <nav className="ml-6 flex items-center gap-6">{items.map(link)}</nav>
              <span className="ml-auto flex items-center gap-3">
                {t.spec.copy.secondaryCta && (
                  <Button ctx={ctx} kind="secondary">
                    {t.spec.copy.secondaryCta}
                  </Button>
                )}
                <Button ctx={ctx}>{t.spec.copy.primaryCta}</Button>
              </span>
            </>
          )}
        </div>
      </Frame>
    </header>
  );
}

/* ------------------------------------------------------------------------ */
/* Hero                                                                      */
/* ------------------------------------------------------------------------ */

function Ctas({ ctx, center = false }: { ctx: Ctx; center?: boolean }) {
  const c = ctx.theme.spec.copy;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
      <Button ctx={ctx}>{c.primaryCta}</Button>
      {c.secondaryCta && (
        <Button ctx={ctx} kind="secondary">
          {c.secondaryCta}
        </Button>
      )}
    </div>
  );
}

function Hero({ ctx }: { ctx: Ctx }) {
  const t = ctx.theme;
  const { hero, grid } = t.spec.layout;
  const c = t.spec.copy;
  const pad = { paddingBlock: t.space.section };
  const headline = (style?: CSSProperties) => (
    <Heading ctx={ctx} as="h1" size={t.size.headline} style={style}>
      {c.headline}
    </Heading>
  );
  const sub = (style?: CSSProperties) =>
    c.subheadline ? (
      <p
        className="m-0"
        style={{ fontSize: t.size.lead, color: "var(--c-muted)", maxWidth: "46ch", ...style }}
      >
        {c.subheadline}
      </p>
    ) : null;
  const visual = (slot: string, style?: CSSProperties, caption = true) => (
    <Visual
      theme={t}
      slot={slot}
      brand={ctx.brand}
      label={ctx.copy.imagePlaceholder}
      caption={caption}
      style={style}
    />
  );

  if (hero === "full-bleed-media") {
    return (
      <section className="relative" style={{ minHeight: "clamp(440px, 58cqi, 820px)" }}>
        {visual("hero", { position: "absolute", inset: 0, borderRadius: 0 }, false)}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${t.alpha(t.spec.palette.background, 0.96)} 0%, ${t.alpha(t.spec.palette.background, 0.8)} 38%, ${t.alpha(t.spec.palette.background, 0.1)} 80%)`,
          }}
        />
        <Frame
          ctx={ctx}
          style={{ position: "relative", ...pad, paddingTop: "clamp(160px, 26cqi, 380px)" }}
        >
          <Reveal ctx={ctx} className="flex flex-col gap-[clamp(14px,2cqi,28px)]">
            <Eyebrow ctx={ctx}>{ctx.tagline}</Eyebrow>
            {headline({ maxWidth: "18ch" })}
            {sub()}
            <Ctas ctx={ctx} />
          </Reveal>
        </Frame>
      </section>
    );
  }

  if (hero === "typographic") {
    return (
      <section style={pad}>
        <Frame ctx={ctx}>
          <Reveal ctx={ctx}>
            <Eyebrow ctx={ctx} style={{ marginBottom: "clamp(16px, 2.4cqi, 36px)" }}>
              {ctx.tagline}
            </Eyebrow>
            {headline({ fontSize: `calc(${t.size.headline} * 1.12)` })}
          </Reveal>
          <Reveal
            ctx={ctx}
            delay={0.12}
            className="mt-[clamp(24px,4cqi,56px)] grid gap-6 border-t pt-[clamp(18px,2.4cqi,32px)] @min-[720px]:grid-cols-[2fr_1fr] @min-[720px]:items-end"
            style={{ borderColor: "var(--c-line)" }}
          >
            {sub({ maxWidth: "52ch" })}
            <div className="@min-[720px]:justify-self-end">
              <Ctas ctx={ctx} />
            </div>
          </Reveal>
          <Reveal ctx={ctx} delay={0.2} className="mt-[clamp(24px,4cqi,56px)]">
            {visual("hero", { aspectRatio: "21 / 7" })}
          </Reveal>
        </Frame>
      </section>
    );
  }

  if (hero === "centered-statement") {
    return (
      <section style={pad}>
        <Frame ctx={ctx}>
          <Reveal
            ctx={ctx}
            className="mx-auto flex flex-col items-center gap-[clamp(14px,2cqi,28px)] text-center"
          >
            <Eyebrow ctx={ctx}>{ctx.tagline}</Eyebrow>
            {headline({ maxWidth: "20ch" })}
            {sub({ textAlign: "center" })}
            <Ctas ctx={ctx} center />
          </Reveal>
          <Reveal ctx={ctx} delay={0.15} className="mt-[clamp(28px,5cqi,72px)]">
            {visual("hero", { aspectRatio: "16 / 7", boxShadow: t.shadow })}
          </Reveal>
        </Frame>
      </section>
    );
  }

  if (hero === "offset-collage") {
    return (
      <section style={pad}>
        <Frame ctx={ctx}>
          <div className="grid items-center gap-[clamp(28px,5cqi,72px)] @min-[720px]:grid-cols-2">
            <Reveal ctx={ctx} className="flex flex-col gap-[clamp(14px,2cqi,28px)]">
              <Eyebrow ctx={ctx}>{ctx.tagline}</Eyebrow>
              {headline({ maxWidth: "14ch" })}
              {sub()}
              <Ctas ctx={ctx} />
            </Reveal>
            <Reveal ctx={ctx} delay={0.12} className="relative" style={{ aspectRatio: "1 / 1.02" }}>
              {visual("collage-a", {
                position: "absolute",
                left: 0,
                top: "6%",
                width: "62%",
                height: "70%",
                boxShadow: t.shadow,
              })}
              {visual(
                "collage-b",
                {
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "44%",
                  height: "44%",
                  boxShadow: t.shadow,
                },
                false,
              )}
              {visual(
                "collage-c",
                {
                  position: "absolute",
                  right: "8%",
                  bottom: 0,
                  width: "50%",
                  height: "46%",
                  boxShadow: t.shadow,
                },
                false,
              )}
            </Reveal>
          </div>
        </Frame>
      </section>
    );
  }

  if (hero === "product-stage") {
    return (
      <section style={pad}>
        <Frame ctx={ctx}>
          <Reveal
            ctx={ctx}
            className="grid gap-6 @min-[720px]:grid-cols-[1.2fr_1fr] @min-[720px]:items-end"
          >
            <div className="flex flex-col gap-[clamp(14px,2cqi,24px)]">
              <Eyebrow ctx={ctx}>{ctx.tagline}</Eyebrow>
              {headline({ maxWidth: "13ch" })}
            </div>
            <div className="flex flex-col gap-5 @min-[720px]:pb-2">
              {sub()}
              <Ctas ctx={ctx} />
            </div>
          </Reveal>
          <Reveal
            ctx={ctx}
            delay={0.15}
            className="mt-[clamp(24px,4cqi,56px)] overflow-hidden"
            style={{
              borderRadius: t.mediaRadius,
              background: "var(--c-surface)",
              border: t.border,
              boxShadow: t.shadow,
            }}
          >
            {visual("stage", { aspectRatio: "16 / 7.5", borderRadius: 0 })}
          </Reveal>
        </Frame>
      </section>
    );
  }

  // split-media
  const cols =
    grid === "asymmetric"
      ? "@min-[720px]:grid-cols-[1.25fr_1fr]"
      : grid === "centered"
        ? "@min-[720px]:grid-cols-2"
        : "@min-[720px]:grid-cols-[1fr_1.05fr]";
  return (
    <section style={pad}>
      <Frame ctx={ctx}>
        <div className={`grid items-center gap-[clamp(28px,5cqi,72px)] ${cols}`}>
          <Reveal ctx={ctx} className="flex flex-col gap-[clamp(14px,2cqi,28px)]">
            <Eyebrow ctx={ctx}>{ctx.tagline}</Eyebrow>
            {headline({ maxWidth: "15ch" })}
            {sub()}
            <Ctas ctx={ctx} />
          </Reveal>
          <Reveal ctx={ctx} delay={0.12}>
            {visual("hero", { aspectRatio: "4 / 4.4", boxShadow: t.shadow })}
          </Reveal>
        </div>
      </Frame>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Sections                                                                  */
/* ------------------------------------------------------------------------ */

function SectionHeader({
  ctx,
  section,
  inverted,
}: {
  ctx: Ctx;
  section: DesignSection;
  inverted?: boolean;
}) {
  const t = ctx.theme;
  const centered = t.spec.layout.grid === "centered";
  return (
    <div
      className={`flex flex-col gap-[clamp(10px,1.4cqi,18px)] ${centered ? "items-center text-center" : ""}`}
    >
      {section.eyebrow && (
        <Eyebrow
          ctx={ctx}
          style={inverted ? { color: "var(--c-on-accent)", opacity: 0.8 } : undefined}
        >
          {section.eyebrow}
        </Eyebrow>
      )}
      <Heading ctx={ctx} size={t.size.h2} style={{ maxWidth: "22ch" }}>
        {section.title}
      </Heading>
      {section.body && (
        <p
          className="m-0"
          style={{
            color: inverted ? "var(--c-on-accent)" : "var(--c-muted)",
            maxWidth: "58ch",
            opacity: inverted ? 0.88 : 1,
          }}
        >
          {section.body}
        </p>
      )}
    </div>
  );
}

function Card({ ctx, children, style }: { ctx: Ctx; children: ReactNode; style?: CSSProperties }) {
  const t = ctx.theme;
  const flat = t.spec.surface.borders === "none" && t.spec.surface.depth === "flat";
  return (
    <div
      style={{
        borderRadius: t.radius === 999 ? 28 : t.radius,
        border: t.border,
        background: flat || t.spec.surface.borders !== "none" ? "transparent" : "var(--c-surface)",
        boxShadow: t.spec.surface.depth === "layered" ? t.shadow : undefined,
        padding: flat ? 0 : "clamp(18px, 2.4cqi, 32px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ ctx, section, index }: { ctx: Ctx; section: DesignSection; index: number }) {
  const t = ctx.theme;
  const items = section.items ?? [];
  const band =
    section.kind === "cta"
      ? "var(--c-accent)"
      : index % 2 === 0 && t.spec.surface.depth !== "flat"
        ? "var(--c-surface)"
        : "var(--c-bg)";
  const asym =
    t.spec.layout.grid === "asymmetric" && section.kind !== "cta" && section.kind !== "gallery";
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const visual = (slot: string, style?: CSSProperties, caption = false) => (
    <Visual
      theme={t}
      slot={`${section.kind}-${index}-${slot}`}
      brand={ctx.brand}
      label={ctx.copy.imagePlaceholder}
      caption={caption}
      style={style}
    />
  );

  let body: ReactNode = null;
  switch (section.kind) {
    case "features":
      body = items.length > 0 && (
        <div
          className={`grid gap-[clamp(12px,2cqi,28px)] @min-[560px]:grid-cols-2 ${items.length >= 3 && !asym ? WIDE_COLS[Math.min(items.length, 4)] : ""}`}
        >
          {items.map((it, i) => (
            <Card key={it.title} ctx={ctx}>
              <span
                style={{
                  color: "var(--c-accent)",
                  fontSize: t.size.small,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                {num(i)}
              </span>
              <Heading
                ctx={ctx}
                as="h3"
                size={t.size.h3}
                style={{ marginTop: "0.6em", textTransform: "none", letterSpacing: "-0.01em" }}
              >
                {it.title}
              </Heading>
              {it.text && <p style={{ margin: "0.5em 0 0", color: "var(--c-muted)" }}>{it.text}</p>}
            </Card>
          ))}
        </div>
      );
      break;
    case "services":
      body = items.length > 0 && (
        <div>
          {items.map((it, i) => (
            <div
              key={it.title}
              className="grid items-baseline gap-2 py-[clamp(14px,2.2cqi,28px)] @min-[720px]:grid-cols-[4ch_1fr_1.3fr_auto] @min-[720px]:gap-6"
              style={{ borderTop: "1px solid var(--c-line)" }}
            >
              <span style={{ color: "var(--c-muted)", fontSize: t.size.small }}>{num(i)}</span>
              <Heading ctx={ctx} as="h3" size={t.size.h3}>
                {it.title}
              </Heading>
              <p className="m-0" style={{ color: "var(--c-muted)" }}>
                {it.text}
              </p>
              <ArrowUpRight
                className="hidden @min-[720px]:block"
                style={{ width: "1.2em", height: "1.2em", color: "var(--c-accent)" }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      );
      break;
    case "process":
      body = items.length > 0 && (
        <ol
          className={`m-0 grid list-none gap-[clamp(16px,2.4cqi,32px)] p-0 ${STEP_COLS[Math.min(Math.max(items.length, 2), 4)]}`}
        >
          {items.map((it, i) => (
            <li
              key={it.title}
              className="relative"
              style={{
                borderTop: `2px solid ${i === 0 ? "var(--c-accent)" : "var(--c-line)"}`,
                paddingTop: "1em",
              }}
            >
              <span
                style={{
                  ...t.display,
                  fontSize: t.size.h3,
                  color: "var(--c-accent)",
                  textTransform: "none",
                }}
              >
                {num(i)}
              </span>
              <Heading
                ctx={ctx}
                as="h3"
                size={t.size.h3}
                style={{ marginTop: "0.4em", textTransform: "none", letterSpacing: "-0.01em" }}
              >
                {it.title}
              </Heading>
              {it.text && <p style={{ margin: "0.5em 0 0", color: "var(--c-muted)" }}>{it.text}</p>}
            </li>
          ))}
        </ol>
      );
      break;
    case "showcase":
      body = (
        <div className="grid items-center gap-[clamp(20px,4cqi,56px)] @min-[720px]:grid-cols-[1.3fr_1fr]">
          {visual("main", { aspectRatio: "4 / 3", boxShadow: t.shadow }, true)}
          <div className="flex flex-col gap-[clamp(14px,2cqi,24px)]">
            {items.map((it) => (
              <div
                key={it.title}
                style={{ borderLeft: "2px solid var(--c-accent)", paddingLeft: "1em" }}
              >
                <strong style={{ fontWeight: 600 }}>{it.title}</strong>
                {it.text && (
                  <p style={{ margin: "0.25em 0 0", color: "var(--c-muted)" }}>{it.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
      break;
    case "story":
      body = (
        <div className="grid items-center gap-[clamp(20px,4cqi,56px)] @min-[720px]:grid-cols-[1fr_0.8fr]">
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <p key={it.title} className="m-0" style={{ fontSize: t.size.lead }}>
                <strong style={{ fontWeight: 600 }}>{it.title}.</strong>{" "}
                <span style={{ color: "var(--c-muted)" }}>{it.text}</span>
              </p>
            ))}
          </div>
          {visual("portrait", { aspectRatio: "4 / 5", boxShadow: t.shadow }, true)}
        </div>
      );
      break;
    case "products": {
      const cards =
        items.length > 0
          ? items
          : [
              { title: "", text: "" },
              { title: "", text: "" },
              { title: "", text: "" },
            ];
      body = (
        <div className="grid grid-cols-2 gap-[clamp(12px,2cqi,28px)] @min-[960px]:grid-cols-4">
          {cards.map((it, i) => (
            <div key={`${it.title}-${i}`} className="flex flex-col gap-3">
              {visual(`p${i}`, { aspectRatio: "4 / 5", border: t.border })}
              {it.title && (
                <div>
                  <strong style={{ fontWeight: 600 }}>{it.title}</strong>
                  {it.text && (
                    <p
                      style={{
                        margin: "0.2em 0 0",
                        color: "var(--c-muted)",
                        fontSize: t.size.small,
                      }}
                    >
                      {it.text}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
      break;
    }
    case "gallery":
      body = (
        <div className="grid grid-cols-2 gap-[clamp(8px,1.4cqi,20px)] @min-[720px]:grid-cols-4">
          {visual("g0", { aspectRatio: "1", gridColumn: "span 2", gridRow: "span 2" }, true)}
          {visual("g1", { aspectRatio: "1" })}
          {visual("g2", { aspectRatio: "1" })}
          {visual("g3", { aspectRatio: "1" })}
          {visual("g4", { aspectRatio: "1" })}
        </div>
      );
      break;
    case "cta":
      body = (
        <div>
          <Button ctx={ctx} inverted>
            {t.spec.copy.primaryCta}
          </Button>
        </div>
      );
      break;
  }

  const inverted = section.kind === "cta";
  return (
    <section
      style={{
        background: band,
        color: inverted ? "var(--c-on-accent)" : undefined,
        paddingBlock: t.space.section,
      }}
    >
      <Frame ctx={ctx}>
        <Reveal
          ctx={ctx}
          className={
            asym
              ? "grid gap-[clamp(20px,4cqi,56px)] @min-[960px]:grid-cols-[1fr_2fr]"
              : `flex flex-col gap-[clamp(24px,4cqi,56px)] ${inverted && t.spec.layout.grid === "centered" ? "items-center" : ""}`
          }
        >
          <SectionHeader ctx={ctx} section={section} inverted={inverted} />
          {body}
        </Reveal>
      </Frame>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Footer                                                                    */
/* ------------------------------------------------------------------------ */

function Footer({ ctx }: { ctx: Ctx }) {
  const t = ctx.theme;
  return (
    <footer
      style={{ borderTop: "1px solid var(--c-line)", paddingBlock: "clamp(28px, 4cqi, 56px)" }}
    >
      <Frame ctx={ctx}>
        <div className="flex flex-col gap-6 @min-[720px]:flex-row @min-[720px]:items-center @min-[720px]:justify-between">
          <Logo ctx={ctx} />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {t.spec.copy.nav.map((n) => (
              <span key={n} style={{ fontSize: t.size.nav, color: "var(--c-muted)" }}>
                {n}
              </span>
            ))}
          </nav>
          <span style={{ fontSize: t.size.small, color: "var(--c-muted)" }}>© {ctx.brand}</span>
        </div>
      </Frame>
    </footer>
  );
}
