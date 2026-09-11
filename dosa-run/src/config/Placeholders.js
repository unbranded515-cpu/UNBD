import { BRAND } from './Brand.js';
import { ROAD } from './GameConfig.js';
import { groundYAt, roadHalfWidthAt } from './Road.js';

/**
 * Generated stand-in artwork.
 *
 * These are deliberately simple block shapes — they exist only so the game
 * plays correctly before the real photoreal PNGs are dropped in. Every one
 * is drawn at the exact frame size declared in AssetManifest.js, so swapping
 * to real art changes nothing about layout, hitboxes or animation timing.
 */

const SKIN = 0xd7a071;
const HAIR = 0x2a1c12;
const DENIM = 0x24435c;
const ASPHALT = 0x3b4048;
const ASPHALT_DARK = 0x2e333a;
const LIMESTONE = 0xc9c3b2;
const LIMESTONE_DARK = 0xa8a08d;
const CONCRETE = 0xdcd8d0;

/** Draws one frame of the running boy, seen from behind. */
function boy(g, ox, oy, w, h, frame, frames) {
  const cx = ox + w / 2;
  const phase = (frame / frames) * Math.PI * 2;
  const swing = Math.sin(phase) * 15;
  const bob = Math.abs(Math.cos(phase)) * 4;
  const feet = oy + h - 2;
  const hip = feet - 50;

  // Legs (swinging out of phase with each other).
  g.fillStyle(SKIN, 1);
  g.fillRoundedRect(cx - 19 + swing * 0.6, hip - bob, 15, 50 - swing * 0.3, 6);
  g.fillRoundedRect(cx + 4 - swing * 0.6, hip - bob, 15, 50 + swing * 0.3, 6);

  // Shoes.
  g.fillStyle(BRAND.orange, 1);
  g.fillRoundedRect(cx - 21 + swing * 0.6, feet - 10, 19, 10, 4);
  g.fillRoundedRect(cx + 2 - swing * 0.6, feet - 10, 19, 10, 4);

  // Shorts.
  g.fillStyle(DENIM, 1);
  g.fillRoundedRect(cx - 21, hip - 18 - bob, 42, 26, 6);

  // Arms.
  g.fillStyle(SKIN, 1);
  g.fillRoundedRect(cx - 31, hip - 52 - bob - swing * 0.4, 12, 38, 6);
  g.fillRoundedRect(cx + 19, hip - 52 - bob + swing * 0.4, 12, 38, 6);

  // Torso — brand green tee.
  g.fillStyle(BRAND.green, 1);
  g.fillRoundedRect(cx - 23, hip - 56 - bob, 46, 46, 8);
  g.fillStyle(BRAND.greenDark, 1);
  g.fillRect(cx - 23, hip - 22 - bob, 46, 5);

  // The dosa bag, worn on his back so it faces the camera.
  g.fillStyle(BRAND.orange, 1);
  g.fillRoundedRect(cx - 13, hip - 42 - bob, 26, 28, 5);
  g.fillStyle(BRAND.orangeDark, 1);
  g.fillRect(cx - 13, hip - 32 - bob, 26, 3);
  g.lineStyle(3, BRAND.greenDark, 1);
  g.strokeRoundedRect(cx - 13, hip - 42 - bob, 26, 28, 5);
  g.lineStyle(0, 0, 0);

  // Head, seen from behind.
  g.fillStyle(SKIN, 1);
  g.fillCircle(cx, hip - 70 - bob, 16);
  g.fillStyle(HAIR, 1);
  g.fillCircle(cx, hip - 74 - bob, 16);
  g.fillRect(cx - 16, hip - 76 - bob, 32, 10);
}

