import { VIEW } from '../config/GameConfig.js';
import { bagFrameForScore } from '../config/bag.js';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';

const HUD_DEPTH = 1000;

/**
 * Score, bag fill and difficulty readout, in the brand palette.
 * The bag icon fills up as dosas are collected and empties as it wraps to
 * the next bagful.
 */
export default class Hud {
  constructor(scene) {
    this.scene = scene;
    this.bagPop = 1;

    const panel = scene.add.graphics().setDepth(HUD_DEPTH);
    panel.fillStyle(BRAND.white, 0.92);
    panel.fillRoundedRect(12, 12, VIEW.width - 24, 68, 20);
    panel.fillStyle(BRAND.green, 1);
    panel.fillRoundedRect(12, 12, 8, 68, 4);

    this.bag = scene.add
      .sprite(52, 46, 'bag-fill', 0)
      .setOrigin(0.5)
      .setScale(0.78)
      .setDepth(HUD_DEPTH + 1);

    this.scoreText = scene.add
      .text(84, 46, '0', {
        fontFamily: FONT_STACK,
        fontSize: '34px',
        fontStyle: 'bold',
        color: CSS.ink,
      })
      .setOrigin(0, 0.5)
      .setDepth(HUD_DEPTH + 1);

    // Sits to the right of the number and is repositioned as it grows.
    this.dosaLabel = scene.add
      .text(0, 54, 'DOSAS', {
        fontFamily: FONT_STACK,
        fontSize: '12px',
        fontStyle: 'bold',
        color: CSS.grey,
      })
      .setOrigin(0, 1)
      .setDepth(HUD_DEPTH + 1);

    this.levelPill = scene.add.graphics().setDepth(HUD_DEPTH + 1);
    this.levelText = scene.add
      .text(VIEW.width - 34, 46, 'LV 1', {
        fontFamily: FONT_STACK,
        fontSize: '20px',
        fontStyle: 'bold',
        color: CSS.white,
      })
      .setOrigin(1, 0.5)
      .setDepth(HUD_DEPTH + 2);

    this.drawLevelPill();
    this.setScore(0);
  }

  drawLevelPill() {
    const w = this.levelText.width + 28;
    this.levelPill.clear();
    this.levelPill.fillStyle(BRAND.orange, 1);
    this.levelPill.fillRoundedRect(VIEW.width - 22 - w, 28, w, 36, 18);
  }

  setScore(score) {
    this.scoreText.setText(`${score}`);
    this.dosaLabel.setX(this.scoreText.x + this.scoreText.width + 8);

    this.bag.setFrame(bagFrameForScore(score));

    this.scene.tweens.killTweensOf(this.bag);
    this.bag.setScale(0.78);
    this.scene.tweens.add({
      targets: this.bag,
      scale: 0.98,
      duration: 90,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  setLevel(level) {
    this.levelText.setText(`LV ${level + 1}`);
    this.drawLevelPill();

    this.scene.tweens.killTweensOf(this.levelText);
    this.levelText.setScale(1);
    this.scene.tweens.add({
      targets: this.levelText,
      scale: 1.25,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  /** Big centred callout, used for level-ups and hurdle bonuses. */
  flash(message, color = CSS.orange) {
    const text = this.scene.add
      .text(VIEW.width / 2, 150, message, {
        fontFamily: FONT_STACK,
        fontSize: '30px',
        fontStyle: 'bold',
        color,
        stroke: CSS.white,
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(HUD_DEPTH + 3);

    this.scene.tweens.add({
      targets: text,
      y: 104,
      alpha: 0,
      duration: 900,
      ease: 'Quad.easeOut',
      onComplete: () => text.destroy(),
    });
  }
}
