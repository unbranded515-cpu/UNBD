import { ROAD, VIEW } from './GameConfig.js';

/**
 * Fake-3D road maths.
 *
 * The street is rendered from behind the runner: everything spawns at the
 * horizon with `depth = 0` and travels toward the camera until `depth = 1`,
 * the plane the player stands on. Depths above 1 are nearer than the player
 * (that is where the chaser lives) and objects are recycled past
 * `ROAD.despawnDepth`.
 *
 * Scale follows a true perspective divide, so it never goes negative and
 * keeps growing smoothly as things sweep past the camera.
 */

const SPAN = ROAD.groundY - ROAD.horizonY;

/** Sprite scale at a given depth. 0 -> ROAD.vanishScale, 1 -> 1. */
export function scaleAt(depth) {
  return Math.pow(ROAD.vanishScale, 1 - depth);
}

/** Screen y of the ground contact point at a given depth. */
export function groundYAt(depth) {
  return (
    ROAD.horizonY +
    (SPAN * (scaleAt(depth) - ROAD.vanishScale)) / (1 - ROAD.vanishScale)
  );
}

/** Horizontal offset of a lane centre from the middle of the road. */
export function laneOffsetAt(lane, depth) {
  return (lane - 1) * ROAD.laneSpacing * scaleAt(depth);
}

/** Screen x of a lane centre. `lane` may be fractional while sliding. */
export function laneXAt(lane, depth) {
  return VIEW.width / 2 + laneOffsetAt(lane, depth);
}

/** Half-width of the asphalt at a given depth. */
export function roadHalfWidthAt(depth) {
  return ROAD.halfWidth * scaleAt(depth);
}

/**
 * Render order key. Nearer objects must paint over farther ones, and
 * everything must paint over the background layers.
 */
export function depthSortKey(depth) {
  return 100 + depth * 100;
}
