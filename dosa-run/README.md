# Dosa Run

An endless runner down a Kingston, Ontario street. A boy sprints along the
road collecting dosas into his bag while a heavyset man and his dog close in
behind him. Cars and trees end the run.

Built with **Phaser 3** (Arcade Physics) and **Vite**. Everything currently
renders with generated placeholder art — drop in real PNGs and it swaps over
without touching game code.

## Running it

```bash
cd dosa-run
npm install
npm run dev      # http://localhost:5173
```

`npm run build` produces a static bundle in `dist/`, and `npm run preview`
serves it.

> This lives in its own npm project inside the repo so it stays independent
> of the Next.js app at the repository root.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Change lane | `←` `→` or `A` `D` | Swipe left/right, or the on-screen pads |
| Jump | `↑`, `W` or `Space` | Swipe up, tap the street, or the jump pad |
| Pause | `P` or `Esc` | The `❚❚` button |
| Start / restart | `Space` or `Enter` | The on-screen buttons |

## How it works

The boy never actually moves forward. He stands on the `depth = 1` plane and
the street comes to him: every obstacle, dosa and lane marking spawns at the
horizon with `depth = 0` and advances toward the camera. One `speed` value
drives the background scroll, the spawner and the sense of pace.

`src/config/Road.js` holds the perspective maths — a true perspective divide,
so scale grows smoothly and never breaks down as objects sweep past the
camera. Everything that sits on the road goes through `placeByDepth()`.

### Difficulty

Every **12 dosas** (`DIFFICULTY.dosasPerLevel`) the level goes up, which:

- raises the scroll speed by `speedPerLevel` (capped at `maxSpeed`),
- shortens the obstacle spawn interval by 10%, and
- raises the chance of a two-lane obstacle wave.

The spawner never blocks all three lanes, never places two crowded waves back
to back, and never drops a dosa inside an obstacle.

### The chase

The chaser and dog sit *nearer the camera* than the boy, drawn under scale so
they crowd the frame without hiding him. They creep closer the longer a run
lasts and get pushed back a little with every dosa collected. They are pure
tension — they never end a run. Cars and trees do that.

### Obstacles

| Type | Jumpable | Notes |
|---|---|---|
| Car | No | Ends the run. |
| Tree | No | Ends the run. |
| Pylon | **Yes** | Low profile — hurdle it mid-jump for a bonus dosa. |

Cars and trees are fatal exactly as specified. The pylon exists so the jump
control has something to clear; to remove it, delete its entry from
`OBSTACLES` in `src/config/GameConfig.js` and drop `pylon` from the manifest.

## Project layout

```
src/
  main.js                  Phaser game config, scene list, responsive scaling
  config/
    Brand.js               Brand palette + text styles
    GameConfig.js          Every tunable number (speed, spawn rates, lanes)
    Road.js                Fake-3D perspective maths
    AssetManifest.js       CENTRAL asset registry — edit this to swap art
    Placeholders.js        Generated stand-in textures
    bag.js                 Bag fill-state helper
  scenes/
    BootScene.js           Asset loading + placeholder fallback + animations
    MenuScene.js           Title screen
    GameScene.js           The run
    GameOverScene.js       Final score + restart
  objects/
    Background.js          Parallax layers + perspective lane markings
    Player.js              The boy: lanes, jump, hitbox
    Chaser.js              Big man + dog
    Spawner.js             Obstacle and dosa streams
    depth.js               placeByDepth() / setHitbox() helpers
  ui/
    Hud.js                 Score, bag fill meter, level
    Button.js              Brand-styled pill button
    TouchControls.js       On-screen thumb pads
  input/
    InputController.js     Keyboard + swipe + tap, one set of handlers
  state/
    GameState.js           In-memory high score (no localStorage)
public/assets/             Drop real art here — see its README
```

## Swapping in real art

See [`public/assets/README.md`](public/assets/README.md) for the file list,
expected sizes and frame counts. The short version: save the PNG, flip
`real: true` in `src/config/AssetManifest.js`, done.

## Branding

The UI uses the Mint Leaf South Indian colour palette only:

| Token | Hex |
|---|---|
| Green | `#1BA37E` |
| Orange | `#F2802B` |

No logo, storefront image or other branded asset is used anywhere — the menu
keeps an empty slot reserved for the logo when it arrives.

## Notes

- High score is kept in memory only and resets on reload, as requested.
- The canvas is a fixed 480 × 854 design resolution scaled with
  `Phaser.Scale.FIT`, so one layout works on phone, tablet and desktop.