/** Draws one frame of the heavyset chaser, seen from behind. */
function chaserMan(g, ox, oy, w, h, frame, frames) {
  const cx = ox + w / 2;
  const phase = (frame / frames) * Math.PI * 2;
  const swing = Math.sin(phase) * 18;
  const bob = Math.abs(Math.cos(phase)) * 5;
  const feet = oy + h - 2;
  const hip = feet - 58;

  g.fillStyle(DENIM, 1);
  g.fillRoundedRect(cx - 30 + swing * 0.5, hip - bob, 26, 58, 9);
  g.fillRoundedRect(cx + 4 - swing * 0.5, hip - bob, 26, 58, 9);

  g.fillStyle(0x2b2b2b, 1);
  g.fillRoundedRect(cx - 33 + swing * 0.5, feet - 13, 31, 13, 5);
  g.fillRoundedRect(cx + 2 - swing * 0.5, feet - 13, 31, 13, 5);

  // Arms.
  g.fillStyle(SKIN, 1);
  g.fillRoundedRect(cx - 51, hip - 66 - bob - swing * 0.5, 18, 46, 9);
  g.fillRoundedRect(cx + 33, hip - 66 - bob + swing * 0.5, 18, 46, 9);

  // Bulky torso.
  g.fillStyle(BRAND.orangeDark, 1);
  g.fillRoundedRect(cx - 42, hip - 74 - bob, 84, 80, 16);
  g.fillStyle(BRAND.orange, 1);
  g.fillRoundedRect(cx - 38, hip - 70 - bob, 76, 58, 14);

  // Head and neck.
  g.fillStyle(SKIN, 1);
  g.fillRoundedRect(cx - 14, hip - 84 - bob, 28, 16, 5);
  g.fillCircle(cx, hip - 96 - bob, 22);
  g.fillStyle(HAIR, 1);
  g.fillRect(cx - 22, hip - 112 - bob, 44, 13);
  g.fillCircle(cx, hip - 104 - bob, 21);
}

/** Draws one frame of the chasing dog, three-quarter view. */
function chaserDog(g, ox, oy, w, h, frame, frames) {
  const phase = (frame / frames) * Math.PI * 2;
  const swing = Math.sin(phase) * 9;
  const feet = oy + h - 2;
  const body = 0x8a5a32;
  const bodyDark = 0x6c4523;

  // Legs.
  g.fillStyle(bodyDark, 1);
  g.fillRoundedRect(ox + 22 + swing, feet - 26, 11, 26, 5);
  g.fillRoundedRect(ox + 40 - swing, feet - 26, 11, 26, 5);
  g.fillRoundedRect(ox + 74 - swing, feet - 26, 11, 26, 5);
  g.fillRoundedRect(ox + 90 + swing, feet - 26, 11, 26, 5);

  // Body and tail.
  g.fillStyle(body, 1);
  g.fillRoundedRect(ox + 18, feet - 48, 86, 30, 14);
  g.fillRoundedRect(ox + 2, feet - 52 - swing * 0.5, 22, 9, 4);

  // Head.
  g.fillStyle(body, 1);
  g.fillCircle(ox + 100, feet - 54, 17);
  g.fillRoundedRect(ox + 104, feet - 52, 16, 12, 5);
  g.fillStyle(bodyDark, 1);
  g.fillTriangle(ox + 92, feet - 68, ox + 88, feet - 50, ox + 102, feet - 58);
  g.fillStyle(0x101010, 1);
  g.fillCircle(ox + 106, feet - 56, 3);
}

/** A rolled dosa: golden, crisp, with a highlight. */
function dosa(g, ox, oy, w, h) {
  const cx = ox + w / 2;
  const cy = oy + h / 2;

  g.fillStyle(0xb9752a, 1);
  g.fillEllipse(cx, cy + 4, w - 8, h - 12);
  g.fillStyle(0xe8a94b, 1);
  g.fillEllipse(cx, cy, w - 12, h - 18);
  g.fillStyle(0xf7cf82, 1);
  g.fillEllipse(cx - 8, cy - 6, w * 0.45, h * 0.32);

  // Toasted flecks.
  g.fillStyle(0xa4601f, 1);
  g.fillCircle(cx + 16, cy + 5, 3);
  g.fillCircle(cx - 20, cy + 8, 2.5);
  g.fillCircle(cx + 4, cy + 11, 2);

  // Rolled ends.
  g.fillStyle(0xfaf0d8, 1);
  g.fillEllipse(ox + 10, cy - 2, 14, h * 0.5);
  g.fillEllipse(ox + w - 10, cy + 2, 14, h * 0.5);
}

