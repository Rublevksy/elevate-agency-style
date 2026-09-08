# PROOF RESULTS — Light Table, Proof A + Proof B

**Executed 2026-09-08**, under explicit owner authorization to run exactly
`PROOF_PLAN.md`'s two tests, ceiling ~55 credits. **Actual spend: 42.5
credits** (994 → 951.5), under ceiling, matching the plan's per-item cost
predictions exactly (2cr/still, 22.5cr/video). No A2–A6, no full service set,
no case assets, no homepage build. Nothing beyond the two authorized proofs
was generated.

## 1. Generation record

| Item | Model | Params | Count | Cost |
|---|---|---|---|---|
| Proof A, table OFF (dark) | `nano_banana_pro` | 4:3, 2k | 4 | 8cr |
| Proof A, table ON (glowing) | `nano_banana_pro` | 4:3, 2k | 4 | 8cr |
| Proof A, ignition clip | `seedance_2_0` | 4:3, 5s, 720p, std, silent, start/end-image | 1 | 22.5cr |
| Proof B, station join | `nano_banana_pro` | 4:3, 2k, `image_references`: accepted Proof A master | 2 | 4cr |
| **Total** | | | | **42.5cr** |

Model billing note: `job_status` reports `nano_banana_2` for the still jobs —
same benign backend alias already confirmed twice this week (T6, and again
here: exact cost match, byte-identical prompt echo on inspection).

Job IDs: OFF set `54fd5760`, `e53bae87`, `26710773`, `c22940c4`. ON set
`a75c0c15`, `d220bce0`, `6c866ec0`, `22d66009`. Video `1334453d`. Proof B
`b68f7003`, `43aafbab`. Full prompts on file in the batch submission calls;
reproduced in full below for the two accepted masters (§5).

Local files: `/private/tmp/.../scratchpad/proofA/` (8 stills, 1 patched
still, video, 2 crop sets) and `/private/tmp/.../scratchpad/proofB/` (2
stills, 1 crop) — session scratchpad, not the repository, consistent with
the project's established convention of not committing raw generation output
before a master is chosen (T6 precedent).

## 2. Proof A — full defect audit (8 candidates, 1:1 close-crop, not the preview)

**Finding, stated plainly because it changes the production plan: every
candidate that included a "foil-blocked proof card" / "label" style object
came back with an attempted defect on that specific object — a *worse* rate
than T6's screens, and inconsistent with `VISUAL_DIRECTION_V3.md` §8's
assumption that non-screen material subjects carry low text-defect risk.**

| Candidate | State | Defect found (1:1 crop) | Verdict |
|---|---|---|---|
| off-1 | dark | Foil card carries crisp, deliberately embossed English words ("...EMBOSSED / PROOF LABEL"-type text) | **FAIL** — hard exclusion violated |
| off-2 | dark | Same card object, text-like rows visible at full-frame inspection, consistent pattern | **FAIL** |
| off-3 | dark | Card carries multiple rows of specimen-label text with a numeric code, styled like a real registration tag | **FAIL** — worst of the four, most legible |
| off-4 | dark | Gold plate carries fine embossed text rows | **FAIL** |
| on-1 | glowing | Card region (fanned proof-photo stack) — genuinely abstract, no glyph structure at 1:1 | **PASS** |
| on-2 | glowing | Dark book cover carries a blind-embossed garbled word-like mark | **FAIL (soft)** — not legible as a specific word, but clearly letterform-structured |
| on-3 | glowing | Card shows a halftone-dot pattern resembling a stylized face/portrait silhouette | **FAIL (soft)** — borders the "no faces" exclusion, not literal text |
| on-4 | glowing | Foil card carries an invented angular emblem, not text but a distinct logo-like graphic mark | **FAIL (soft)** — violates "no logos/brand marks" in spirit |

**Result: 0 of 8 candidates fully clean. 4 of 4 dark-state candidates hard-fail
on literal readable text — worse than any prior batch this project has run.
1 of 4 glowing-state candidates (on-1) is clean; the other 3 carry softer,
non-text invented marks.**

This is the single most important finding of the proof phase and is reported
as such, not minimized: **any future prompt that includes a card-, label-,
plate-, or tag-shaped object in this material world should be treated as a
guaranteed defect, not a possible one**, until proven otherwise by a
prompt revision that explicitly forbids any printed, embossed, or debossed
mark of any kind — including abstract ones — on that specific object class.
"Completely illegible" as a phrase was not sufficient; the model reads a
foil-blocked card as an object *that ought to carry a label* and supplies
one regardless of the exclusion clause.

## 3. Proof A — selected master and rationale

