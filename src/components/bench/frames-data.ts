/**
 * Placeholder frame set for the T3 mechanical prototype.
 *
 * No A1-A6 here on purpose (ASSET_PLAN.md gates real frame generation behind
 * T6's owner approval, and T3 is only testing whether the ribbon feels like
 * one physical object — content is not the point yet). Six entries because
 * CAMERA_SYSTEM.md §3's worked example for "the Line" scene is six frames
 * (five services + the price frame); reusing that count keeps the pitch math
 * comparable to what a real scene will eventually need, without claiming
 * these six ARE that scene.
 */
export interface BenchFrameData {
  index: number;
  title: string;
  body: string;
}

// Short on purpose: a real frame's box is 88-132px tall (VISUAL_LANGUAGE §6's
// rail clamp) times 4/3 wide, minus padding and the marker row — there is
// room for one short caption line, not a sentence. BenchFrame's own
// `overflow`/`textOverflow`/`whiteSpace` clip regardless, but starting from
// text that already fits avoids leaning on the ellipsis as the only defense.
export const BENCH_FRAMES: BenchFrameData[] = [
  { index: 0, title: "FRAME 01", body: "not A1" },
  { index: 1, title: "FRAME 02", body: "not A2" },
  { index: 2, title: "FRAME 03", body: "not A3" },
  { index: 3, title: "FRAME 04", body: "not A4" },
  { index: 4, title: "FRAME 05", body: "not A5" },
  { index: 5, title: "FRAME 06", body: "not A6" },
];

export const FRAME_COUNT = BENCH_FRAMES.length;
