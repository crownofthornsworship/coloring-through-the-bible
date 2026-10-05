# Coloring Through the Bible

An original Light & Life Games product owned by Mike. A functional, mobile-first, dependency-free browser coloring app.

## Play

https://crownofthornsworship.github.io/coloring-through-the-bible/

12 original SVG story illustrations, chronologically ordered from Genesis through Revelation. This is a curated **Volume One**, not a complete illustrated Bible. The Early Church section also includes the final Revelation scene to close the journey.

- Bible Journey, Old Testament, Life of Jesus, Early Church, Free Color, and My Artwork / Progress.
- Easy: 12–33 regions. Detailed: 56–88. Expert: 128–176, with finer foliage, stonework, water and botanical details.
- Tap-to-fill by number; free color with a custom color picker.
- Pointer-based touch/mouse controls, two-pointer pinch zoom, bounded panning, zoom buttons and fit.
- Undo/redo, find-an-area hint, optional numbers, completion celebrations and journey stamps.
- Artwork saved independently per story, difficulty and mode in localStorage. No accounts, tracking, backend or paid APIs.
- PNG export at 1800×1800. Export contains artwork only, without numbers or UI.
- Service worker caches the app for offline use after its first successful online load. Browser PWA installation availability varies.
- Original app icon and 1200×630 Open Graph / X artwork. Mike’s C4 footer included.

## Development / hosting

Serve this directory using any static HTTP server, for example `python -m http.server 8080`. ES modules require HTTP; opening index.html as file:// is not supported. `npm test` runs region-integrity tests. There are no dependencies or build step. GitHub Pages publishes **main / root**; `.nojekyll` bypasses Jekyll.

`scenes.js` owns original vector artwork, palette and story summaries. `app.js` owns coloring, gestures, progress and gallery. `style.css` owns responsive layout. Bump the cache name in `sw.js` when changing the offline file set. All relative asset paths work under the repository Pages subpath.

## Art and Scripture

All illustrations, UI and code were created for this project. No Happy Color or Lake artwork, branding, code or proprietary assets are used. Scripture is referenced; story text is an original summary rather than a quoted translation. Illustrations are stylized and symbolic, not claims of historical visual accuracy.

## Data and limitations

Progress remains in the current browser and device. Clearing browser data removes it; download important artwork. No cloud sync. Journey stamps remain after undo or restarting an already completed scene. The app uses region filling, not a freehand brush. Fine regions in Expert should be zoomed in. A screen reader / keyboard can reach and color every region using Enter or Space.

The truncated original brief specified a difficulty system but did not include its remaining details; V1 uses Easy, Detailed and Expert as the initial interpretation.
