# Coloring Through the Bible · V2

An original, mobile-first Light & Life Games product owned by Mike.

**Play:** https://crownofthornsworship.github.io/coloring-through-the-bible/

The existing twelve-story Bible Journey, engine, local artwork, chronology, completion stamps, Creative mode and GitHub Pages infrastructure are preserved. Three showcase stories now have five genuinely distinct, original coloring-book compositions:

| Story | Beginner | Easy | Medium | Hard | Expert |
|---|---:|---:|---:|---:|---:|
| David and Goliath | 30 | 65 | 140 | 280 | 500 |
| Noah's Ark | 29 | 65 | 140 | 280 | 500 |
| Jesus Calms the Storm | 30 | 65 | 140 | 280 | 500 |

The other nine stories retain **Classic Easy / Detailed / Expert** artwork. This is a curated Volume One, not a complete illustrated Bible. Existing paintings in showcase stories remain accessible as Saved V1 options.

## Coloring workspace

- Artwork-first mobile workspace, compact collapsible bottom tray, smooth horizontal swatches, completed-color checks and selected-color/overall remaining counts.
- Tap-to-fill by number or Creative colors/custom picker/eraser; undo, redo and confirmation before reset.
- Two-pointer pinch zoom, drag pan, explicit Pan mode, 100–2000% zoom, Fit and Find an Area centered on an unfinished matching-color region.
- Numbers stay screen-sized and appear only when their area is large enough; nearby labels are culled to avoid overlaps. Numbers can be hidden completely.
- Auto-save per scene, difficulty and mode. Refresh resumes the last active picture; Home returns to the Journey. No accounts, backend, tracking or paid gameplay APIs.
- Completion includes Bible reference, an original recap, Think About It, Next Story, Color Again and Save Artwork.
- PNG export is 1800 × 1800, without controls or numbers. Offline caching and a PWA manifest/icons remain supported.
- Subtle Mike C4 footer on the home/gallery.

## Development

Serve with `python -m http.server 8080`; ES modules need HTTP. `npm test` validates V1 integrity and V2 artwork/data. GitHub Pages publishes `main / root` with `.nojekyll`. No runtime dependencies or build step.

`app.js` retains the coloring engine; `scenes.js` lazily loads V2 vectors; `legacy-art.js` preserves V1 geometry and story data. `style.css` implements the responsive workspace. See [ARTWORK.md](ARTWORK.md) for the reusable illustration pipeline. A new scene adds metadata plus difficulty-specific JSON/JSON.gz and a thumbnail. Bump asset/cache versions when releasing changes.

`preview.html` offers actual 360/390/412-pixel iframe viewports and a **synthetic** two-pointer gesture regression check. This does not replace physical Android touch testing.

## Limits

Saves stay in this browser/device; clearing browser data removes them. Download important artwork. No cloud synchronization or freehand brush. Expert can require substantial zoom; grouped neighboring fragments may fill together. Original generated line art should receive editorial review before additional scenes are published. The nine Classic stories have not received the V2 illustration overhaul.

Scripture references accompany original summaries; invented dialogue is never presented as Scripture. All artwork is original to this project; no Happy Color or Lake artwork, branding or proprietary UI is used.
