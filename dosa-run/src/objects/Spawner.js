import Phaser from 'phaser';
import { DIFFICULTY, LANES, OBSTACLES, ROAD } from '../config/GameConfig.js';
import { placeByDepth, setHitbox } from './depth.js';

const DOSA_HOVER = 46;

/**
 * Streams obstacles and dosas down the road.
 *
 * Everything spawns at the horizon and advances by depth each frame, so a
 * single speed value drives the whole world. Spawn intervals tighten with
 * the difficulty level, and the spawner refuses to lay down a wave that
 * leaves the player no open lane.
 */
export default class Spawner {
  constructor(scene) {
    this.scene = scene;

    this.obstacles = scene.physics.add.group();
    this.dosas = scene.physics.add.group();

    this.obstacleTimer = 0;
    this.dosaTimer = DIFFICULTY.dosaIntervalMs * 0.6;
    this.dosaQueue = 0;
    this.dosaLane = 1;

    this.obstacleWeightTotal = OBSTACLES.reduce((sum, o) => sum + o.weight, 0);
    /** Lanes blocked by the most recent obstacle wave. */
    this.lastBlockedLanes = [];
  }

  obstacleInterval(level) {
    return Math.max(
      DIFFICULTY.minObstacleIntervalMs,
      DIFFICULTY.obstacleIntervalMs *
        Math.pow(DIFFICULTY.obstacleIntervalDecay, level)
    );
  }

  dosaInterval(level) {
    return Math.max(
      DIFFICULTY.minDosaIntervalMs,
      DIFFICULTY.dosaIntervalMs * Math.pow(DIFFICULTY.dosaIntervalDecay, level)
    );
  }

  update(delta, speed, level) {
    const depthStep = (speed * delta) / 1000 / 1000;

    this.advance(this.obstacles, depthStep);
    this.advance(this.dosas, depthStep);

    this.obstacleTimer -= delta;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacleWave(level);
      this.obstacleTimer = this.obstacleInterval(level);
    }

    this.dosaTimer -= delta;
    if (this.dosaTimer <= 0) {
      this.spawnDosa();
      this.dosaTimer = this.dosaInterval(level);
    }
  }

  advance(group, depthStep) {
    for (const child of group.getChildren()) {
      if (!child.active) continue;

      child.roadDepth += depthStep;
      if (child.roadDepth >= ROAD.despawnDepth) {
        this.recycle(child);
        continue;
      }

      placeByDepth(
        child,
        child.roadLane,
        child.roadDepth,
        child.roadHover ?? 0
      );

    }
  }

  recycle(child) {
    child.destroy();
  }

  spawnObstacleWave(level) {
    const doubleChance = Math.min(
      DIFFICULTY.maxDoubleObstacleChance,
      DIFFICULTY.doubleObstacleChanceBase +
        DIFFICULTY.doubleObstacleChancePerLevel * level
    );

    // Never two crowded waves back to back — the player needs breathing room.
    const allowDouble = this.lastBlockedLanes.length < 2;
    const count = allowDouble && Math.random() < doubleChance ? 2 : 1;
    const lanes = Phaser.Utils.Array.Shuffle([...LANES.keys()]).slice(0, count);

    // Never wall off the road: at least one lane always stays open.
    if (lanes.length >= LANES.length) lanes.pop();

    for (const lane of lanes) {
      this.spawnObstacle(lane);
    }
    this.lastBlockedLanes = lanes;
  }

  pickObstacleType() {
    let roll = Math.random() * this.obstacleWeightTotal;
    for (const type of OBSTACLES) {
      roll -= type.weight;
      if (roll <= 0) return type;
    }
    return OBSTACLES[0];
  }

  spawnObstacle(lane) {
    const type = this.pickObstacleType();
    const sprite = this.obstacles.create(0, 0, type.texture);

    sprite.setOrigin(0.5, type.footY);
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);
    setHitbox(sprite, 0.52, 0.46, type.footY);

    sprite.obstacleType = type.key;
    sprite.lowProfile = type.lowProfile;
    sprite.hurdled = false;
    sprite.roadLane = lane;
    sprite.roadDepth = 0;
    sprite.roadHover = 0;

    placeByDepth(sprite, lane, 0, 0);
    return sprite;
  }

  /**
   * True when an obstacle is sitting at the top of this lane. A dosa spawned
   * there would ride inside it all the way down and be uncollectable.
   */
  laneIsBlockedAtHorizon(lane) {
    return this.obstacles
      .getChildren()
      .some((o) => o.active && o.roadLane === lane && o.roadDepth < 0.16);
  }

  spawnDosa() {
    // Dosas arrive in short trails through a single lane, so they read as a
    // path to follow rather than scattered noise.
    if (this.dosaQueue <= 0) {
      const [min, max] = DIFFICULTY.dosaRunLength;
      this.dosaQueue = Phaser.Math.Between(min, max);
      this.dosaLane = Phaser.Math.Between(0, LANES.length - 1);
    }

    if (this.laneIsBlockedAtHorizon(this.dosaLane)) {
      const open = [...LANES.keys()].filter(
        (lane) => !this.laneIsBlockedAtHorizon(lane)
      );
      if (open.length === 0) return null;
      this.dosaLane = Phaser.Utils.Array.GetRandom(open);
      this.dosaQueue = 0;
    }
    this.dosaQueue -= 1;

    const sprite = this.dosas.create(0, 0, 'dosa');
    sprite.setOrigin(0.5, 0.5);
    sprite.body.setAllowGravity(false);
    setHitbox(sprite, 0.8, 0.8, 0.9);

    sprite.roadLane = this.dosaLane;
    sprite.roadDepth = 0;
    sprite.roadHover = DOSA_HOVER;

    placeByDepth(sprite, sprite.roadLane, 0, DOSA_HOVER);
    return sprite;
  }

  /** Clears the road — used when a run ends. */
  reset() {
    this.obstacles.clear(true, true);
    this.dosas.clear(true, true);
    this.obstacleTimer = this.obstacleInterval(0);
    this.dosaTimer = this.dosaInterval(0);
    this.dosaQueue = 0;
  }
}
