# Home-page video (motion graphic)

`scene.html` is the whole 30-second video as one GSAP timeline on a 1920×1080 stage:

| Time | Scene | On screen |
|---|---|---|
| 0:00 | Asiakkaasi etsivät sinua netistä | A search for "kauneushoitola helsinki" |
| 0:04 | Hidas sivu ajaa asiakkaat muualle | An outdated site loads for 4.8 s and falls apart |
| 0:09 | Me rakennamme sivun, joka myy | A browser outline draws, a wireframe builds, the finished site is painted in |
| 0:15 | Nopea. Mobiilissa. Helppo löytää. | The site becomes a phone; speed 98, #1 in search, works on all devices |
| 0:21 | Sivu, joka tuo asiakkaita | Bookings and messages arrive around the phone |
| 0:26 | End card | Logo, "Nettisivut, jotka tuovat asiakkaita.", free-demo call to action |

The last frame matches the first, so the video loops seamlessly.

## Edit

Open `motion/scene.html?play` in a browser (from this folder, so `../node_modules` resolves) to watch it
in real time. Texts are plain HTML; timings are the numbers at the end of each `tl.*` call (seconds).

## Render

Needs `ffmpeg` (with libx264 and libvpx-vp9) on PATH and a Chromium for Playwright
(`npx playwright install chromium`, or set `CHROMIUM_PATH`).

```bash
npm run render:motion                                    # full render, about 10–15 min
node motion/render.mjs --stills=2.5,13.6 --out=stills    # single frames for checking
```

Output goes to `public/media/`: `sivuseppa-motion.mp4` (H.264), `sivuseppa-motion.webm` (VP9 fallback)
and `sivuseppa-motion-poster.jpg`. The page shows it in `src/components/templates/nexacore/showreel.tsx`.

Fonts (Plus Jakarta Sans, Instrument Serif) come from `@fontsource` packages, so renders are identical on
every machine. GSAP is used under its standard no-charge license.
