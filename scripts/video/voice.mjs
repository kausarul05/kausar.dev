/**
 * Muxes a voiceover recording into the finished video.
 *
 *   node scripts/video/voice.mjs my-voice.m4a
 *   node scripts/video/voice.mjs my-voice.m4a --offset 0.4
 *
 * `--offset` shifts the voice later by N seconds (use a negative value to pull
 * it earlier), so a recording that starts with a breath can still line up.
 *
 * The video is stream-copied — no re-encode, no quality loss.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const FFMPEG =
  process.env.FFMPEG ??
  "C:/Users/kause/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe";

const OUT = resolve("video-out");
const VIDEO = join(OUT, "kausarul-portfolio-1080x1080.mp4");

const args = process.argv.slice(2);
const audio = args.find((a) => !a.startsWith("--"));
const offsetIndex = args.indexOf("--offset");
const offset = offsetIndex === -1 ? 0 : Number(args[offsetIndex + 1] ?? 0);

if (!audio) {
  console.error("Usage: node scripts/video/voice.mjs <audio-file> [--offset seconds]");
  process.exit(1);
}
if (!existsSync(audio)) throw new Error(`No such file: ${audio}`);
if (!existsSync(VIDEO)) throw new Error(`Missing ${VIDEO} — run the build first`);

const final = join(OUT, "kausarul-portfolio-1080x1080-voiced.mp4");

// A positive offset pads the front with silence; a negative one trims the head.
const filter =
  offset >= 0
    ? `adelay=${Math.round(offset * 1000)}:all=1,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000`
    : `atrim=start=${Math.abs(offset)},asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000`;

execFileSync(
  FFMPEG,
  [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", VIDEO,
    "-i", audio,
    "-filter_complex", `[1:a]${filter}[voice]`,
    "-map", "0:v",
    "-map", "[voice]",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k",
    // Keep the video's length even if the voice runs long or short.
    "-shortest",
    "-movflags", "+faststart",
    final,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

console.log(`Wrote ${final}`);
console.log("Loudness normalised to -16 LUFS, which is what LinkedIn and Facebook expect.");
