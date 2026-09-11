import Phaser from 'phaser';
import { ASSETS, ASSET_ROOT, ANIMATIONS } from '../config/AssetManifest.js';
import { createPlaceholderTexture } from '../config/Placeholders.js';
import { BRAND, CSS, FONT_STACK } from '../config/Brand.js';
import { VIEW } from '../config/GameConfig.js';

/**
 * Loads every asset declared in AssetManifest.js.
 *
 * Entries flagged `real: true` are loaded from disk; anything else (or
 * anything that fails to load) gets its generated placeholder instead. That
 * means dropping in final art is a one-line manifest change and a missing
 * file never breaks the build.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.failedKeys = new Set();
    this.drawLoadingUi();

    for (const entry of ASSETS) {
      if (!entry.real) continue;

      const path = ASSET_ROOT + entry.path;
      if (entry.type === 'spritesheet') {
        this.load.spritesheet(entry.key, path, entry.frameConfig);
      } else {
        this.load.image(entry.key, path);
      }
    }

    this.load.on('progress', (value) => this.updateLoadingUi(value));
    // Phaser only emits `loaderror` for transport failures, not for files
    // that arrive but fail to decode, so the real check happens in create().
    this.load.on('loaderror', (file) => this.failedKeys.add(file.key));
  }

  create() {
    for (const entry of ASSETS) {
      const loaded =
        entry.real &&
        !this.failedKeys.has(entry.key) &&
        this.textures.exists(entry.key);

      if (loaded) continue;

      if (entry.real) {
        console.warn(
          `[assets] "${entry.key}" is flagged real but could not be loaded ` +
            `from ${ASSET_ROOT + entry.path} — falling back to placeholder art.`
        );
      }
      createPlaceholderTexture(this, entry);
    }

    this.createAnimations();
    this.scene.start('Menu');
  }

  createAnimations() {
    for (const anim of ANIMATIONS) {
      if (this.anims.exists(anim.key)) continue;
      if (!this.textures.exists(anim.texture)) continue;

      // Clamp to what the texture actually has, so a real spritesheet with a
      // different frame count still animates instead of throwing.
      const available = this.textures.get(anim.texture).frameTotal - 1;
      const end = Math.min(anim.end, Math.max(0, available - 1));

      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(anim.texture, {
          start: anim.start,
          end,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }
  }

  drawLoadingUi() {
    const { width, height } = VIEW;

    this.cameras.main.setBackgroundColor(CSS.ink);

    this.add
      .text(width / 2, height / 2 - 60, 'Dosa Run', {
        fontFamily: FONT_STACK,
        fontSize: '46px',
        fontStyle: 'bold',
        color: CSS.white,
      })
      .setOrigin(0.5);

    this.barBg = this.add.graphics();
    this.barBg.fillStyle(BRAND.inkSoft, 1);
    this.barBg.fillRoundedRect(width / 2 - 130, height / 2, 260, 14, 7);
    this.bar = this.add.graphics();
  }

  updateLoadingUi(value) {
    const { width, height } = VIEW;
    this.bar.clear();
    this.bar.fillStyle(BRAND.green, 1);
    this.bar.fillRoundedRect(width / 2 - 130, height / 2, 260 * value, 14, 7);
  }
}
