// Static screenshots of the four real ELEVATE client sites.
//
//   node scripts/capture-client-work.mjs            capture + process all four
//   node scripts/capture-client-work.mjs --process  re-process the last capture only
//
// Why this exists: the homepage used to show client work through WordPress
// mshots at runtime. That is a third-party dependency with no fallback, and
// its captures vary — one arrived with the clinic's own cookie banner over it,
// another as an empty white field. These are captured once, in a real
// browser, in Czech, with consent banners accepted through their OWN buttons
// (never removed by hand), and committed as optimised webp + jpg.
//
// Nothing about the client sites is altered. The only DOM change is hiding the
// fixed-position settings button a consent plugin leaves behind after "accept
// all" — third-party consent UI, not the client's content. The only crop is
// Biodent's mobile header, which headless Chrome renders as an empty white band.
//
// Output (src/assets/work/): <slug>-desktop (1600x1000 fold), <slug>-page
// (1200 wide, the first ~2.5 viewports — what a window scrolls through),
// <slug>-mobile (480 wide phone fold). Each in webp + jpg.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import WebSocket from "ws";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW = path.join(ROOT, "node_modules/.cache/client-work");
const OUT = path.join(ROOT, "src/assets/work");
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// URLs are the Czech editions of the domains in src/lib/projects.tsx.
const SITES = [
  { slug: "biodent-clinic", url: "https://biodentclinic.cz", mobileTop: 72 },
  { slug: "exclusive-beauty", url: "https://exclusivebeauty.cz/cs/", mobileTop: 0 },
  { slug: "nhome-praha", url: "https://inhomepraha.cz/hlavnistranka", mobileTop: 0 },
  { slug: "euromotors", url: "https://euromotors.cz", mobileTop: 0 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = 9341;

async function capture() {
  const chrome = spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${RAW}/_profile`,
      "--lang=cs-CZ",
      "--hide-scrollbars",
      "--no-first-run",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  await sleep(1500);

  async function newPage() {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" });
    const { webSocketDebuggerUrl, id } = await res.json();
    const ws = new WebSocket(webSocketDebuggerUrl);
    await new Promise((r) => ws.on("open", r));
    let n = 0;
    const pending = new Map();
    ws.on("message", (m) => {
      const d = JSON.parse(m);
      if (d.id && pending.has(d.id)) {
        pending.get(d.id)(d);
        pending.delete(d.id);
      }
    });
    const send = (method, params = {}) =>
      new Promise((r) => {
        const i = ++n;
        pending.set(i, r);
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    return { send, close: () => fetch(`http://127.0.0.1:${PORT}/json/close/${id}`) };
  }

  const ACCEPT = `(() => {
    const re = /^(přijmout|přijmout vše|souhlasím|povolit vše|rozumím|accept|accept all|allow all|souhlasit|přijmout všechny)/i;
    const els = [...document.querySelectorAll('button, a, [role=button], input[type=button], input[type=submit]')];
    const hits = els.filter(e => { const t = (e.innerText || e.value || '').trim(); return t.length < 40 && re.test(t) && e.offsetParent !== null; });
    hits.slice(0, 2).forEach(e => e.click());
    return hits.length;
  })()`;
  const HIDE_CONSENT = `[...document.querySelectorAll('body *')].filter(e => { const k = (e.id + ' ' + e.className).toString().toLowerCase(); return getComputedStyle(e).position === 'fixed' && /cookie|consent|cmp|cky|cc-|gdpr/.test(k); }).forEach(e => e.style.setProperty('display','none','important'))`;
  const WALK = `(async () => { const H = Math.min(document.documentElement.scrollHeight, 6000); for (let y = 0; y < H; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); } window.scrollTo(0, 2); await new Promise(r => setTimeout(r, 800)); window.scrollTo(0, 0); })()`;

  for (const site of SITES) {
    for (const mode of ["desktop", "mobile"]) {
      const { send, close } = await newPage();
      await send("Page.enable");
      await send("Network.setUserAgentOverride", {
        userAgent:
          mode === "mobile"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
            : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        acceptLanguage: "cs-CZ,cs;q=0.9",
      });
      const vp =
        mode === "mobile"
          ? { width: 390, height: 844, deviceScaleFactor: 3, mobile: true }
          : { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false };
      await send("Emulation.setDeviceMetricsOverride", vp);
      await send("Page.navigate", { url: site.url });
      await sleep(7000);
      await send("Runtime.evaluate", { expression: ACCEPT });
      await sleep(2000);
      await send("Runtime.evaluate", { expression: WALK, awaitPromise: true });
      await sleep(2500);
      await send("Runtime.evaluate", { expression: HIDE_CONSENT });
      await sleep(6000);

      const shoot = async (name, height, beyond) => {
        const shot = await send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: beyond,
          clip: { x: 0, y: 0, width: vp.width, height, scale: 1 },
        });
        fs.writeFileSync(`${RAW}/${name}.png`, Buffer.from(shot.result.data, "base64"));
      };
      await shoot(`${site.slug}-${mode}-fold`, vp.height, false);
      if (mode === "desktop") {
        const r = await send("Runtime.evaluate", {
          expression: "Math.min(document.documentElement.scrollHeight, 4200)",
          returnByValue: true,
        });
        await shoot(`${site.slug}-desktop-full`, r.result.result.value, true);
      }
      await close();
      console.log("captured", site.slug, mode);
    }
  }
  chrome.kill();
}

async function processAll() {
  for (const site of SITES) {
    const src = (n) => `${RAW}/${site.slug}-${n}.png`;
    const out = async (img, name) => {
      await img.clone().webp({ quality: 78, effort: 6 }).toFile(`${OUT}/${site.slug}-${name}.webp`);
      await img.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${site.slug}-${name}.jpg`);
    };
    // Fold: 2880x1800 -> 1600x1000, plus an 800px cut. A phone shows this
    // capture in a ~290px window; without the small cut the hero pulled four
    // 1600px desktop plates on mobile (measured: 287 KB of the 709 KB first
    // load, more than desktop fetched).
    await out(sharp(src("desktop-fold")).resize(1600, 1000), "desktop");
    await out(sharp(src("desktop-fold")).resize(800, 500), "desktop-sm");
    // Page: the first ~2.5 viewports, 1200 wide.
    const full = await sharp(src("desktop-full")).metadata();
    const pageH = Math.min(full.height, Math.round(full.width * 1.5625));
    await out(sharp(src("desktop-full")).extract({ left: 0, top: 0, width: full.width, height: pageH }).resize(1200), "page");
    // Phone fold, empty header band cropped where headless leaves one.
    const mob = await sharp(src("mobile-fold")).metadata();
    const top = site.mobileTop * 3;
    const h = Math.min(mob.height - top, mob.width * 2);
    await out(sharp(src("mobile-fold")).extract({ left: 0, top, width: mob.width, height: h }).resize(480), "mobile");
    console.log("processed", site.slug);
  }
}

if (!process.argv.includes("--process")) await capture();
await processAll();
process.exit(0);
