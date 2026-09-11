import Phaser from 'phaser';
import { PLAYER, LANES } from '../config/GameConfig.js';
import { placeByDepth, setHitbox } from './depth.js';

/**
 * The boy. He runs on the `depth = 1` plane at all times; the world moves
 * toward him. He can slide between three lanes and hop to clear low
 * obstacles. Collected dosas fly into the bag on his back — `bagAnchor`
 * is where they land.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'boy-run', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    setHitbox(this, 0.46, 0.62, 1);

    this.lane = PLAYER.startLane;
    this.laneVisual = PLAYER.startLane;
    this.laneTween = null;

    /** Runs 0 -> 1 through the hop arc; 0 while grounded. */
    this.jumpT = 0;
    this.bobTime = 0;

    this.play('boy-running');
    this.refresh();
  }

  /** True only through the middle of the hop, when low obstacles are cleared. */
  get isAirborne() {
    const [from, to] = PLAYER.airborneWindow;
    return this.jumpT > from && this.jumpT < to;
  }

  get hoverHeight() {
    return Math.sin(this.jumpT * Math.PI) * PLAYER.jumpHeight;
  }

  /** Screen position of the bag on his back — the target for collected dosas. */
  get bagAnchor() {
    return { x: this.x, y: this.y - this.displayHeight * 0.5 };
  }

  moveLane(direction) {
    const target = Phaser.Math.Clamp(this.lane + direction, 0, LANES.length - 1);
    if (target === this.lane) return false;

    this.lane = target;
    this.laneTween?.stop();
    this.laneTween = this.scene.tweens.add({
      targets: this,
      laneVisual: target,
      duration: PLAYER.laneChangeMs,
      ease: 'Quad.easeOut',
    });

    // A little lean into the slide.
    this.scene.tweens.add({
      targets: this,
      angle: direction * 9,
      duration: PLAYER.laneChangeMs,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });
    return true;
  }

  jump() {
    if (this.jumpT > 0) return false;

    this.scene.tweens.add({
      targets: this,
      jumpT: 1,
      duration: PLAYER.jumpMs,
      ease: 'Linear',
      onComplete: () => {
        this.jumpT = 0;
      },
    });
    return true;
  }

  update(delta) {
    this.bobTime += delta;
    this.refresh();
  }

  refresh() {
    const bob = Math.sin(this.bobTime * PLAYER.bobSpeed) * PLAYER.bobAmplitude;
    const scale = placeByDepth(this, this.laneVisual, 1, this.hoverHeight + bob);

    // A hop reads as coming slightly toward the camera.
    const lift = 1 + Math.sin(this.jumpT * Math.PI) * 0.08;
    this.setScale(scale * lift);
  }
}
