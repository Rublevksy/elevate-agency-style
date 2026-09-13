/**
 * Checks for the Builder's trust boundary — run with Node's built-in type
 * stripping (no test runner exists in this repo):
 *
 *   node scripts/check-builder-spec.ts
 *
 * Covers what must never regress: malformed / hostile model output is
 * rejected or neutralised, colours are repaired to readable contrast, numeric
 * claims are stripped, recoloured sets fail the distinctness gate, the tool
 * schema stays in sync with zod, and the dev fixtures pass the same pipeline
 * as real output.
 */
import assert from "node:assert/strict";
import {
  ConceptSetSchema,
  assessDistinctness,
  cleanText,
  contrast,
  parseDraft,
  parseStoredSpec,
  toSpec,
  type DesignSpecDraft,
} from "../src/lib/builder/spec.ts";
import { toJsonSchema } from "../src/lib/builder/tool-schema.ts";
import { FIXTURE_DRAFTS, FIXTURE_DRAFTS_B } from "../src/lib/builder/fixtures.dev.ts";

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    throw err;
  }
};

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const base = FIXTURE_DRAFTS[0];

test("both fixture sets parse, state no figures, and pass the distinctness gate", () => {
  for (const set of [FIXTURE_DRAFTS, FIXTURE_DRAFTS_B]) {
    const drafts = set.map((f) => {
      const r = parseDraft(f, { rejectClaims: true });
      assert.ok(r.ok, JSON.stringify(!r.ok && r.issues));
      return r.draft;
    });
    assert.deepEqual(assessDistinctness(drafts), []);
  }
});

test("rejects unknown enum values (the model cannot invent a layout)", () => {
  const bad = clone(base) as unknown as { layout: { hero: string } };
  bad.layout.hero = "<script>alert(1)</script>";
  assert.equal(parseDraft(bad).ok, false);
});

test("rejects non-hex colours (no CSS injection through palette)", () => {
  const bad = clone(base);
  bad.palette.accent = "red; background:url(https://evil.example)";
  assert.equal(parseDraft(bad).ok, false);
});

test("rejects extra sections beyond the limit and missing required fields", () => {
  const many = clone(base);
  many.sections = Array.from({ length: 7 }, () => clone(base.sections[0]));
  assert.equal(parseDraft(many).ok, false);
  const missing = clone(base) as Partial<DesignSpecDraft>;
  delete missing.copy;
  assert.equal(parseDraft(missing).ok, false);
});

test("strips markup and URLs; drops whole sentences that state figures", () => {
  assert.equal(cleanText("<b>Nejlepší</b> káva", 80), "bNejlepší/b káva");
  assert.equal(cleanText("Navštivte https://evil.example teď", 80), "Navštivte teď");
  assert.equal(cleanText("O 180 % více objednávek", 80), "");
  assert.equal(cleanText("Přes 500+ spokojených klientů", 80), "");
  assert.equal(cleanText("15 let zkušeností", 80), "");
  assert.equal(cleanText("Over 1,200 customers trust us", 80), "");
  assert.equal(
    cleanText("Pražíme v malých várkách. 250 % lepší chuť a 15 let zkušeností.", 120),
    "Pražíme v malých várkách.",
  );
  assert.equal(cleanText("Малі партії, свіжа кава", 80), "Малі партії, свіжа кава");
  assert.equal(cleanText("Tři kroky k předplatnému", 80), "Tři kroky k předplatnému");
});

test("a first answer with figures is sent back; the repair answer drops them", () => {
  const claimy = clone(base);
  claimy.copy.subheadline = "Pražíme v malých várkách. O 40 % čerstvější káva.";
  const strict = parseDraft(claimy, { rejectClaims: true });
  assert.equal(strict.ok, false);
  assert.ok(!strict.ok && strict.issues.some((i) => i.path === "copy.subheadline"));
  const lenient = parseDraft(claimy);
  assert.ok(lenient.ok && lenient.draft.copy.subheadline === "Pražíme v malých várkách.");
});

test("a headline that was only a claim is rejected, not rendered empty", () => {
  const bad = clone(base);
  bad.copy.headline = "+250 %";
  assert.equal(parseDraft(bad).ok, false);
});

test("unreadable palettes are repaired to WCAG contrast", () => {
  const grey = clone(base);
  grey.palette = {
    background: "#777777",
    surface: "#777777",
    text: "#888888",
    muted: "#7a7a7a",
    accent: "#808080",
    onAccent: "#858585",
  };
  const r = parseDraft(grey);
  assert.ok(r.ok);
  const p = r.draft.palette;
  assert.ok(contrast(p.text, p.background) >= 7, `text ${contrast(p.text, p.background)}`);
  assert.ok(contrast(p.muted, p.background) >= 4.5, `muted ${contrast(p.muted, p.background)}`);
  assert.ok(contrast(p.onAccent, p.accent) >= 4.5, `onAccent ${contrast(p.onAccent, p.accent)}`);
});

test("five recolours of one layout fail the distinctness gate", () => {
  const recolours = ["#ff0000", "#00aa00", "#0000ff", "#aa00aa", "#008888"].map((accent, i) => {
    const x = clone(base);
    x.palette.accent = accent;
    x.archetype = (
      ["editorial", "luxury-minimal", "bold-statement", "conversion", "warm-human"] as const
    )[i];
    return x;
  });
  const issues = assessDistinctness(recolours);
  assert.ok(issues.some((i) => i.path.includes("hero")));
  assert.ok(issues.some((i) => i.path.includes("~")));
});

test("stored specs are re-validated (tampered localStorage is refused)", () => {
  const spec = toSpec(
    parseDraft(base).ok ? (parseDraft(base) as { draft: DesignSpecDraft }).draft : base,
    "c-test0001",
  );
  assert.ok(parseStoredSpec(clone(spec)));
  const tampered = clone(spec) as unknown as { typography: { display: string } };
  tampered.typography.display = "comic-sans";
  assert.equal(parseStoredSpec(tampered), null);
  assert.equal(parseStoredSpec({ ...clone(spec), id: "../../etc" }), null);
});

test("the tool schema mirrors the zod schema", () => {
  const schema = toJsonSchema(ConceptSetSchema) as {
    properties: {
      concepts: {
        minItems: number;
        maxItems: number;
        items: { required: string[]; properties: Record<string, { enum?: string[] }> };
      };
    };
  };
  assert.equal(schema.properties.concepts.minItems, 5);
  assert.equal(schema.properties.concepts.maxItems, 5);
  const item = schema.properties.concepts.items;
  for (const key of ["name", "archetype", "palette", "typography", "layout", "copy", "sections"])
    assert.ok(item.required.includes(key), key);
  assert.ok(item.properties.archetype.enum?.includes("editorial"));
});

console.log(`\n${passed} checks passed`);
