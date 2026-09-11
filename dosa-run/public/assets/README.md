# Drop your art here

Every file below is optional — the game generates a placeholder for anything
missing, so it stays playable while art is in progress.

To switch a placeholder for real art:

1. Save the PNG (transparent background) at the path listed below.
2. Open `src/config/AssetManifest.js` and set that entry's `real: true`.
3. For spritesheets, set `frameConfig` to the real frame size.

Nothing else needs to change. If a file marked `real` is missing or fails to
decode, Boot logs a warning and falls back to the placeholder.

## Sprites — `public/assets/sprites/`

| File | Kind | Placeholder frame size | Notes |
|---|---|---|---|
| `boy-run.png` | spritesheet | 96 × 132, 6 frames | Running cycle, seen **from behind**. Ground contact at the bottom edge. |
| `chaser-man.png` | spritesheet | 136 × 172, 4 frames | The heavyset chaser, also from behind. |
| `chaser-dog.png` | spritesheet | 120 × 78, 4 frames | Three-quarter view. |
| `dosa.png` | image | 96 × 68 | Floats above the road. |
| `bag-fill.png` | spritesheet | 64 × 64, 5 frames | Fill states, empty → full. Frame count is `BAG_FILL_STATES`. |
| `car.png` | image | 156 × 196 | Rear view. Fatal. |
| `tree.png` | image | 136 × 232 | Fatal. |
| `pylon.png` | image | 88 × 80 | Low — clearable with a jump. |

Frames in a spritesheet must be laid out left to right in a single row.

## Backgrounds — `public/assets/backgrounds/`

A generic Kingston streetscape. **No specific real business, storefront
photo or signage** — keep shop fronts and signs blank or invented.

| File | Size | Scroll rate | Notes |
|---|---|---|---|
| `sky.png` | 480 × 320 | 0.06 | Tiles horizontally. |
| `limestone-buildings.png` | 480 × 170 | 0.22 | Limestone block rooftops at the horizon. |
| `storefronts.png` | 480 × 118 | 0.45 | Shop row. Tiles horizontally. |
| `sidewalk.png` | 480 × 36 | 0.78 | Far sidewalk strip. |
| `road.png` | 480 × 554 | — | The perspective road surface, anchored at `ROAD.horizonY`. Static; motion comes from the scrolling lane markings drawn on top. |

The first four tile horizontally, so make their left and right edges match.
Band positions and scroll rates live in the `LAYERS` table at the top of
`src/objects/Background.js`.
