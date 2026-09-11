import Phaser from 'phaser';
import { VIEW } from '../config/GameConfig.js';
import { BRAND } from '../config/Brand.js';

const CONTROL_DEPTH = 900;

/**
 * On-screen thumb controls for touch devices. They sit alongside the swipe
 * and keyboard handlers rather than replacing them, and expose `hitTest` so
 * the swipe detector can ignore gestures that started on a button.
 */
export default class TouchControls {
  constructor(scene, { onLeft, onRight, onJump }) {
    this.scene = scene;
    this.buttons = [];

    const y = VIEW.height - 76;
    this.add(58, y, 48, '◀', BRAND.green, onLeft);
    this.add(VIEW.width - 58, y, 48, '▶', BRAND.green, onRight);
    this.add(VIEW.width / 2, y, 55, '▲', BRAND.orange, onJump);
  }

  add(x, y, radius, glyph, color, handler) {
    const g = this.scene.add.graphics().setDepth(CONTROL_DEPTH);
    g.fillStyle(0x000000, 0.12);
    g.fillCircle(x, y + 4, radius);
    g.fillStyle(color, 0.82);
    g.fillCircle(x, y, radius);
    g.lineStyle(3, BRAND.white, 0.75);
    g.strokeCircle(x, y, radius - 5);

    const label = this.scene.add
      .text(x, y, glyph, {
        fontFamily: 'sans-serif',
        fontSize: `${Math.round(radius * 0.8)}px`,
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(CONTROL_DEPTH + 1);

    const zone = this.scene.add
      .zone(x, y, radius * 2, radius * 2)
      .setInteractive({ useHandCursor: true })
      .setDepth(CONTROL_DEPTH + 2);

    zone.on('pointerdown', () => {
      label.setScale(0.86);
      g.setAlpha(0.7);
      handler();
    });
    const release = () => {
      label.setScale(1);
      g.setAlpha(1);
    };
    zone.on('pointerup', release);
    zone.on('pointerout', release);

    this.buttons.push({ x, y, radius, graphics: g, label, zone });
  }

  /** True when a screen point lands on one of the buttons. */
  hitTest(x, y) {
    return this.buttons.some(
      (b) => Phaser.Math.Distance.Between(x, y, b.x, b.y) <= b.radius
    );
  }

  setVisible(visible) {
    for (const b of this.buttons) {
      b.graphics.setVisible(visible);
      b.label.setVisible(visible);
      b.zone.setVisible(visible);
    }
  }
}