/** Bag icon with `frames` fill states, empty -> full. */
function bag(g, ox, oy, w, h, frame, frames) {
  const fill = frames > 1 ? frame / (frames - 1) : 0;
  const bx = ox + 8;
  const by = oy + 18;
  const bw = w - 16;
  const bh = h - 22;

  // Handles.
  g.lineStyle(5, BRAND.greenDark, 1);
  g.beginPath();
  g.arc(ox + w / 2, by + 2, 13, Math.PI, 0, false);
  g.strokePath();
  g.lineStyle(0, 0, 0);

  // Bag body.
  g.fillStyle(BRAND.green, 1);
  g.fillRoundedRect(bx, by, bw, bh, 6);

  // Fill level rises as dosas go in.
  if (fill > 0) {
    const fh = Math.max(4, (bh - 8) * fill);
    g.fillStyle(BRAND.orange, 1);
    g.fillRoundedRect(bx + 4, by + bh - 4 - fh, bw - 8, fh, 4);
    g.fillStyle(BRAND.orangeLight, 1);
    g.fillRect(bx + 4, by + bh - 4 - fh, bw - 8, 3);
  }

  g.lineStyle(3, BRAND.greenDark, 1);
  g.strokeRoundedRect(bx, by, bw, bh, 6);
  g.lineStyle(0, 0, 0);
}

/** A car seen from behind — tall, always fatal. */
function car(g, ox, oy, w, h) {
  const cx = ox + w / 2;
  const bottom = oy + h - 2;

  // Shadow.
  g.fillStyle(0x000000, 0.22);
  g.fillEllipse(cx, bottom - 4, w * 0.92, 18);

  // Wheels.
  g.fillStyle(0x1b1b1b, 1);
  g.fillRoundedRect(ox + 6, bottom - 34, 22, 30, 6);
  g.fillRoundedRect(ox + w - 28, bottom - 34, 22, 30, 6);

  // Body.
  g.fillStyle(0x9d3030, 1);
  g.fillRoundedRect(ox + 10, oy + 46, w - 20, h - 62, 14);
  g.fillStyle(0xb63b3b, 1);
  g.fillRoundedRect(ox + 14, oy + 50, w - 28, h - 76, 12);

  // Cabin / rear window.
  g.fillStyle(0x7f2626, 1);
  g.fillRoundedRect(ox + 28, oy + 8, w - 56, 54, 12);
  g.fillStyle(0x2c3c49, 1);
  g.fillRoundedRect(ox + 34, oy + 16, w - 68, 38, 8);
  g.fillStyle(0x4a6275, 1);
  g.fillRect(ox + 38, oy + 20, w - 76, 9);

  // Tail lights and bumper.
  g.fillStyle(0xff5a48, 1);
  g.fillRoundedRect(ox + 18, oy + 82, 26, 18, 4);
  g.fillRoundedRect(ox + w - 44, oy + 82, 26, 18, 4);
  g.fillStyle(0x3a3a3a, 1);
  g.fillRoundedRect(ox + 12, bottom - 46, w - 24, 16, 5);
  g.fillStyle(0xe8e8e8, 1);
  g.fillRoundedRect(cx - 24, bottom - 44, 48, 12, 3);
}

/** A street tree — tall, always fatal. */
function tree(g, ox, oy, w, h) {
  const cx = ox + w / 2;
  const bottom = oy + h - 2;

  g.fillStyle(0x000000, 0.22);
  g.fillEllipse(cx, bottom - 4, w * 0.7, 16);

  // Trunk.
  g.fillStyle(0x6b4a2f, 1);
  g.fillRoundedRect(cx - 13, bottom - 96, 26, 94, 6);
  g.fillStyle(0x53381f, 1);
  g.fillRect(cx - 4, bottom - 92, 6, 86);

  // Canopy.
  g.fillStyle(0x2f6b46, 1);
  g.fillCircle(cx, oy + 74, 62);
  g.fillCircle(cx - 40, oy + 96, 42);
  g.fillCircle(cx + 40, oy + 96, 42);
  g.fillStyle(0x3f8b5b, 1);
  g.fillCircle(cx - 12, oy + 62, 46);
  g.fillCircle(cx + 30, oy + 80, 34);
  g.fillStyle(0x53a870, 1);
  g.fillCircle(cx - 22, oy + 52, 24);
}

/** A construction pylon — low enough to hurdle. */
function pylon(g, ox, oy, w, h) {
  const cx = ox + w / 2;
  const bottom = oy + h - 2;

  g.fillStyle(0x000000, 0.2);
  g.fillEllipse(cx, bottom - 3, w * 0.8, 12);

  g.fillStyle(BRAND.orangeDark, 1);
  g.fillRoundedRect(ox + 6, bottom - 14, w - 12, 14, 4);
  g.fillStyle(BRAND.orange, 1);
  g.fillTriangle(cx, oy + 4, ox + 14, bottom - 10, ox + w - 14, bottom - 10);
  g.fillStyle(0xf7f3ec, 1);
  g.fillTriangle(cx, oy + 22, ox + 25, bottom - 34, ox + w - 25, bottom - 34);
  g.fillStyle(BRAND.orange, 1);
  g.fillTriangle(cx, oy + 34, ox + 31, bottom - 42, ox + w - 31, bottom - 42);
}

