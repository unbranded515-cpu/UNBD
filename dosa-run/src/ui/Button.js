import Phaser from 'phaser';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';

/**
 * A brand-styled pill button that works with mouse, touch and keyboard focus.
 */
export default class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, config) {
    super(scene, x, y);

    const {
      label,
      width = 240,
      height = 64,
      fill = BRAND.green,
      fillPressed = BRAND.greenDark,
      textColor = CSS.white,
      fontSize = 26,
      radius = 32,
      icon = null,
      onClick = () => {},
    } = config;

    this.fillColor = fill;
    this.fillPressedColor = fillPressed;
    this.btnWidth = width;
    this.btnHeight = height;
    this.radius = radius;
    this.onClick = onClick;

    this.bg = scene.add.graphics();
    this.add(this.bg);

    this.label = scene.add
      .text(icon ? 14 : 0, 0, label, {
        fontFamily: FONT_STACK,
        fontSize: `${fontSize}px`,
        fontStyle: 'bold',
        color: textColor,
      })
      .setOrigin(0.5);
    this.add(this.label);

    if (icon) {
      this.icon = scene.add.text(-this.label.width / 2 - 10, 0, icon, {
        fontFamily: FONT_STACK,
        fontSize: `${fontSize}px`,
        color: textColor,
      });
      this.icon.setOrigin(0.5);
      this.add(this.icon);
    }

    this.draw(false);

    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerover', () => this.setScale(1.04));
    this.on('pointerout', () => {
      this.setScale(1);
      this.draw(false);
    });
    this.on('pointerdown', () => {
      this.setScale(0.96);
      this.draw(true);
    });
    this.on('pointerup', () => {
      this.setScale(1.04);
      this.draw(false);
      this.onClick();
    });

    scene.add.existing(this);
  }

  draw(pressed) {
    const w = this.btnWidth;
    const h = this.btnHeight;
    this.bg.clear();
    this.bg.fillStyle(0x000000, pressed ? 0.08 : 0.16);
    this.bg.fillRoundedRect(-w / 2, -h / 2 + 4, w, h, this.radius);
    this.bg.fillStyle(pressed ? this.fillPressedColor : this.fillColor, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, this.radius);
  }
}
