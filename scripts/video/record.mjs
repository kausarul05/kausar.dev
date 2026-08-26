/**
 * Records a 1080×1080 walkthrough of the portfolio with headless Chromium.
 *
 *   node scripts/video/record.mjs
 *
 * Headless on purpose: a visible Chrome window gets its rendering throttled the
 * moment it loses focus, which drops frames. Headless always renders.
 *
 * The whole choreography runs *inside* the page. Driving it from Node cost
 * ~113ms per CDP round trip, which stretched a 35s script into a 128s video.
 * In-page, the timing is exact. Scrolling dispatches real wheel events so Lenis
 * eases them the way it would for a visitor — calling `scrollTo` instead would
 * fight Lenis's own animation loop.
 */
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const URL = process.env.VIDEO_URL ?? "http://localhost:3100/";
const WIDTH = Number(process.env.VIDEO_W ?? 1920);
const HEIGHT = Number(process.env.VIDEO_H ?? 1080);
const OUT_DIR = resolve("video-out");
const RAW_DIR = join(OUT_DIR, "raw");

/**
 * Scroll targets in px, and how long to take reaching each. Offsets come from
 * `node scripts/video/measure.mjs`; re-run it if the page height changes.
 */
const TIMELINE = [
  { name: "into-about", to: 1500, ms: 3500 },
  { name: "about-copy", to: 2350, ms: 3500 },
  { name: "work", to: 5700, ms: 9500 },
  { name: "stack", to: 6900, ms: 4500 },
  { name: "path", to: 7600, ms: 3500 },
  { name: "contact", to: 7973, ms: 5000 },
  { name: "hold", to: 7973, ms: 1500 },
];

rmSync(RAW_DIR, { recursive: true, force: true });
mkdirSync(RAW_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  recordVideo: { dir: RAW_DIR, size: { width: WIDTH, height: HEIGHT } },
  reducedMotion: "no-preference",
});
context.setDefaultTimeout(0);

const page = await context.newPage();
page.setDefaultTimeout(0);

// Skip the intro curtain — the hero name reveal is the stronger opening beat.
await page.addInitScript(() => sessionStorage.setItem("intro-seen", "1"));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

// A real mouse position gives genuine CSS :hover on whatever sits under it;
// synthetic pointermove events during the run drive the JS-based effects.
await page.mouse.move(WIDTH * 0.35, HEIGHT * 0.6);

console.log(`Recording ${URL} at ${WIDTH}×${HEIGHT}\n`);

const result = await page.evaluate(
  async ({ timeline, size, width }) => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const wheel = (deltaY) =>
      window.dispatchEvent(
        new WheelEvent("wheel", { deltaY, deltaMode: 0, bubbles: true, cancelable: true }),
      );
    const pointer = (clientX, clientY) =>
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX,
          clientY,
          bubbles: true,
          pointerType: "mouse",
        }),
      );

    /**
     * Runs `onFrame(progress)` on rAF for exactly `ms` of wall clock. Driving
     * off elapsed time rather than a tick count keeps the video the intended
     * length even when recording slows the frame rate down.
     */
    const over = (ms, onFrame) =>
      new Promise((resolve) => {
        const t0 = performance.now();
        const step = () => {
          const t = Math.min(1, (performance.now() - t0) / ms);
          onFrame(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    const log = [];

    // Hero: hold while the name lands, then sweep the pointer over the ghost.
    await wait(1400);
    await over(1600, (t) => {
      const e = ease(t);
      pointer(width * 0.16 + width * 0.62 * e, size * 0.62 - size * 0.2 * Math.sin(Math.PI * t));
    });
    await wait(700);
    log.push(`hero done, scrollY=${Math.round(scrollY)}`);

    // Scroll phases.
    let commanded = 0;
    for (const step of timeline) {
      const distance = step.to - commanded;
      let sent = 0;
      await over(step.ms, (t) => {
        const target = distance * ease(t);
        const delta = target - sent;
        sent = target;
        if (Math.abs(delta) > 0.4) wheel(delta);
      });
      commanded = step.to;
      log.push(`${step.name}: commanded=${commanded} actual=${Math.round(scrollY)}`);
    }

    return {
      log,
      finalScrollY: Math.round(scrollY),
      maxScroll: document.documentElement.scrollHeight - size,
    };
  },
  { timeline: TIMELINE, size: HEIGHT, width: WIDTH },
);

for (const line of result.log) console.log(`  ${line}`);
console.log(`\n  final scrollY ${result.finalScrollY} of ${result.maxScroll}`);

await context.close();
await browser.close();

// Playwright names videos with a random id; give it a stable one.
const [file] = readdirSync(RAW_DIR).filter((f) => f.endsWith(".webm"));
if (!file) throw new Error("Playwright produced no video");
const finalPath = join(OUT_DIR, "walkthrough.webm");
rmSync(finalPath, { force: true });
renameSync(join(RAW_DIR, file), finalPath);
rmSync(RAW_DIR, { recursive: true, force: true });

console.log(`Wrote ${finalPath}`);