/**
 * Sky gradient above the rooftops.
 *
 * Painted as discrete bands rather than with `fillGradientStyle`: gradients
 * are a WebGL-only Graphics feature, and `generateTexture` always renders
 * through the canvas path, where they come out blank.
 */
function sky(g, ox, oy, w, h) {
  const top = { r: 0x6f, g: 0xab, b: 0xd6 };
  const bottom = { r: 0xdf, g: 0xec, b: 0xf4 };
  const bands = 48;

  for (let i = 0; i < bands; i += 1) {
    const t = i / (bands - 1);
    const r = Math.round(top.r + (bottom.r - top.r) * t);
    const gg = Math.round(top.g + (bottom.g - top.g) * t);
    const b = Math.round(top.b + (bottom.b - top.b) * t);
    g.fillStyle((r << 16) | (gg << 8) | b, 1);
    g.fillRect(ox, oy + (h / bands) * i, w, h / bands + 1);
  }

  g.fillStyle(0xffffff, 0.55);
  g.fillEllipse(ox + 90, oy + 70, 150, 54);
  g.fillEllipse(ox + 140, oy + 58, 110, 48);
  g.fillEllipse(ox + 350, oy + 104, 170, 58);
  g.fillEllipse(ox + 402, oy + 92, 120, 46);
}

/**
 * A three-quarter view building block, drawn so its roof line falls away
 * toward the far end. The near (tall) edge is on the right; Buildings.js
 * mirrors the sprite for the opposite side of the street.
 */
function buildingBlock(g, ox, oy, w, h, wall, wallShade, trim, awning) {
  const farTop = oy + h * 0.34;

  // Facade, receding to the left.
  g.fillStyle(wall, 1);
  g.fillPoints(
    [
      { x: ox, y: farTop },
      { x: ox + w, y: oy },
      { x: ox + w, y: oy + h },
      { x: ox, y: oy + h },
    ],
    true
  );

  // Cornice along the roofline.
  g.fillStyle(trim, 1);
  g.fillPoints(
    [
      { x: ox, y: farTop },
      { x: ox + w, y: oy },
      { x: ox + w, y: oy + h * 0.055 },
      { x: ox, y: farTop + h * 0.04 },
    ],
    true
  );

  // Window grid, shrinking and rising toward the far end.
  const cols = 5;
  for (let c = 0; c < cols; c += 1) {
    const t0 = c / cols;
    const t1 = (c + 0.62) / cols;
    const x0 = ox + w * t0;
    const x1 = ox + w * t1;
    const top0 = farTop + (oy - farTop) * t0;
    const top1 = farTop + (oy - farTop) * t1;

    for (let row = 0; row < 2; row += 1) {
      const yOff = h * (0.16 + row * 0.24);
      const winH = h * 0.15 * (0.72 + t0 * 0.4);
      g.fillStyle(wallShade, 1);
      g.fillPoints(
        [
          { x: x0, y: top0 + yOff },
          { x: x1, y: top1 + yOff },
          { x: x1, y: top1 + yOff + winH },
          { x: x0, y: top0 + yOff + winH },
        ],
        true
      );
      g.fillStyle(0x8fa7b5, 0.55);
      g.fillPoints(
        [
          { x: x0, y: top0 + yOff },
          { x: x1, y: top1 + yOff },
          { x: x1, y: top1 + yOff + winH * 0.3 },
          { x: x0, y: top0 + yOff + winH * 0.3 },
        ],
        true
      );
    }
  }

  // Ground-floor shopfront with a blank sign board and an awning.
  g.fillStyle(0x2f3a42, 1);
  g.fillRect(ox, oy + h * 0.74, w, h * 0.26);
  g.fillStyle(awning, 1);
  g.fillRect(ox, oy + h * 0.7, w, h * 0.06);
  g.fillStyle(trim, 1);
  g.fillRect(ox, oy + h * 0.64, w, h * 0.06);

  // Near corner edge, to read the volume.
  g.fillStyle(wallShade, 0.5);
  g.fillRect(ox + w - Math.max(3, w * 0.03), oy, Math.max(3, w * 0.03), h);
}

