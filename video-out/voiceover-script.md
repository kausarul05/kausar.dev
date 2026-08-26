# Voiceover script

Read this while watching `kausarul-portfolio-1080x1080.mp4` — the on-screen
captions land at the same moments, so you can use them as a teleprompter.

Total speaking time: **~33 seconds** inside a 43-second video.

| Start | Say | What's on screen |
| --- | --- | --- |
| 0:00 | *(silence — let the intro card breathe)* | Name card |
| 0:03 | "I'm Kausarul — a frontend engineer from Dhaka." | Hero, name landing |
| 0:07 | "I build interfaces that feel finished. Fast, accessible, down to the last frame." | Hero → About |
| 0:14 | "Logistics platforms with live GPS tracking. A commerce app shipped to the store. A gaming platform running on the Riot API." | Project cards sliding past |
| 0:23 | "React, Next.js, React Native, TypeScript." | Stack grid |
| 0:27 | "And the backend when it needs one — this site runs on MongoDB, with its own admin panel." | Timeline |
| 0:31 | "I'm open to work. Let's build something worth shipping." | Contact section |
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

Output: `video-out/kausarul-portfolio-1080x1080-voiced.mp4`
