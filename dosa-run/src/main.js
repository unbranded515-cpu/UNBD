import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import { VIEW } from './config/GameConfig.js';
import { CSS } from './config/Brand.js';

/**
 * Dosa Run — an endless runner down a Kingston, Ontario street.
 *
 * Scene flow:  Boot (assets) -> Menu -> Game -> GameOver -> Game / Menu
 */
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: CSS.white,
  width: VIEW.width,
  height: VIEW.height,
  scale: {
    // Letterboxes to any viewport while keeping the design resolution, so
    // one layout works on phones, tablets and desktop.
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  input: {
    activePointers: 2,
  },
  render: {
    antialias: true,
    roundPixels: false,
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
};

const game = new Phaser.Game(config);

// Exposed for debugging and automated smoke tests.
if (typeof window !== 'undefined') window.__game = game;

export default game;