**Winner: on-1** (job `a75c0c15-124e-4ca9-9073-ad5d6b6649e9`).

Per the owner's explicit selection criterion — do not default to the
tasteful/safe candidate, prefer the strongest visual impact, density,
material presence, and transformation potential, while still requiring
ELEVATE identity and professional execution — the four glowing-state
candidates were ranked on both spectacle and cleanliness, not cleanliness
alone:

- **on-4**'s resin block (a glowing internal swirl, genuinely the single most
  striking individual object across all 8 candidates) is arguably the
  boldest isolated image in the set, but the frame carries an invented
  logo-like emblem (§2) and a slightly less unified, less dense overall
  composition than on-1.
- **on-3** has the busiest, most cluttered arrangement (closer to a flat-lay
  grid of many small objects than one coherent table), the weakest
  composition of the four, and a face-adjacent defect.
- **on-2** is strong but reads as two separate zones (a grid of small items
  above, a looser arrangement below) rather than one unified surface, and
  carries the embossed-word defect.
- **on-1** is the densest, most unified, most cinematically composed frame
  of the four **and** is the only one that survives the 1:1 defect audit
  clean. It is not the "safe" choice — it is the frame with the most objects
  in play, the strongest volumetric haze, and the clearest single-source
  light logic (§2.1 of V3) — and it happens to also be defect-free. Where
  spectacle and cleanliness pointed in different directions (on-4 vs. on-1),
  cleanliness won only because a logo-like defect is a hard, non-negotiable
  exclusion per the project's own standing rules, not because the safer
  image was preferred on taste.

**Prompt used (verbatim, reproduced in full per `PROOF_PLAN.md`'s
documentation requirement):**

> Extreme wide cinematic photograph, top-down architectural angle onto a
> massive backlit worktable, now fully powered on: the entire table surface
> glows with a saturated, vivid electric-blue light rising from beneath the
> glass, pouring up through and around every object on it. Densely and
> deliberately arranged across its surface, all now dramatically backlit: a
> tall stack of glossy litho colour-proof sheets fanned open and glowing at
> their edges, a long coiled ribbon of film now illuminated from within
> showing a faint abstract structural pattern of light and shadow,
> completely illegible, no text, no icons; a thick slab of cast amber resin
> now lit from below and glowing at its core, translucent vellum sheets
> glowing through with visible fibre texture, a foil-blocked card catching
> hard blue light. Volumetric haze rising off the glowing surface, visible
> light rays cutting upward through dust in the air, extremely rich layered
> depth, strong sense of energy and transformation, dense and spectacular
> composition filling the frame edge to edge. Photoreal, 35mm film still,
> cinematic, heavy visible film grain, exactly one chromatic colour in the
> entire frame, a saturated electric blue, every other surface neutral
> near-black or grey. Strictly excluded: any readable text, letters,
> numbers, words, typography, logos, watermarks, brand marks, generic UI
> screens or interface chrome showing legible content, faces, hands, people,
> cartoon or illustration style, mascot, purple magenta teal or orange
> colour cast, generic office desk, stock-photography look, browser windows,
> laptop chrome, cyberpunk neon signage.

No OFF-state candidate is accepted as a master — all four fail (§2). For the
ignition video test only, off-1 was used with the defective card region
locally blurred (a rough, visible stand-in patch, not a production fix) so
the video test wasn't blocked on a still-image defect it didn't need to
inherit. This is disclosed, not hidden: the patch is crude (a visible blur
rectangle), acceptable for testing motion/continuity, not acceptable as a
production asset.

## 4. Proof A — the ignition clip

Generated with `seedance_2_0`, start_image = the locally-patched off-1,
end_image = the accepted on-1 master, 5s/720p/std/silent. Job completed
without error; cost matched the 22.5cr preflight exactly.

**Honesty note on verification depth:** this environment has no `ffmpeg`,
and the CDP-based multi-timestamp frame extraction used successfully
elsewhere in this project's QA (T2–T5) did not complete for this file — the
video's `<video>` element never fired `onseeked` in headless Chrome before
the process was killed, a tooling gap being disclosed rather than papered
over. What *was* obtained: a QuickLook poster-frame thumbnail (`qlmanage`),
which happened to land mid-transition — it shows the table's front edge
already lit with rising blue glow while the objects on top are still mostly
dark, i.e. a genuine progressive ignition state, not a jump-cut or a static
frame. No visible artifacts, no readable marks, in that frame. This
supports, but does not fully prove, that the full 5 seconds reads as a
continuous, controlled transformation rather than an abrupt or glitchy one.
**Full motion QA (does the whole clip play cleanly start to finish) still
requires a real browser viewing, and that is flagged as outstanding**, not
claimed as done.

