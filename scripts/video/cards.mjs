/**
 * Renders the intro card, outro card and caption strips as PNGs, using the same
 * typography and palette as the site.
 *
 *   node scripts/video/cards.mjs
 *
 * Captions are burned in because most Facebook and LinkedIn views play muted —
 * the message has to land without sound.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const SIZE = 1080;
const OUT = resolve("video-out/cards");
mkdirSync(OUT, { recursive: true });

/** Kept in sync with src/app/globals.css. */
const TOKENS = `
  --void:#05060a; --ink:#eceef5; --mute:#868c9e; --dim:#5a6072; --acid:#ccff3d;
`;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&family=Instrument+Serif:ital@0;1&display=swap');
`;

const BASE = `
  ${FONTS}
  *{margin:0;padding:0;box-sizing:border-box}
  :root{${TOKENS}}
  body{
    width:${SIZE}px;height:${SIZE}px;
    font-family:'Geist',system-ui,sans-serif;
    color:var(--ink);
    -webkit-font-smoothing:antialiased;
  }
  .mono{font-family:'Geist Mono',ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase}
  .serif{font-family:'Instrument Serif',Georgia,serif;font-style:italic;color:var(--acid)}
  .display{font-weight:600;letter-spacing:-.045em;line-height:.9}
`;

/** The dark ground plus the site's aurora, so cards feel cut from the page. */
const GROUND = `
  position:fixed;inset:0;background:var(--void);
  background-image:
    radial-gradient(700px circle at 12% 8%, #6d4dff44, transparent 60%),
    radial-gradient(600px circle at 92% 96%, #3ddcff2e, transparent 60%);
`;

const introHtml = `<style>${BASE}</style>
<div style="${GROUND}"></div>
<div style="position:fixed;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:88px 84px">
  <div style="display:flex;align-items:center;gap:18px">
    <span style="width:14px;height:14px;border-radius:999px;background:var(--acid)"></span>
    <span class="mono" style="font-size:19px;color:var(--mute)">Portfolio — 2026</span>
  </div>
  <div>
    <p class="display" style="font-size:132px">Kausarul</p>
    <p class="display" style="font-size:132px;color:transparent;-webkit-text-stroke:2px #eceef58c">Islam</p>
    <p class="serif" style="font-size:60px;margin-top:34px">Frontend engineer</p>
  </div>
  <p class="mono" style="font-size:19px;color:var(--dim)">Dhaka, Bangladesh</p>
</div>`;

const outroHtml = `<style>${BASE}</style>
<div style="${GROUND}"></div>
<div style="position:fixed;inset:0;display:flex;flex-direction:column;justify-content:center;gap:44px;padding:0 84px">
  <div style="display:flex;align-items:center;gap:16px">
    <span style="width:12px;height:12px;border-radius:999px;background:var(--acid)"></span>
    <span class="mono" style="font-size:19px;color:var(--acid)">Open to work</span>
  </div>
  <p class="display" style="font-size:104px">Let's build<br>something <span class="serif" style="font-size:104px">worth shipping</span></p>
  <div style="display:flex;flex-direction:column;gap:14px;margin-top:16px">
    <p style="font-size:34px;color:var(--ink)">kauserulislam0055@gmail.com</p>
    <p class="mono" style="font-size:19px;color:var(--mute)">github.com/kausarul05 &nbsp;·&nbsp; linkedin.com/in/kausarul05</p>
  </div>
</div>`;

/** Lower-third strips, drawn over the walkthrough. */
const CAPTIONS = [
  { file: "cap1", kicker: "01", text: "Frontend engineer, from Dhaka." },
  { file: "cap2", kicker: "02", text: "Interfaces that feel finished — down to the last frame." },
  { file: "cap3", kicker: "03", text: "Logistics platforms. Commerce apps. Gaming products." },
  { file: "cap4", kicker: "04", text: "React · Next.js · React Native · TypeScript" },
  { file: "cap5", kicker: "05", text: "And the backend when it needs one — this site runs on MongoDB." },
];

function captionHtml({ kicker, text }) {
  return `<style>${BASE}
    body{background:transparent}
  </style>
  <div style="position:fixed;left:0;right:0;bottom:0;height:340px;
      background:linear-gradient(to top, #05060af2 8%, #05060ab8 55%, transparent 100%)"></div>
  <div style="position:fixed;left:84px;right:84px;bottom:96px;display:flex;gap:26px;align-items:flex-start">
    <span class="mono" style="font-size:17px;color:var(--acid);padding-top:12px">${kicker}</span>
    <p style="font-size:46px;line-height:1.24;font-weight:500;letter-spacing:-.02em;max-width:820px">${text}</p>
  </div>`;
}

const browser = await chromium.launch();

async function shoot(name, html, transparent = false) {
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    omitBackground: transparent,
  });
  await page.close();
  console.log(`  ${name}.png`);
}

console.log("Rendering cards\n");
await shoot("intro", introHtml);
await shoot("outro", outroHtml);
for (const caption of CAPTIONS) {
  await shoot(caption.file, captionHtml(caption), true);
}

await browser.close();
console.log(`\nWrote ${OUT}`);
