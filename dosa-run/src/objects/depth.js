import { groundYAt, laneXAt, scaleAt, depthSortKey } from '../config/Road.js';

/**
 * Positions any sprite on the fake-3D road.
 *
 * `lane` may be fractional (mid lane-change), `depth` runs 0 (horizon) -> 1
 * (the player's plane) and beyond. `hover` lifts the sprite off the asphalt
 * in depth-corrected pixels, which is how dosas float and the player jumps.
 */
export function placeByDepth(sprite, lane, depth, hover = 0, scaleMul = 1) {
  const scale = scaleAt(depth) * scaleMul;
  sprite.x = laneXAt(lane, depth);
  sprite.y = groundYAt(depth) - hover * scale;
  sprite.setScale(scale);
  sprite.setDepth(depthSortKey(depth));
  return scale;
}

/**
 * Shrinks an Arcade body to a fair hitbox expressed as fractions of the
 * source frame. Arcade rescales bodies automatically when the sprite scales,
 * so this only needs setting once.
 *
 * @param {number} footY vertical anchor (0-1) where the object meets the road
 */
export function setHitbox(sprite, widthFrac, heightFrac, footY = 1) {
  const frameW = sprite.frame.realWidth;
  const frameH = sprite.frame.realHeight;
  const bw = frameW * widthFrac;
  const bh = frameH * heightFrac;

  sprite.body.setSize(bw, bh, false);
  sprite.body.setOffset((frameW - bw) / 2, frameH * footY - bh);
}
