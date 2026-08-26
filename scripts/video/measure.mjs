/**
 * Prints section offsets at the recording viewport, so the walkthrough can be
 * choreographed against real numbers instead of guesses.
 *
 *   node scripts/video/measure.mjs
 */
import { chromium } from "playwright";

const URL = process.env.VIDEO_URL ?? "http://localhost:3100/";
const SIZE = 1080;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE } });

// Skip the intro curtain — the hero reveal is the stronger opening.
await page.addInitScript(() => sessionStorage.setItem("intro-seen", "1"));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const data = await page.evaluate(() => {
  const ids = ["top", "about", "work", "stack", "path", "contact"];
  return {
    docHeight: document.documentElement.scrollHeight,
    viewport: innerHeight,
    sections: ids.map((id) => {
      const el = document.getElementById(id);
      return el ? { id, top: Math.round(el.offsetTop), height: Math.round(el.offsetHeight) } : null;
    }),
  };
});

console.log(`viewport   ${data.viewport}px`);
console.log(`document   ${data.docHeight}px\n`);
for (const s of data.sections) {
  if (s) console.log(`  ${s.id.padEnd(8)} top ${String(s.top).padStart(6)}   height ${s.height}`);
}

await browser.close();
