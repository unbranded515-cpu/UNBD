/**
 * CENTRAL ASSET REGISTRY — the only file you need to touch when the real
 * artwork lands.
 *
 * Every entry ships with a generated placeholder so the game is playable
 * today. To swap in final art:
 *
 *   1. Drop the PNG (transparent background) at  public/assets/<path>
 *   2. Flip `real: false`  ->  `real: true`
 *   3. For spritesheets, set `frameConfig` to the real frame size.
 *
 * Nothing else in the codebase changes. If a file flagged `real` is missing
 * or fails to decode, BootScene quietly falls back to the placeholder and
 * logs a warning instead of crashing.
 */

export const ASSET_ROOT = 'assets/';

export const ASSETS = [
  // ---------------------------------------------------------------- actors
  {
    key: 'boy-run',
    type: 'spritesheet',
    path: 'sprites/boy-run.png',
    real: false,
    frameConfig: { frameWidth: 96, frameHeight: 132 },
    placeholder: { kind: 'boy', width: 96, height: 132, frames: 6 },
  },
  {
    key: 'chaser-man',
    type: 'spritesheet',
    path: 'sprites/chaser-man.png',
    real: false,
    frameConfig: { frameWidth: 136, frameHeight: 172 },
    placeholder: { kind: 'chaserMan', width: 136, height: 172, frames: 4 },
  },
  {
    key: 'chaser-dog',
    type: 'spritesheet',
    path: 'sprites/chaser-dog.png',
    real: false,
    frameConfig: { frameWidth: 120, frameHeight: 78 },
    placeholder: { kind: 'chaserDog', width: 120, height: 78, frames: 4 },
  },

  // ----------------------------------------------------------- collectibles
  {
    key: 'dosa',
    type: 'image',
    path: 'sprites/dosa.png',
    real: false,
    placeholder: { kind: 'dosa', width: 96, height: 68 },
  },
  {
    key: 'bag-fill',
    type: 'spritesheet',
    path: 'sprites/bag-fill.png',
    real: false,
    frameConfig: { frameWidth: 64, frameHeight: 64 },
    placeholder: { kind: 'bag', width: 64, height: 64, frames: 5 },
  },

  // -------------------------------------------------------------- obstacles
  {
    key: 'obstacle-car',
    type: 'image',
    path: 'sprites/car.png',
    real: false,
    placeholder: { kind: 'car', width: 156, height: 196 },
  },
  {
    key: 'obstacle-tree',
    type: 'image',
    path: 'sprites/tree.png',
    real: false,
    placeholder: { kind: 'tree', width: 136, height: 232 },
  },
  {
    key: 'obstacle-pylon',
    type: 'image',
    path: 'sprites/pylon.png',
    real: false,
    placeholder: { kind: 'pylon', width: 88, height: 80 },
  },

  // ------------------------------------------------- parallax background set
  // Generic Kingston streetscape only — limestone blocks, storefront rows,
  // sidewalk and asphalt. No real business, signage or storefront photo.
  {
    key: 'bg-sky',
    type: 'image',
    path: 'backgrounds/sky.png',
    real: false,
    placeholder: { kind: 'sky', width: 480, height: 320 },
  },
  {
    key: 'bg-building-a',
    type: 'image',
    path: 'backgrounds/building-limestone.png',
    real: false,
    placeholder: { kind: 'buildingA', width: 300, height: 460 },
  },
  {
    key: 'bg-building-b',
    type: 'image',
    path: 'backgrounds/building-brick.png',
    real: false,
    placeholder: { kind: 'buildingB', width: 300, height: 400 },
  },
  {
    key: 'bg-road',
    type: 'image',
    path: 'backgrounds/road.png',
    real: false,
    placeholder: { kind: 'road', width: 480, height: 554 },
  },
];

/**
 * Animations are declared here too, so a real spritesheet with a different
 * frame count only needs its numbers updated in one place.
 */
export const ANIMATIONS = [
  { key: 'boy-running', texture: 'boy-run', start: 0, end: 5, frameRate: 14, repeat: -1 },
  { key: 'chaser-running', texture: 'chaser-man', start: 0, end: 3, frameRate: 10, repeat: -1 },
  { key: 'dog-running', texture: 'chaser-dog', start: 0, end: 3, frameRate: 13, repeat: -1 },
];
