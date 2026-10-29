/**
 * Renders a LinkedIn cover image in the portfolio's visual language.
 *
 *   node scripts/linkedin-banner.mjs
 *
 * 1584×396 is LinkedIn's native cover size. The profile photo sits over the
 * lower-left corner on desktop and the crop tightens on mobile, so everything
 * that has to be read lives in the right two-thirds, vertically centred.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const WIDTH = 1584;
const HEIGHT = 396;
const OUT = resolve("video-out/linkedin");
mkdirSync(OUT, { recursive: true });

const html = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{
  width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;
  background:#05060a;
  font-family:'Geist',system-ui,sans-serif;color:#eceef5;
  -webkit-font-smoothing:antialiased;
}
.ground{
  position:fixed;inset:0;
  background-image:
    radial-gradient(760px circle at 8% -30%, #6d4dff55, transparent 62%),
    radial-gradient(680px circle at 74% 130%, #3ddcff33, transparent 62%),
    radial-gradient(520px circle at 100% 0%, #ccff3d1f, transparent 60%);
}
.dots{
  position:fixed;inset:0;
  background-image:radial-gradient(circle at 1px 1px,#ffffff12 1px,transparent 0);
  background-size:34px 34px;
  -webkit-mask-image:radial-gradient(ellipse 80% 120% at 60% 50%,#000 25%,transparent 80%);
}
/* Where the avatar lands on desktop — kept deliberately empty. */
.content{
  position:fixed;top:0;bottom:0;left:400px;right:74px;
  display:flex;flex-direction:column;justify-content:center;gap:20px;
}
.mono{font-family:'Geist Mono',ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase}
.title{font-size:60px;font-weight:600;letter-spacing:-.035em;line-height:1}
.serif{font-family:'Instrument Serif',Georgia,serif;font-style:italic;color:#ccff3d;font-weight:400}
.stack{display:flex;flex-wrap:wrap;gap:10px}
.chip{
  border:1px solid #ffffff1f;border-radius:999px;
  padding:7px 15px;font-size:15px;color:#c3c8d6;background:#ffffff08;
}
.footer{display:flex;align-items:center;gap:26px;margin-top:4px}
.dot{width:9px;height:9px;border-radius:999px;background:#ccff3d;box-shadow:0 0 14px 3px #ccff3d66}
.rule{position:fixed;left:0;right:0;bottom:0;height:3px;
  background:linear-gradient(90deg,#6d4dff,#3ddcff 45%,#ccff3d)}
</style>
<div class="ground"></div>
<div class="dots"></div>
<div class="content">
  <div style="display:flex;align-items:center;gap:14px">
    <span class="dot"></span>
    <span class="mono" style="font-size:14px;color:#ccff3d">Open to work</span>
    <span style="width:1px;height:14px;background:#ffffff26"></span>
    <span class="mono" style="font-size:14px;color:#868c9e">Dhaka, Bangladesh</span>
  </div>

  <p class="title">Front-end developer <span class="serif">who ships</span></p>

  <div class="stack">
    <span class="chip">React</span>
    <span class="chip">Next.js</span>
    <span class="chip">TypeScript</span>
    <span class="chip">Tailwind</span>
    <span class="chip">Redux</span>
    <span class="chip">React Native</span>
  </div>

  <div class="footer">
    <span class="mono" style="font-size:14px;color:#eceef5">6+ products live</span>
    <span class="mono" style="font-size:14px;color:#868c9e">2 on Google Play</span>
    <span class="mono" style="font-size:14px;color:#3ddcff">kausardev.vercel.app</span>
  </div>
</div>
<div class="rule"></div>
`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/banner.png` });
await browser.close();

console.log(`Wrote ${OUT}/banner.png  (${WIDTH}×${HEIGHT} @2x)`);
