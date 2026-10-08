# Original artwork pipeline · V2

Three showcase stories each use five separately composed illustrations, not one subdivided drawing: David and Goliath (1 Samuel 17), Noah's Ark (Genesis 6–9), and Jesus Calms the Storm (Mark 4:35–41). Beginner emphasizes large figures and clear silhouettes; Expert includes garments, armor/ropes, camps or villages, animals, vegetation and layered terrain. Images depict Jesus, never God the Father as a human.

1. Commission original black-and-white closed-line coloring-book illustrations for the story and intended audience. Evaluate anatomy, biblical appropriateness, composition and line quality **with no numbers**. Reject excessive decoration or simplistic Expert drawings.
2. Approve a separate composition for each difficulty. Complexity must come from meaningful illustration details.
3. Run `python build_art.py SOURCE.png SCENE LEVEL` with Python, OpenCV, NumPy and Pillow. The script traces closed white areas and one compound ink path. It does not generate geometric filler or subdivide regions. Very small neighboring fragments are grouped with larger areas so they do not each demand a separate tap. Some decorative ink islands are intentionally not individual coloring targets.
4. Approve a flat-color guide of the same plate, then run the converter with `--guide GUIDE.png` to map interior samples to the shared twelve-color palette. Review resulting fill regions, label anchors and touch experience. Version geometry before release; never silently change IDs belonging to existing saves.
5. Store SVG path data in `art/SCENE-LEVEL.json` and its deterministic gzip counterpart. The browser lazy-loads these files; no image generation, server, or paid API is involved in gameplay.
6. Test distinct plates, region limits, IDs, bounds and gzip fidelity with `npm test`. Inspect real rendered artwork at phone size and deep zoom before release.

The source line plates were generated for this product and traced into the repository's complete vector geometry. No third-party coloring-app artwork, branding, assets or code were used. Illustrations are imaginative period-inspired interpretations, not historical photographs. Numeric region counts are a usability budget, not a claim of artistic sophistication.

V1 geometry remains in `legacy-art.js`. V2 save keys contain `v2-LEVEL`, so existing V1 paintings remain available without assigning their old fills to different geometry.

## Purpose-drawn Beginner plates · v3.20

David and Goliath, Noah's Ark, and Jesus Calms the Storm now each have a purpose-drawn Beginner plate created specifically for color-by-number play. Each plate uses 28 large closed regions, thick clean boundaries, generous label clearance, restrained scene detail, and no algorithmic filler subdivisions. These plates use a new `purpose-drawn-cbn1` save namespace so older fills cannot land on changed geometry.

### v3.21 palette correction

Each Beginner plate now carries an art-directed, scene-specific color map. Sky, clouds, clothing, wood, ground, rainbow bands, sails, boat and water are assigned intentionally instead of inferred from region coordinates. The `purpose-drawn-cbn2` namespace prevents incorrect v3.20 color progress from carrying into the corrected plates.

### v3.22 premium landscape pilot

“Peace, be still” now uses a new 4:3 landscape composition created expressly for mobile color-by-number play. It has 80 independent closed regions, a complete boat and cast, expressive biblical storytelling, an art-directed flat-color guide, and larger scene depth without geometric filler. This is the visual-quality pilot for replacing the remaining showcase plates.
