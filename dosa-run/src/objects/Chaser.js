import Phaser from 'phaser';
import { CHASER } from '../config/GameConfig.js';
import { placeByDepth } from './depth.js';

/**
 * The big man and his dog, always just behind the boy.
 *
 * They live at depth > 1 — nearer the camera than the player — so they read
 * as breathing down his neck. Purely atmospheric: they never end a run.
 * Tension builds as the chase drags on and eases off each time a dosa is
 * collected, which is what makes the gap feel earned.
 */
export default class Chaser {
  constructor(scene) {
    this.scene = scene;
    this.depth = CHASER.baseDepth;
    this.lane = 1;
    this.time = 0;

    this.man = scene.add.sprite(0, 0, 'chaser-man', 0).setOrigin(0.5, 1);
    this.dog = scene.add.sprite(0, 0, 'chaser-dog', 0).setOrigin(0.5, 1);

    this.man.play('chaser-running');
    this.dog.play('dog-running');
  }

  /** Called on every dosa pickup — the boy gains a little ground. */
  pushBack() {
    this.depth = Phaser.Math.Clamp(
      this.depth + CHASER.dosaPushback,
      CHASER.minDepth,
      CHASER.maxDepth
    );
  }

  update(delta, playerLaneVisual) {
    this.time += delta;

    // Creep closer over time (depth shrinks toward the player's plane).
    this.depth = Phaser.Math.Clamp(
      this.depth - (CHASER.closeRate * delta) / 1000,
      CHASER.minDepth,
      CHASER.maxDepth
    );

    // Follow the boy's lane, but lag behind him.
    this.lane = Phaser.Math.Linear(
      this.lane,
      playerLaneVisual,
      Math.min(1, (delta / 1000) * 4.5)
    );

    const manBob = Math.abs(Math.sin(this.time * CHASER.bobSpeed)) * CHASER.bobAmplitude;
    const dogBob = Math.abs(Math.cos(this.time * CHASER.bobSpeed * 1.4)) * CHASER.bobAmplitude * 0.7;

    // Both are drawn nearer the camera than the boy but deliberately under
    // scale, so they crowd the frame behind him without covering him.
    placeByDepth(
      this.man,
      this.lane + CHASER.manLaneOffset,
      this.depth,
      manBob,
      CHASER.manScale
    );
    placeByDepth(
      this.dog,
      this.lane + CHASER.dogLaneOffset,
      this.depth - 0.015,
      dogBob,
      CHASER.dogScale
    );
  }

  destroy() {
    this.man.destroy();
    this.dog.destroy();
  }
}
