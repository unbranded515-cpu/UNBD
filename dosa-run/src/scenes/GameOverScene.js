import Phaser from 'phaser';
import Button from '../ui/Button.js';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';
import { VIEW } from '../config/GameConfig.js';
import { bagFrameForScore } from '../config/bag.js';

const CAUSE_TEXT = {
  car: 'Clipped by a car on Princess Street.',
  tree: 'Straight into a street tree.',
  pylon: 'Tripped over a pylon.',
};

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    const { score = 0, best = 0, isBest = false, level = 0, cause } = data;

    this.cameras.main.setBackgroundColor(CSS.ink);
    this.cameras.main.fadeIn(220, 18, 32, 43);

    this.add
      .text(VIEW.width / 2, 76, 'Dosa Run', {
        fontFamily: FONT_STACK,
        fontSize: '30px',
        fontStyle: 'bold',
        color: CSS.white,
      })
      .setOrigin(0.5)
      .setAlpha(0.75);

    const panelY = 150;
    const panelH = 470;
    const panel = this.add.graphics();
    panel.fillStyle(BRAND.white, 1);
    panel.fillRoundedRect(28, panelY, VIEW.width - 56, panelH, 28);
    panel.fillStyle(BRAND.orange, 1);
    panel.fillRoundedRect(28, panelY, VIEW.width - 56, 12, 6);

    this.add
      .text(VIEW.width / 2, panelY + 62, 'RUN OVER', {
        fontFamily: FONT_STACK,
        fontSize: '40px',
        fontStyle: 'bold',
        color: CSS.ink,
      })
      .setOrigin(0.5);

    this.add
      .text(VIEW.width / 2, panelY + 98, CAUSE_TEXT[cause] ?? 'The chase caught up.', {
        fontFamily: FONT_STACK,
        fontSize: '15px',
        color: CSS.grey,
      })
      .setOrigin(0.5);

    // Final dosa count, with the bag showing how full it ended up.
    const bag = this.add
      .sprite(166, panelY + 184, 'bag-fill', bagFrameForScore(score))
      .setOrigin(0.5)
      .setScale(1.3);
    this.tweens.add({
      targets: bag,
      angle: { from: -7, to: 7 },
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const countText = this.add
      .text(292, panelY + 178, '0', {
        fontFamily: FONT_STACK,
        fontSize: '72px',
        fontStyle: 'bold',
        color: CSS.green,
      })
      .setOrigin(0.5);

    this.add
      .text(292, panelY + 236, 'DOSAS COLLECTED', {
        fontFamily: FONT_STACK,
        fontSize: '13px',
        fontStyle: 'bold',
        color: CSS.grey,
      })
      .setOrigin(0.5);

    // Count up to the final score — makes the number land.
    const counter = { value: 0 };
    this.tweens.add({
      targets: counter,
      value: score,
      duration: Math.min(900, 180 + score * 45),
      ease: 'Cubic.easeOut',
      onUpdate: () => countText.setText(`${Math.round(counter.value)}`),
      onComplete: () => countText.setText(`${score}`),
    });

    const divider = this.add.graphics();
    divider.fillStyle(0xe6e2da, 1);
    divider.fillRect(70, panelY + 272, VIEW.width - 140, 2);

    this.add
      .text(
        VIEW.width / 2,
        panelY + 300,
        `Speed level reached:  ${level + 1}`,
        { fontFamily: FONT_STACK, fontSize: '16px', color: CSS.inkSoft }
      )
      .setOrigin(0.5);

    const bestLine = this.add
      .text(
        VIEW.width / 2,
        panelY + 330,
        isBest ? `NEW BEST BAG — ${best} dosas!` : `Best bag: ${best} dosas`,
        {
          fontFamily: FONT_STACK,
          fontSize: '17px',
          fontStyle: 'bold',
          color: isBest ? CSS.orange : CSS.inkSoft,
        }
      )
      .setOrigin(0.5);

    if (isBest) {
      this.tweens.add({
        targets: bestLine,
        scale: 1.08,
        duration: 620,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    new Button(this, VIEW.width / 2, panelY + 400, {
      label: 'RUN AGAIN',
      width: 250,
      height: 68,
      fontSize: 27,
      onClick: () => this.restart(),
    });

    new Button(this, VIEW.width / 2, VIEW.height - 108, {
      label: 'MENU',
      width: 190,
      height: 56,
      fontSize: 21,
      fill: BRAND.inkSoft,
      fillPressed: BRAND.ink,
      onClick: () => this.scene.start('Menu'),
    });

    this.input.keyboard.on('keydown-SPACE', () => this.restart());
    this.input.keyboard.on('keydown-ENTER', () => this.restart());
  }

  restart() {
    this.scene.start('Game');
  }
}
