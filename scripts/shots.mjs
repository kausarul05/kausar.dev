/**
 * Captures a screenshot of every live project into public/projects/.
 *
 *   node scripts/shots.mjs
 *   node scripts/shots.mjs dealnux        # just one
 *
 * Shot at 1440×900 and saved as JPEG — these are decorative card art, not
 * documents, so the file size matters more than pixel-perfect fidelity.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const OUT = resolve("public/projects");
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { id: "dealnux", url: "https://dealnux.shop/" },
  {
    id: "dealnux-app",
    url: "https://play.google.com/store/apps/details?id=com.dealnux.app",
  },
  { id: "eurasia", url: "https://eurasiasupplies.com/" },
  { id: "azan", url: "https://azanwholesale.com/" },
  { id: "lawapan", url: "https://lawapan.vercel.app/" },
  {
    id: "chatbot-app",
    url: "https://play.google.com/store/apps/details?id=ai.chatbot24.app",
  },
];

const only = process.argv[2];
const targets = only ? TARGETS.filter((t) => t.id === only) : TARGETS;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
});

for (const target of targets) {
  const page = await context.newPage();
  try {
    await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Client-rendered storefronts paint a skeleton first, so wait for the
    // network to go quiet before shooting — a skeleton makes a poor card.
    await page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => console.log(`        (${target.id}: network never idled, shooting anyway)`));

    // Nudge the page to trigger lazy images, then come back to the top.
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2500);

    // Hide consent banners for the shot. Deliberately *not* clicking "accept" —
    // that would be consenting on someone's behalf; this only stops the overlay
    // from covering the page art.
    await page.evaluate(() => {
      const wordy = /cookie|consent|gdpr|privacy preference/i;
      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        if (style.position !== "fixed" && style.position !== "sticky") continue;
        const box = el.getBoundingClientRect();
        if (box.height > innerHeight * 0.6 || box.height < 40) continue;
        if (wordy.test(el.textContent?.slice(0, 400) ?? "")) el.style.display = "none";
      }
    });
    await page.waitForTimeout(400);

    await page.screenshot({
      path: join(OUT, `${target.id}.jpg`),
      type: "jpeg",
      quality: 82,
    });
    console.log(`  ok    ${target.id.padEnd(13)} ${target.url}`);
  } catch (error) {
    console.log(`  FAIL  ${target.id.padEnd(13)} ${error.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\nWrote ${OUT}`);
