import { CanvasTexture, ExtrudeGeometry, RepeatWrapping, Shape } from "three";

/**
 * Real manufactured geometry helpers.
 *
 * The chassis parts are not boxes: each one is an extruded rounded-rectangle
 * profile with a bevel, which produces genuine machined chamfers along every
 * edge and true rounded corners — the detail that separates a product render
 * from a primitive-box asset.
 */

/** Rounded-rectangle profile, centred on the origin, in the XY plane. */
export function roundedRectShape(w: number, h: number, r: number) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  const rr = Math.min(r, Math.min(w, h) / 2);
  s.moveTo(x + rr, y);
  s.lineTo(x + w - rr, y);
  s.quadraticCurveTo(x + w, y, x + w, y + rr);
  s.lineTo(x + w, y + h - rr);
  s.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  s.lineTo(x + rr, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - rr);
  s.lineTo(x, y + rr);
  s.quadraticCurveTo(x, y, x + rr, y);
  return s;
}

/**
 * A slab with rounded corners and chamfered top/bottom edges, extruded along
 * its local +Z. Mount it with rotation.x = -PI/2 to lie flat (thickness on Y).
 */
export function chamferedSlab({
  w,
  h,
  thickness,
  corner,
  chamfer = 0.075,
  curveSegments = 12,
}: {
  w: number;
  h: number;
  thickness: number;
  corner: number;
  chamfer?: number;
  curveSegments?: number;
}) {
  const c = Math.min(chamfer, thickness / 2.6);
  const g = new ExtrudeGeometry(roundedRectShape(w - c * 2, h - c * 2, Math.max(corner - c, 0.04)), {
    depth: thickness - c * 2,
    bevelEnabled: true,
    bevelThickness: c,
    bevelSize: c,
    bevelOffset: 0,
    bevelSegments: 3,
    curveSegments,
  });
  g.translate(0, 0, -(thickness - c * 2) / 2 - c);
  g.computeVertexNormals();
  return g;
}

/** A frame (rounded outer profile with a rounded hole) — used for the bezel. */
export function chamferedFrame({
  w,
  h,
  innerW,
  innerH,
  thickness,
  corner,
  innerCorner,
}: {
  w: number;
  h: number;
  innerW: number;
  innerH: number;
  thickness: number;
  corner: number;
  innerCorner: number;
}) {
  const shape = roundedRectShape(w, h, corner);
  shape.holes.push(roundedRectShape(innerW, innerH, innerCorner));
  const g = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: 10,
  });
  g.translate(0, 0, -thickness / 2);
  g.computeVertexNormals();
  return g;
}

/**
 * Micro-surface variation for anodised aluminium: a fine noise + faint brushed
 * streaks, used as a roughness map so highlights break up instead of reading
 * as a flat plastic wash.
 */
export function aluminiumRoughnessMap(size = 256) {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);

  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 26;
    d[i] = Math.max(0, Math.min(255, d[i]! + n));
    d[i + 1] = d[i]!;
    d[i + 2] = d[i]!;
  }
  ctx.putImageData(img, 0, 0);

  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 220; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? "#ffffff" : "#5a5a5a";
    ctx.lineWidth = Math.random() * 1.1;
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new CanvasTexture(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

/** Perforated speaker-grill alpha mask: rows of precise micro holes. */
export function grillAlphaMap(cols = 96, rows = 10) {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = cols * 6;
  c.height = rows * 6;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#fff";
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < cols; i++) {
      const x = i * 6 + 3 + (r % 2 ? 3 : 0);
      const y = r * 6 + 3;
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new CanvasTexture(c);
  return tex;
}
