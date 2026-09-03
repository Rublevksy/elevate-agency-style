// CDP screenshot driver. Usage:
//   node shot.mjs <url> <outdir> <label> <width> <height> <scrollFractions,comma> [reduced]
import WebSocket from "/Users/danastabilnost/Desktop/Elevate Digital Studio/node_modules/ws/index.js";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [url, outdir, label, W, H, fracs, reduced] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const PORT = 9333 + Math.floor(Math.random() * 400);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--no-first-run", "--no-default-browser-check",
  "--disable-gpu", "--hide-scrollbars",
  `--user-data-dir=/tmp/cdp-${PORT}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targets() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      const page = j.find((t) => t.type === "page");
      if (page) return page;
    } catch {}
    await sleep(250);
  }
  throw new Error("no CDP target");
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false, maxPayload: 256 * 1024 * 1024 });
await new Promise((r) => ws.on("open", r));
let id = 0;
const pending = new Map();
ws.on("message", (raw) => {
  const msg = JSON.parse(raw.toString());
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const mid = ++id;
    pending.set(mid, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: +W, height: +H, deviceScaleFactor: 1,
  mobile: +W < 700, screenWidth: +W, screenHeight: +H,
});
if (reduced === "reduced") {
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
}
await send("Page.navigate", { url });
await sleep(5500);

for (const f of fracs.split(",")) {
  await send("Runtime.evaluate", {
    expression: `window.scrollTo({top: (document.body.scrollHeight - window.innerHeight) * ${f}, behavior: 'instant'})`,
    awaitPromise: false,
  });
  await sleep(2200);
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const name = `${outdir}/${label}-${String(f).replace("0.", "p")}.png`;
  writeFileSync(name, Buffer.from(data, "base64"));
  console.log("wrote", name);
}
ws.close();
chrome.kill();
process.exit(0);
