/**
 * Assembles the final square video: intro card → captioned walkthrough → outro.
 *
 *   node scripts/video/build.mjs
 *
 * Run `record.mjs` and `cards.mjs` first. Output is H.264/yuv420p with a silent
 * AAC track, so a voiceover can be muxed in later without re-encoding the video.
 */
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const FFMPEG =
  process.env.FFMPEG ??
  "C:/Users/kause/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe";

const OUT = resolve("video-out");
const CARDS = join(OUT, "cards");
const WALK = join(OUT, "walkthrough.webm");

const FPS = 30;
const INTRO_S = 2.6;
const OUTRO_S = 4.0;

/**
 * Caption timings, in seconds on the walkthrough's own clock. The recording
 * opens with ~2s of page settle before the choreography starts, so everything
 * is offset from that.
 */
const CAPTIONS = [
  { file: "cap1.png", start: 2.3, end: 6.2 },
  { file: "cap2.png", start: 6.7, end: 12.2 },
  { file: "cap3.png", start: 13.2, end: 21.6 },
  { file: "cap4.png", start: 22.4, end: 26.4 },
  { file: "cap5.png", start: 26.9, end: 30.1 },
];

const VIDEO_ARGS = [
  "-c:v", "libx264",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-r", String(FPS),
  "-crf", "18",
  "-preset", "slow",
  "-movflags", "+faststart",
];

function run(args) {
  try {
    execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args], {
      stdio: ["ignore", "inherit", "pipe"],
    });
  } catch (error) {
    // execFileSync hides ffmpeg's own message behind a generic exit-code error.
    const detail = error.stderr?.toString().trim();
    throw new Error(detail ? `ffmpeg failed:
${detail}` : error.message);
  }
}

for (const path of [WALK, join(CARDS, "intro.png"), join(CARDS, "outro.png")]) {
  if (!existsSync(path)) throw new Error(`Missing ${path} — run record.mjs and cards.mjs first`);
}

/* ------------------------------------------------------------------ *
 * 1. Cards → short clips
 * ------------------------------------------------------------------ */

function card(name, seconds) {
  const out = join(OUT, `${name}.mp4`);
  // Every input comes first; -vf is an output option and ffmpeg binds stray
  // options to whichever file follows them.
  run([
    "-loop", "1",
    "-t", String(seconds),
    "-i", join(CARDS, `${name}.png`),
    "-f", "lavfi", "-t", String(seconds), "-i", "anullsrc=r=48000:cl=stereo",
    "-vf",
    `fade=t=in:st=0:d=0.5,fade=t=out:st=${(seconds - 0.5).toFixed(2)}:d=0.5,format=yuv420p`,
    "-map", "0:v", "-map", "1:a",
    ...VIDEO_ARGS,
    "-c:a", "aac", "-b:a", "128k", "-shortest",
    out,
  ]);
  console.log(`  ${name}.mp4  (${seconds}s)`);
  return out;
}

console.log("Building clips\n");
const intro = card("intro", INTRO_S);
const outro = card("outro", OUTRO_S);

/* ------------------------------------------------------------------ *
 * 2. Walkthrough + burned-in captions
 * ------------------------------------------------------------------ */

const inputs = ["-i", WALK];
const filters = [];
let last = "0:v";

CAPTIONS.forEach((caption, i) => {
  const duration = caption.end - caption.start;
  const idx = i + 1;
  inputs.push("-loop", "1", "-t", duration.toFixed(2), "-i", join(CARDS, caption.file));

  // Each still starts its own clock at 0; fade it, then shift it into place.
  filters.push(
    `[${idx}:v]format=rgba,` +
      `fade=t=in:st=0:d=0.45:alpha=1,` +
      `fade=t=out:st=${(duration - 0.45).toFixed(2)}:d=0.45:alpha=1,` +
      `setpts=PTS+${caption.start.toFixed(2)}/TB[c${idx}]`,
  );
  filters.push(
    `[${last}][c${idx}]overlay=0:0:eof_action=pass:` +
      `enable='between(t,${caption.start},${caption.end})'[v${idx}]`,
  );
  last = `v${idx}`;
});

const body = join(OUT, "body.mp4");
run([
  ...inputs,
  "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
  "-filter_complex", filters.join(";"),
  "-map", `[${last}]`,
  "-map", `${CAPTIONS.length + 1}:a`,
  ...VIDEO_ARGS,
  "-c:a", "aac", "-b:a", "128k", "-shortest",
  body,
]);
console.log(`  body.mp4  (walkthrough + ${CAPTIONS.length} captions)`);

/* ------------------------------------------------------------------ *
 * 3. Concat
 * ------------------------------------------------------------------ */

const listPath = join(OUT, "concat.txt");
writeFileSync(
  listPath,
  [intro, body, outro].map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"),
);

const final = join(OUT, "kausarul-portfolio-1080x1080.mp4");
run(["-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", "-movflags", "+faststart", final]);

console.log(`\nWrote ${final}`);