/** Kingston limestone block. */
function buildingA(g, ox, oy, w, h) {
  buildingBlock(g, ox, oy, w, h, LIMESTONE, LIMESTONE_DARK, 0xe8e3d6, 0x1ba37e);
}

/** Painted brick storefront. */
function buildingB(g, ox, oy, w, h) {
  buildingBlock(g, ox, oy, w, h, 0xa9614a, 0x8a4a36, 0xe8e3d6, 0xf2802b);
}

/**
 * The perspective road surface.
 *
 * Built from the same maths the gameplay uses (Road.js), so the asphalt
 * edges line up exactly with the outermost lanes. The texture is anchored
 * at ROAD.horizonY on screen.
 */
function road(g, ox, oy, w, h) {
  const cx = ox + w / 2;
  const toTexY = (depth) => oy + (groundYAt(depth) - ROAD.horizonY);

  // Sidewalk running out to both screen edges.
  g.fillStyle(CONCRETE, 1);
  g.fillRect(ox, oy, w, h);
  g.fillStyle(0xc9c5bc, 1);
  for (let y = oy + 40; y < oy + h; y += 46) {
    g.fillRect(ox, y, w, 3);
  }

  const left = [];
  const right = [];
  for (let d = 0; d <= 1.2001; d += 0.04) {
    const y = toTexY(d);
    const half = roadHalfWidthAt(d);
    left.push({ x: cx - half, y });
    right.push({ x: cx + half, y });
    if (y > oy + h) break;
  }

  const quad = (a, b, inset, outset, color) => {
    g.fillStyle(color, 1);
    g.fillPoints(
      [
        { x: a.x + inset, y: a.y },
        { x: b.x + inset, y: b.y },
        { x: b.x + outset, y: b.y },
        { x: a.x + outset, y: a.y },
      ],
      true
    );
  };

  for (let i = 0; i < left.length - 1; i += 1) {
    const l0 = left[i];
    const l1 = left[i + 1];
    const r0 = right[i];
    const r1 = right[i + 1];

    // Asphalt slab for this depth band. Nearer bands are a touch lighter,
    // which reads as depth without banding into visible stripes.
    g.fillStyle(i < left.length * 0.45 ? ASPHALT_DARK : ASPHALT, 1);
    g.fillPoints(
      [
        { x: l0.x, y: l0.y },
        { x: r0.x, y: r0.y },
        { x: r1.x, y: r1.y },
        { x: l1.x, y: l1.y },
      ],
      true
    );

    // Concrete gutter + curb on each shoulder.
    const gutter = 16 * (1 + i * 0.12);
    quad(l0, l1, -gutter, 0, CONCRETE);
    quad(r0, r1, 0, gutter, CONCRETE);
    quad(l0, l1, -gutter - 5, -gutter, 0x8f8a80);
    quad(r0, r1, gutter, gutter + 5, 0x8f8a80);
  }
}

const PAINTERS = {
  boy,
  chaserMan,
  chaserDog,
  dosa,
  bag,
  car,
  tree,
  pylon,
  sky,
  buildingA,
  buildingB,
  road,
};

/**
 * Generates the placeholder texture for one manifest entry.
 * Multi-frame entries are laid out horizontally and registered frame by
 * frame, so `anims.generateFrameNumbers` behaves identically to a real
 * loaded spritesheet.
 */
export function createPlaceholderTexture(scene, entry) {
  const spec = entry.placeholder;
  if (!spec) return;

  const painter = PAINTERS[spec.kind];
  if (!painter) {
    console.warn(`[assets] no placeholder painter for "${spec.kind}"`);
    return;
  }

  const frames = spec.frames ?? 1;
  const { width, height } = spec;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  for (let i = 0; i < frames; i += 1) {
    painter(g, i * width, 0, width, height, i, frames);
  }

  if (scene.textures.exists(entry.key)) {
    scene.textures.remove(entry.key);
  }
  g.generateTexture(entry.key, width * frames, height);
  g.destroy();

  if (frames > 1) {
    const texture = scene.textures.get(entry.key);
    for (let i = 0; i < frames; i += 1) {
      texture.add(i, 0, i * width, 0, width, height);
    }
  }
}
