import { useEffect, useRef, type RefObject } from "react";

/**
 * ELEVATE digital environment — a WebGL field of digital matter.
 *
 * Three real depth layers rendered in one fragment shader:
 *   FAR  — very faint particle network with hairline connections
 *   MID  — large flowing digital structures (domain-warped filaments)
 *   NEAR — small interface fragments and thin light trails
 *
 * Everything travels along the cinematic scroll progress passed in through
 * `progressRef`: stop scrolling and the environment stops, scroll back and it
 * reverses. Mouse influence is depth weighted and measured in a few pixels.
 * The palette is strictly near-black, graphite, deep navy, cool white and
 * ELEVATE blue — no purple, no galaxy, no wallpaper.
 */
type Props = {
  className?: string;
  /** cinematic scroll progress, 0 → 1 (the only motion driver) */
  progressRef?: RefObject<number>;
  /** 0 → 1 multiplier applied every frame */
  intensityRef?: RefObject<number>;
};

const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 o;

uniform vec2 uRes;
uniform vec2 uMouse;     // -0.5 .. 0.5
uniform float uFlow;     // scroll-driven travel
uniform float uK;        // intensity
uniform float uMobile;

const vec3 BLACK  = vec3(0.020, 0.027, 0.043);
const vec3 NAVY   = vec3(0.055, 0.094, 0.165);
const vec3 STEEL  = vec3(0.404, 0.478, 0.580);
const vec3 BLUE   = vec3(0.290, 0.510, 0.870);
const vec3 COOL   = vec3(0.780, 0.855, 0.960);

