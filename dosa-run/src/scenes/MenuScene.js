import Phaser from 'phaser';
import Background from '../objects/Background.js';
import Button from '../ui/Button.js';
import { GameState } from '../state/GameState.js';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';
import { VIEW } from '../config/GameConfig.js';

/**
 * Title screen. The street idles in the background so the game reads as
 * alive before the first tap.
 */
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.background = new Background(this);

    // Scrim so the title stays readable over the street.
    const scrim = this.add.graphics().setDepth(500);
    scrim.fillStyle(BRAND.white, 0.93);
    scrim.fillRoundedRect(26, 92, VIEW.width - 52, 430, 28);
    scrim.fillStyle(BRAND.green, 1);
    scrim.fillRoundedRect(26, 92, VIEW.width - 52, 10, 5);

    // Reserved slot for the supplied logo — intentionally empty for now.
    const slot = this.add.graphics().setDepth(501);
    slot.lineStyle(2, BRAND.grey, 0.7);
    slot.strokeRoundedRect(VIEW.width / 2 - 52, 124, 104, 60, 12);
    this.add
      .text(VIEW.width / 2, 154, 'logo', {
        fontFamily: FONT_STACK,
        fontSize: '13px',
        color: CSS.grey,
      })
      .setOrigin(0.5)
      .setDepth(502);

    this.add
      .text(VIEW.width / 2, 232, 'Dosa Run', {
        fontFamily: FONT_STACK,
        fontSize: '62px',
        fontStyle: 'bold',
        color: CSS.green,
      })
      .setOrigin(0.5)
      .setDepth(502);

    this.add
      .text(VIEW.width / 2, 278, 'Grab every dosa. Outrun the chase.', {
        fontFamily: FONT_STACK,
        fontSize: '17px',
        color: CSS.inkSoft,
      })
      .setOrigin(0.5)
      .setDepth(502);

    const rule = this.add.graphics().setDepth(502);
    rule.fillStyle(BRAND.orange, 1);
    rule.fillRoundedRect(VIEW.width / 2 - 40, 300, 80, 5, 3);

    this.add
      .text(
        VIEW.width / 2,
        350,
        'Arrow keys, swipe or the on-screen pads\nto switch lane. Up, swipe up or tap to jump.\n\nCars and trees end the run.',
        {
          fontFamily: FONT_STACK,
          fontSize: '16px',
          color: CSS.inkSoft,
          align: 'center',
          lineSpacing: 7,
        }
      )
      .setOrigin(0.5)
      .setDepth(502);

    this.bestText = this.add
      .text(VIEW.width / 2, 448, this.bestLabel(), {
        fontFamily: FONT_STACK,
        fontSize: '18px',
        fontStyle: 'bold',
        color: CSS.orange,
      })
      .setOrigin(0.5)
      .setDepth(502);

    const play = new Button(this, VIEW.width / 2, 572, {
      label: 'PLAY',
      width: 250,
      height: 74,
      fontSize: 30,
      onClick: () => this.startGame(),
    });
    play.setDepth(600);

    this.tweens.add({
      targets: play,
      y: 580,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(VIEW.width / 2, VIEW.height - 42, 'Kingston, Ontario', {
        fontFamily: FONT_STACK,
        fontSize: '14px',
        color: CSS.white,
      })
      .setOrigin(0.5)
      .setDepth(600);

    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
  }

  bestLabel() {
    return GameState.bestScore > 0
      ? `Best bag: ${GameState.bestScore} dosas`
      : 'No dosas collected yet';
  }

  startGame() {
    this.cameras.main.fadeOut(180, 255, 255, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Game'));
  }

  update(time, delta) {
    this.background.update(delta, 150);
  }
}
