import { CanvasTexture, RepeatWrapping } from "three";

/** thin technical grid with a few "interface" rules — reads as a digital surface */
export function makeGridTexture(size = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d")!;
  x.fillStyle = "#04070c";
  x.fillRect(0, 0, size, size);

  x.strokeStyle = "rgba(120,170,255,0.16)";
  x.lineWidth = 1;
  for (let i = 0; i <= size; i += size / 16) {
    x.beginPath();
    x.moveTo(i, 0);
    x.lineTo(i, size);
    x.stroke();
    x.beginPath();
    x.moveTo(0, i);
    x.lineTo(size, i);
    x.stroke();
  }
  x.strokeStyle = "rgba(150,195,255,0.45)";
  x.lineWidth = 2;
  x.strokeRect(size * 0.08, size * 0.1, size * 0.84, size * 0.8);

  x.fillStyle = "rgba(160,200,255,0.30)";
  x.fillRect(size * 0.12, size * 0.2, size * 0.34, size * 0.03);
  x.fillRect(size * 0.12, size * 0.28, size * 0.5, size * 0.018);
  x.fillRect(size * 0.12, size * 0.62, size * 0.22, size * 0.018);
  x.fillStyle = "rgba(74,130,222,0.55)";
  x.fillRect(size * 0.12, size * 0.7, size * 0.14, size * 0.05);

  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/** soft radial falloff used for haze and bloom sprites */
export function makeGlowTexture(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(150,195,255,0.85)");
  g.addColorStop(0.35, "rgba(70,120,210,0.28)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}