float hash1(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.7))) * 43758.5453); }
vec2  hash2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash1(i), b = hash1(i + vec2(1.0, 0.0));
  float c = hash1(i + vec2(0.0, 1.0)), d = hash1(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* large flowing digital structure: domain-warped ridges, thin and directional */
float filaments(vec2 p, float scale, float sharp){
  vec2 q = p * scale;
  vec2 w = vec2(fbm(q + vec2(1.7, 9.2)), fbm(q * 1.13 + vec2(8.3, 2.8)));
  float f = fbm(q + w * 1.6);
  float ridge = 1.0 - abs(f - 0.5) * 2.0;
  return pow(clamp(ridge, 0.0, 1.0), sharp);
}

/* faint particle network with short-range links, on a hashed grid */
float network(vec2 uv, float cells, float link, out float dots){
  vec2 g = uv * cells;
  vec2 id = floor(g);
  dots = 0.0;
  float lines = 0.0;
  vec2 pts[9];
  for (int y = -1; y <= 1; y++){
    for (int x = -1; x <= 1; x++){
      vec2 c = id + vec2(float(x), float(y));
      vec2 p = c + 0.15 + 0.7 * hash2(c);
      pts[(y + 1) * 3 + (x + 1)] = p;
      float d = length(g - p);
      dots += smoothstep(0.055, 0.0, d) * (0.35 + 0.65 * hash1(c + 3.7));
    }
  }
  for (int i = 0; i < 9; i++){
    for (int j = i + 1; j < 9; j++){
      vec2 a = pts[i], b = pts[j];
      float len = length(b - a);
      if (len > link) continue;
      vec2 pa = g - a, ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
      float d = length(pa - ba * h);
      lines += smoothstep(0.006, 0.0, d) * (1.0 - len / link) * 0.5;
    }
  }
  return lines;
}

/* small interface fragments: hairline rectangles with a couple of internal rules */
float fragments(vec2 uv, float cells){
  vec2 g = uv * cells;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float seed = hash1(id * 1.37);
  if (seed < 0.72) return 0.0;
  vec2 h = hash2(id + 5.1);
  vec2 size = vec2(0.30 + h.x * 0.30, 0.16 + h.y * 0.16);
  vec2 org = (vec2(1.0) - size) * hash2(id + 11.3);
  vec2 d = abs(f - org - size * 0.5) - size * 0.5;
  float edge = abs(max(d.x, d.y));
  float frame = smoothstep(0.006, 0.0, edge) * step(max(d.x, d.y), 0.02);
  float inside = step(max(d.x, d.y), 0.0);
  vec2 l = (f - org) / size;
  float rules = 0.0;
  rules += smoothstep(0.03, 0.0, abs(l.y - 0.28)) * step(l.x, 0.55);
  rules += smoothstep(0.03, 0.0, abs(l.y - 0.46)) * step(l.x, 0.34);
  rules += smoothstep(0.03, 0.0, abs(l.y - 0.74)) * step(l.x, 0.68);
  return frame + inside * rules * 0.45;
}

void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;
  vec2 c = (px - 0.5 * uRes) / uRes.y;    // aspect-correct, centred
  float flow = uFlow;

  /* ---------- FAR: particle network, barely there, almost no parallax ---- */
  float dots = 0.0;
  vec2 farUV = c * 1.0 + vec2(flow * 0.10, -flow * 0.03) + uMouse * 0.012;
  float links = network(farUV, 7.0, 0.55, dots);
  float far = dots * 0.55 + links * 0.30;

  /* ---------- MID: large flowing digital structures ---------------------- */
  vec2 midUV = c * 0.9 + vec2(flow * 0.42, -flow * 0.10) + uMouse * 0.05;
  float s1 = filaments(midUV, 1.15, 9.0);
  float s2 = filaments(midUV * 0.62 + vec2(4.2, -1.1) + vec2(flow * 0.2, 0.0), 1.5, 16.0);
  float mid = s1 * 0.55 + s2 * 0.45;
  /* travelling brightness along the structures — pure scroll, no timeline */
  float head = fract(flow * 0.55 + midUV.x * 0.16 + midUV.y * 0.05);
  mid *= 0.55 + 0.9 * pow(1.0 - abs(head - 0.5) * 2.0, 3.0);

  /* ---------- NEAR: interface fragments + light trails ------------------- */
  vec2 nearUV = c * 1.35 + vec2(flow * 0.9, -flow * 0.22) + uMouse * 0.14;
  float frag = fragments(nearUV, 2.6) * (1.0 - uMobile * 0.45);
  float trails = pow(filaments(nearUV * 1.9 + vec2(0.0, flow * 0.4), 2.2, 34.0), 1.4);

  /* ---------- volumetric haze ------------------------------------------- */
  float haze = fbm(c * 0.85 + vec2(flow * 0.28, flow * 0.06) + uMouse * 0.03);
  haze = pow(clamp(haze, 0.0, 1.0), 1.6);

  /* ---------- depth falloff: the world dissolves toward the edges -------- */
  float r = length(c * vec2(0.82, 1.05));
  float depth = smoothstep(1.15, 0.12, r);
  float centreLift = smoothstep(0.95, 0.05, r);

  vec3 col = BLACK;
  col += NAVY * haze * 0.85 * depth;
  col += mix(NAVY, BLUE, 0.55) * mid * 0.26 * depth;
  col += BLUE * mid * mid * 0.10 * centreLift;
  col += STEEL * far * 0.42 * depth;
  col += COOL * trails * 0.055 * depth;
  col += mix(STEEL, COOL, 0.4) * frag * 0.09 * depth;

  /* atmospheric glow behind the product, slightly right of centre */
  float g = exp(-pow(length((c - vec2(0.10, 0.02)) * vec2(1.0, 1.25)) * 1.9, 2.0));
  col += mix(NAVY, BLUE, 0.35) * g * 0.16;

  col *= uK;
  col = max(col, vec3(0.0));
  o = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export function NeuralField({ className = "", progressRef, intensityRef }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "high-performance" });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uFlow = gl.getUniformLocation(prog, "uFlow");
    const uK = gl.getUniformLocation(prog, "uK");
    const uMobile = gl.getUniformLocation(prog, "uMobile");

    const mobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.5);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let visible = true;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    gl.uniform1f(uMobile, mobile ? 1 : 0);

    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      const k = Math.max(0, Math.min(1, intensityRef?.current ?? 1));
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uFlow, progressRef?.current ?? 0);
      gl.uniform1f(uK, 0.35 + k * 0.65);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = 0.5 - e.clientY / window.innerHeight;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = !!entry?.isIntersecting;
        if (next === visible) return;
        visible = next;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(draw);
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progressRef, intensityRef]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