## 5. Proof A — the ten-question evaluation (against the winning candidate, on-1)

1. **Immediate WOW?** Yes — dense, volumetric, spectacular; a materially
   different reaction than Production Strip's restrained plates.
2. **Distinctiveness?** Real but partial. Litho proofs, film, resin, and
   vellum are genuinely more specific than basalt/aluminum/glass, and no
   generic UI or dashboard content appears anywhere. But the saturated
   blue-glow-on-black-void silhouette, taken as a whole, still sits inside a
   recognizable "glowing table" visual cluster — material specificity
   narrows the genericness risk, it does not eliminate it. This is the same
   open tension `VISUAL_DIRECTION_V3.md` §17 named and did not claim to
   fully resolve; this proof does not resolve it either, it just confirms
   the mitigation is real, not just asserted.
3. **Can a series be built from it?** Yes, and Proof B (§6) is direct
   evidence: a second position along the same table, generated independently
   via `image_references`, reads as the same world.
4. **Old visual conflict returning?** No — no mascot, no card, no rounded
   panel, no browser chrome.
5. **Expensive next to mechanics?** Not tested here — no registration-mark
   overlay or bench-rail mechanics were composited against these stills;
   that composite test is a later step (T7-equivalent), not this proof's job.
6. **Material realism?** High — resin, film, and vellum all show correct,
   distinct light interaction (resin glows from its core, vellum shows fibre
   texture through backlight, film shows a translucent structural pattern).
7. **Visual density?** High, deliberately — this is the clearest structural
   win against the owner's "not minimalism" correction: four to six distinct
   objects in frame at once, not one hero object in a void.
8. **ELEVATE identity, without the logo?** Partial. The single-blue-signal
   discipline is present and consistent, but nothing in a raw photograph
   ties it to ELEVATE specifically without the code-drawn registration-mark
   layer (§2.2 of V3) composited on top — untested here by design (§8's
   "what this document does not decide" applies equally to this proof).
9. **Ready to become a living interactive scene?** Plausible — the dense,
   multi-object arrangement gives multiple real candidate hotspots for a
   hover/focus mechanic, more naturally than a sparse single-object frame
   would have.
10. **Falls back into calm/editorial?** **No — the opposite of the risk
    flagged after V3.** This candidate reads as maximal and dramatic, not
    tasteful and quiet. That specific concern, raised by V3's own
    independent critique, does not reproduce in this generated result.

## 6. Proof B — continuity test

**Question asked: does this feel like the camera moving through one
extraordinary physical world, or two separate AI pictures placed side by
side?**

**Answer: reads as one continuous world, more convincingly in join-2 than
join-1.** Both candidates (jobs `43aafbab`, `b68f7003`) were generated using
the accepted Proof A master (`a75c0c15`) as an `image_references` input, at
2cr each. Both are clean at the 1:1 audit (verified by close crop on the one
ambiguous object in join-1 — a mechanical table-frame latch, not a
card/label). **join-2 in particular shows partial, uncropped bleed of the
Proof A master's own resin block and film coil at its frame edges** — direct
visual evidence the model treated the reference image as an adjacent camera
position on the same table, not a new unrelated scene. Same glass edge
material, same aluminum frame, same light color and intensity, same haze
density.

