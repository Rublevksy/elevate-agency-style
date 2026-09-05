// Пуллер кадров из видео через CDP. ffmpeg на машине нет.
import WebSocket from "/Users/danastabilnost/Desktop/Elevate Digital Studio/node_modules/ws/index.js";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [videoUrl, outdir, label, timesArg] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const PORT = 9800 + Math.floor(Math.random() * 300);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`,
  "--no-first-run", "--no-default-browser-check", "--disable-gpu",
  "--autoplay-policy=no-user-gesture-required",
  `--user-data-dir=/tmp/cdpf-${PORT}`, "about:blank",
], { stdio: "ignore" });

let page;
for (let i = 0; i < 60 && !page; i++) {
  try {
    const j = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    page = j.find((t) => t.type === "page");
  } catch {}
  if (!page) await sleep(250);
}
const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
await new Promise((r) => ws.on("open", r));
let id = 0; const pending = new Map();
ws.on("message", (raw) => { const m = JSON.parse(raw.toString()); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res, rej) => {
  const mid = ++id;
  pending.set(mid, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
  ws.send(JSON.stringify({ id: mid, method, params }));
});
const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails.exception?.description ?? r.exceptionDetails));
  return r.result.value;
};

await send("Page.enable"); await send("Runtime.enable");
await send("Page.navigate", { url: new URL(videoUrl).origin + "/" });
await sleep(2500);

await evalJs(`
  window.__v = document.createElement('video');
  __v.src = ${JSON.stringify(videoUrl)};
  __v.muted = true; __v.playsInline = true; __v.preload = 'auto';
  document.body.appendChild(__v);
  new Promise((res, rej) => {
    __v.onloadeddata = () => res(1);
    __v.onerror = () => rej(new Error('video load failed: ' + (__v.error && __v.error.code)));
    setTimeout(() => rej(new Error('timeout loading video')), 25000);
  });
`);

const meta = await evalJs(`({ d: __v.duration, w: __v.videoWidth, h: __v.videoHeight })`);
console.log(`META ${label}: duration=${meta.d.toFixed(3)}s size=${meta.w}x${meta.h}`);

for (const frac of timesArg.split(",")) {
  const t = meta.d * parseFloat(frac);
  const dataUrl = await evalJs(`
    new Promise((res, rej) => {
      const done = () => {
        const c = document.createElement('canvas');
        c.width = __v.videoWidth; c.height = __v.videoHeight;
        c.getContext('2d').drawImage(__v, 0, 0);
        res(c.toDataURL('image/png'));
      };
      __v.onseeked = () => setTimeout(done, 260);
      __v.currentTime = ${t};
      setTimeout(() => rej(new Error('seek timeout')), 15000);
    });
  `);
  const name = `${outdir}/${label}-${String(frac).replace("0.", "p").replace(".", "_")}.png`;
  writeFileSync(name, Buffer.from(dataUrl.split(",")[1], "base64"));
  console.log(`  t=${t.toFixed(2)}s -> ${name}`);
}
ws.close(); chrome.kill(); process.exit(0);
