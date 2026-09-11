import Phaser from 'phaser';
import Background from '../objects/Background.js';
import Chaser from '../objects/Chaser.js';
import Player from '../objects/Player.js';
import Spawner from '../objects/Spawner.js';
import Hud from '../ui/Hud.js';
import TouchControls from '../ui/TouchControls.js';
import InputController from '../input/InputController.js';
import { GameState } from '../state/GameState.js';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';
import { DIFFICULTY, SCORING, VIEW } from '../config/GameConfig.js';

/**
 * The run itself.
 *
 * The boy stays put on the `depth = 1` plane while the street, the dosas and
 * the obstacles rush toward the camera. One `speed` value drives the
 * background, the spawner and the sense of pace; it steps up every
 * `DIFFICULTY.dosasPerLevel` dosas, along with the spawn rate.
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.score = 0;
    this.level = 0;
    this.speed = DIFFICULTY.startSpeed;
    this.isRunning = true;
    this.isPaused = false;

    this.background = new Background(this);
    this.spawner = new Spawner(this);
    this.player = new Player(this);
    this.chaser = new Chaser(this);
    this.hud = new Hud(this);

    this.physics.add.overlap(
      this.player,
      this.spawner.obstacles,
      this.onObstacleOverlap,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.spawner.dosas,
      this.onDosaCollected,
      null,
      this
    );

    const handlers = {
      onLeft: () => this.isRunning && !this.isPaused && this.player.moveLane(-1),
      onRight: () => this.isRunning && !this.isPaused && this.player.moveLane(1),
      onJump: () => this.isRunning && !this.isPaused && this.player.jump(),
      onPause: () => this.togglePause(),
    };

    this.touchControls = new TouchControls(this, handlers);
    this.inputController = new InputController(this, {
      ...handlers,
      onTap: (pointer) => {
        // Tap the street to hop; the HUD and control strip are excluded.
        if (pointer.y > 130 && pointer.y < VIEW.height - 170) handlers.onJump();
      },
    });
    this.inputController.isOverControls = (x, y) => this.touchControls.hitTest(x, y);

    this.createPauseButton();
    this.showReadyBanner();
  }

  update(time, delta) {
    if (!this.isRunning || this.isPaused) return;

    const dt = Math.min(delta, 40); // Swallow tab-switch spikes.

    this.background.update(dt, this.speed);
    this.spawner.update(dt, this.speed, this.level);
    this.player.update(dt);
    this.chaser.update(dt, this.player.laneVisual);

    this.awardHurdles();
  }

  // ------------------------------------------------------------ collisions

  onObstacleOverlap(player, obstacle) {
    if (!this.isRunning || obstacle.hurdled) return;

    // Low obstacles are cleared mid-hop; cars and trees never are.
    if (obstacle.lowProfile && player.isAirborne) {
      obstacle.hurdled = true;
      return;
    }

    this.endRun(obstacle.obstacleType);
  }

  /** Pays out the bonus once a hurdled obstacle is safely behind the boy. */
  awardHurdles() {
    for (const obstacle of this.spawner.obstacles.getChildren()) {
      if (!obstacle.hurdled || obstacle.bonusPaid) continue;
      if (obstacle.roadDepth < 1.05) continue;

      obstacle.bonusPaid = true;
      this.addScore(SCORING.hurdleBonus);
      this.hud.flash('NICE HURDLE!', CSS.green);
    }
  }

  onDosaCollected(player, dosa) {
    if (!this.isRunning || dosa.collected) return;
    dosa.collected = true;
    dosa.body.enable = false;
    this.spawner.dosas.remove(dosa);

    this.flyIntoBag(dosa);
    this.chaser.pushBack();
    this.addScore(SCORING.dosaPoints);
  }

  /** Tweens the collected dosa into the bag on the boy's back. */
  flyIntoBag(dosa) {
    const anchor = this.player.bagAnchor;
    dosa.setDepth(this.player.depth + 2);

    this.tweens.add({
      targets: dosa,
      x: anchor.x,
      y: anchor.y,
      scale: dosa.scale * 0.25,
      angle: 220,
      duration: 260,
      ease: 'Quad.easeIn',
      onComplete: () => dosa.destroy(),
    });
  }

  // --------------------------------------------------------------- scoring

  addScore(points) {
    this.score += points;
    this.hud.setScore(this.score);

    const nextLevel = Math.floor(this.score / DIFFICULTY.dosasPerLevel);
    if (nextLevel > this.level) {
      this.level = nextLevel;
      this.onLevelUp();
    }
  }

  onLevelUp() {
    this.speed = Math.min(
      DIFFICULTY.maxSpeed,
      DIFFICULTY.startSpeed + DIFFICULTY.speedPerLevel * this.level
    );
    this.hud.setLevel(this.level);
    this.hud.flash('SPEED UP!', CSS.orange);
    this.cameras.main.shake(180, 0.004);
  }

  // ----------------------------------------------------------- run control

  endRun(cause) {
    if (!this.isRunning) return;
    this.isRunning = false;

    this.inputController.setEnabled(false);
    this.player.anims.stop();
    this.cameras.main.shake(260, 0.011);
    this.cameras.main.flash(180, 255, 255, 255);

    // The chase finally catches up — pure theatre, the run is already over.
    this.tweens.add({
      targets: this.player,
      angle: 18,
      duration: 400,
      ease: 'Quad.easeOut',
    });

    this.time.delayedCall(620, () => {
      const isBest = GameState.submitScore(this.score);
      this.scene.start('GameOver', {
        score: this.score,
        best: GameState.bestScore,
        isBest,
        level: this.level,
        cause,
      });
    });
  }

  togglePause() {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.player.anims.pause();
      this.chaser.man.anims.pause();
      this.chaser.dog.anims.pause();
      this.pauseOverlay.setVisible(true);
      this.pauseLabel.setVisible(true);
    } else {
      this.player.anims.resume();
      this.chaser.man.anims.resume();
      this.chaser.dog.anims.resume();
      this.pauseOverlay.setVisible(false);
      this.pauseLabel.setVisible(false);
    }
  }

  // ---------------------------------------------------------------- chrome

  createPauseButton() {
    const btn = this.add
      .text(VIEW.width - 30, 100, '❚❚', {
        fontFamily: FONT_STACK,
        fontSize: '22px',
        color: CSS.inkSoft,
      })
      .setOrigin(1, 0.5)
      .setDepth(1001)
      .setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.togglePause());

    this.pauseOverlay = this.add.graphics().setDepth(1100).setVisible(false);
    this.pauseOverlay.fillStyle(BRAND.ink, 0.62);
    this.pauseOverlay.fillRect(0, 0, VIEW.width, VIEW.height);

    this.pauseLabel = this.add
      .text(VIEW.width / 2, VIEW.height / 2, 'PAUSED\n\ntap or press P to resume', {
        fontFamily: FONT_STACK,
        fontSize: '28px',
        fontStyle: 'bold',
        color: CSS.white,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(1101)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });
    this.pauseLabel.on('pointerdown', () => this.togglePause());
  }

  showReadyBanner() {
    const banner = this.add
      .text(VIEW.width / 2, 190, 'RUN!', {
        fontFamily: FONT_STACK,
        fontSize: '56px',
        fontStyle: 'bold',
        color: CSS.green,
        stroke: CSS.white,
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(1200);

    this.tweens.add({
      targets: banner,
      scale: 1.3,
      alpha: 0,
      duration: 750,
      ease: 'Quad.easeIn',
      onComplete: () => banner.destroy(),
    });
  }
}