**Verdict: the join mechanism works as designed.** This is the single most
important structural claim `VISUAL_DIRECTION_V3.md` depends on ("one object
carries the whole page"), and it held up under a real, independent
generation — not just under the earlier documentation-stage argument.

## 7. Independent critique

Run against the actual accepted images, not a description of them — a
reviewer given the files directly, the same discipline applied to V2 and
V3. **This critique overturned part of §3 and §5's framing above, and that
correction is kept rather than smoothed over.**

1. **Does on-1 hit "what the fuck is this"? No.** Direct quote: *"a well-
   executed, tasteful cinematic product shot... 'dense and blue' is exactly
   what it is, and density alone doesn't produce shock... the platonic-ideal
   version of a now-common AI genre... executed competently, not a
   surprising or unfamiliar image."* This is a materially harder judgment
   than §5 Q1 above ("spectacular") gave it, and it is accepted, not argued
   with — a first-pass author reviewing their own selected winner is exactly
   the situation this kind of independent check exists to catch.
2. **on-1 vs on-4:** confirmed independently — on-4's emblem is "a genuine
   angular emblem... clearly a designed graphic, not noise," if anything a
   more confident call than §3 made. On-4's resin block is independently
   confirmed as the single most striking object across all 8 candidates.
   Losing it to a defect is a real creative cost, not a free win.
3. **off-1's card text:** confirmed independently at 1:1, unprompted —
   "PROOF" reads as "completely unambiguous — not a smear, not a maybe."
   §2/§3 above are accurate here, not overstated.
4. **Proof B's continuity claim is weaker than §6 states.** Direct quote:
   *"two independently generated 2-credit stills sharing a reference image
   and a color palette is a low bar to clear — it proves style/material
   consistency, not that a moving camera would hold geometry, parallax, or
   object scale correctly across a scroll... accurate for 'same set
   dressing,' optimistic for 'this join mechanism works for an actual
   camera move.'** §6's "the join mechanism works as designed" is corrected
   by this — it should read "the join mechanism produces consistent set
   dressing," a real but smaller claim.
5. **Genericness is not resolved, and this proof is direct evidence of
   that, not evidence against it.** Direct quote: *"the specificity lives in
   the props, not the lighting language... the distinctiveness claim is
   currently more promise than delivered."* The exact risk `VISUAL_DIRECTION
   _V3.md` §17 flagged and did not claim to resolve is reproduced here under
   real generation, not just still open on paper.
6. **The defect pattern is systemic across both states, not dark-state-
   specific.** 3 of 4 glowing-state candidates also carried defects; on-1
   is clean by the luck of the draw among four attempts, not because the
   glowing-state prompt is inherently safer. §8's original framing (fix the
   dark-state prompt) understated this and is corrected below.

## 7.1. Self-correction, stated plainly

The first draft of this document (§3, §5) called on-1 "spectacular" and
Proof B's continuity "the join mechanism works as designed." Independent,
fresh-eyes review of the same images does not support either claim at that
strength. This is recorded rather than quietly edited away, because the
gap between a first-pass author's read and a cold read of the same evidence
*is itself the finding the owner most needs to see* — it is the exact
failure mode ("did we rationalize a miss as a win") the task explicitly
warned against.

## 8. GO / NO-GO recommendation

**NO-GO on proceeding to full asset generation as this direction currently
stands. Not a rejection of the light-table concept's infrastructure — a
rejection of the claim that this specific execution has cleared the owner's
WOW bar.** Per explicit instruction, this is not softened into a conditional
pass: the independent review's plainest sentence is the one that governs
this recommendation — on-1 is *"a well-executed, tasteful cinematic product
shot... not a surprising or unfamiliar image."* That is a miss against
"what the fuck is this," not a near-hit.

**What is genuinely validated, and should not be thrown out with the miss:**

- Material specificity (litho proofs, film, resin, vellum) is real and
  distinct from the basalt/aluminum/glass cluster V2 was critiqued for —
  confirmed independently.
- The dark-state generation is unusable as-is: 0-for-4 clean, and — corrected
  from this document's first draft — **the same defect class also hit 3 of
  4 glowing-state candidates.** This is a systemic risk across the whole
  material world's card/label/plate-shaped objects, not a dark-state-only
  problem. Any future prompt must either drop that object class or add a
  much stronger, tested "no marks of any kind, including abstract ones"
  clause before it's trusted at production scale.
- Proof B shows real style/material consistency across a reference-guided
  join — a smaller, still useful claim than "the camera move works," which
  was not actually tested by two static stills.

**What is not validated, and is the real reason for NO-GO:** the central
open question this whole proof phase existed to answer — *has the
genericness fix pulled the direction toward something calmer than the
brief wants* — comes back **yes, on the evidence of the cleanest surviving
candidate.** The specificity lives in the props; the lighting treatment
itself (saturated blue glow rising through haze over a dark void) remains
one of the most repeated visual tropes in current AI generation. This is not
a documentation-stage worry anymore — it happened, under real generation,
to the actual winning candidate.

**Recommended next step: a creative iteration, not a technical patch.**
Per the explicit instruction not to protect the current concept: the fix
here is not "regenerate the same prompt with cleaner cards." It is testing
whether this object (a table being inspected, however densely loaded) can
ever deliver shock rather than admiration — or whether the direction needs
a more kinetic, more dramatic mechanism (movement, scale, or a genuinely
unfamiliar composition, not just more objects on a surface) to clear the
bar the owner actually set. That is a creative-direction question for the
owner to weigh in on before any further credits are spent, not something
this document should resolve unilaterally by picking a next prompt.

Also still open regardless of the direction question: the registration-mark
strip-test (§4.6 of V3) has not been run against real photography, and full
multi-frame video QA needs a real browser view this environment could not
fully provide.

Nothing beyond the two authorized proofs was generated. No A2–A6, no case
assets, no homepage build. 42.5 of the ~55-credit ceiling was spent; no
further generation is authorized by this document.
