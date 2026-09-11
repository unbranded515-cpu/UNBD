/**
 * Every tunable number in Dosa Run lives here.
 * Gameplay feel, difficulty curve and the fake-3D road geometry are all
 * data — no magic numbers buried in the scenes.
 */

export const VIEW = {
  width: 480,
  height: 854,
};

/** The fake-3D road. Objects travel from `depth` 0 (horizon) to 1 (camera). */
export const ROAD = {
  /** Screen y of the vanishing point. */
  horizonY: 300,
  /** Screen y where an object sits when it reaches the player. */
  groundY: 700,
  /** Screen y at which an object has fully passed the camera. */
  exitY: 940,
  /** Horizontal distance between lane centres at full (depth 1) size. */
  laneSpacing: 128,
  /** Half-width of the asphalt at full (depth 1) size. */
  halfWidth: 228,
  /** Sprite scale at the horizon; grows to 1 at the camera. */
  vanishScale: 0.18,
  /** Depth past which an object is recycled. */
  despawnDepth: 1.35,
};

export const LANES = [-1, 0, 1];
export const LANE_LEFT = 0;
export const LANE_CENTER = 1;
export const LANE_RIGHT = 2;

export const PLAYER = {
  startLane: LANE_CENTER,
  /** Seconds to slide between adjacent lanes. */
  laneChangeMs: 140,
  jumpMs: 620,
  jumpHeight: 132,
  /** Fraction of jumpMs at the apex where the hop reads as "airborne". */
  airborneWindow: [0.08, 0.92],
  bobAmplitude: 5,
  bobSpeed: 0.016,
};

export const CHASER = {
  /** Depth offset behind the player — > 1 means nearer the camera. */
  baseDepth: 1.085,
  /** How close the chaser may creep (visual tension only, never fatal). */
  minDepth: 1.045,
  maxDepth: 1.13,
  /** Depth gained per second of running — tension slowly builds. */
  closeRate: 0.0055,
  /** Depth pushed back per dosa collected. */
  dosaPushback: 0.014,
  /** Lane-width offsets that sit the pair either side of the boy. */
  manLaneOffset: -0.34,
  dogLaneOffset: 0.42,
  /** Drawn smaller than strict perspective, so they frame him not hide him. */
  manScale: 0.62,
  dogScale: 0.55,
  bobSpeed: 0.021,
  bobAmplitude: 7,
};

export const DIFFICULTY = {
  /** World units travelled per second at level 0. */
  startSpeed: 430,
  /** Added to speed for every level gained. */
  speedPerLevel: 34,
  maxSpeed: 1050,
  /** Dosas required per difficulty level-up. */
  dosasPerLevel: 12,

  /** Milliseconds between obstacle spawns at level 0. */
  obstacleIntervalMs: 1180,
  /** Multiplied into the interval per level (spawns get more frequent). */
  obstacleIntervalDecay: 0.9,
  minObstacleIntervalMs: 420,
  /** Chance a spawn wave places obstacles in two lanes at once. */
  doubleObstacleChanceBase: 0.06,
  doubleObstacleChancePerLevel: 0.05,
  maxDoubleObstacleChance: 0.45,

  dosaIntervalMs: 700,
  minDosaIntervalMs: 340,
  dosaIntervalDecay: 0.94,
  /** Dosas spawned in a row as a collectible "trail". */
  dosaRunLength: [2, 5],
};

/**
 * Obstacle types. `lowProfile: true` means a jump clears it.
 * Cars and trees are tall — they always end the run, exactly as specified.
 */
export const OBSTACLES = [
  { key: 'car', texture: 'obstacle-car', lowProfile: false, weight: 4, footY: 0.94 },
  { key: 'tree', texture: 'obstacle-tree', lowProfile: false, weight: 3, footY: 0.99 },
  { key: 'pylon', texture: 'obstacle-pylon', lowProfile: true, weight: 3, footY: 0.98 },
];

export const SCORING = {
  dosaPoints: 1,
  /** Bonus dosas for hurdling a low obstacle cleanly. */
  hurdleBonus: 1,
};

/** Bag fill artwork has this many states (0 = empty … n-1 = full). */
export const BAG_FILL_STATES = 5;
/** Dosas per full bag before the fill meter wraps around. */
export const BAG_CAPACITY = 12;
