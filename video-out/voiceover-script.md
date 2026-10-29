# Voiceover script

Read this while watching `kausarul-portfolio-1920x1080.mp4` — the on-screen
captions land at the same moments, so you can use them as a teleprompter.

Total speaking time: **~34 seconds** inside a 43-second video.

| Start | Say | What's on screen |
| --- | --- | --- |
| 0:00 | *(silence — let the name card breathe)* | Intro card |
| 0:03 | "I'm Kausarul — a front-end developer from Dhaka." | Hero, name landing |
| 0:09 | "I build production interfaces. React, Next.js and TypeScript, fast on any phone." | Hero → About |
| 0:16 | "Commerce platforms, B2B wholesale, logistics — all live. And two apps on Google Play." | Project cards sliding past |
| 0:25 | "React, Next.js, TypeScript, Tailwind, React Native." | Stack grid |
| 0:29 | "I built and maintain this site too — with its own admin panel." | Timeline |
| 0:34 | "I'm open to work. Let's build something worth shipping." | Contact section |
| 0:39 | *(silence)* | Outro card |

## Recording it

Phone voice memo is fine — better than a laptop mic. A few things that matter
more than the gear:

- **Record in a small soft room.** A bedroom with a bed and curtains beats a big
  empty room every time. Avoid bathrooms and kitchens.
- **Hold the phone about a fist's distance away, slightly off to the side** so
  your breath doesn't hit the mic directly.
- **Do two or three takes** and keep the best. Don't try to fix one bad take.
- **Leave a second of silence at the start**, so there's room to line it up.
- Speak a little slower than feels natural. It always sounds rushed on playback.

Export as `.m4a`, `.mp3` or `.wav` — any of them works.

## Adding it to the video

```bash
node scripts/video/voice.mjs path/to/your-recording.m4a
```

If the timing drifts, nudge it:

```bash
node scripts/video/voice.mjs your-recording.m4a --offset 0.6    # start later
node scripts/video/voice.mjs your-recording.m4a --offset -0.3   # start earlier
```

The video is stream-copied, so this is instant and lossless. Loudness is
normalised to −16 LUFS, which is the level LinkedIn and Facebook target.

Output: `video-out/kausarul-portfolio-1920x1080-voiced.mp4`

> The voice script targets the 16:9 file. To voice the square cut instead, point
> `VIDEO` in `scripts/video/voice.mjs` at `kausarul-portfolio-1080x1080.mp4` —
> the timings are identical.

## The two files

| File | Use it for |
| --- | --- |
| `kausarul-portfolio-1920x1080.mp4` | LinkedIn, Facebook, YouTube, embedding on the site. The real desktop layout, full width. |
| `kausarul-portfolio-1080x1080.mp4` | Square feeds. The same desktop footage letterboxed — not cropped, so nothing is cut off. |
