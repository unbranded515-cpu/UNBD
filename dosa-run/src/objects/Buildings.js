import Phaser from 'phaser';
import { BUILDINGS, ROAD, VIEW } from '../config/GameConfig.js';
import { groundYAt, roadHalfWidthAt, scaleAt, depthSortKey } from '../config/Road.js';

/**
 * The buildings lining the street.
 *
 * This is what makes the world read as 3D rather than as a backdrop: each
 * building is placed at a depth on the same road as everything else, so it
 * grows and sweeps out past the camera as you run at it. A flat layer
 * scrolling sideways can never do that — it always looks like wallpaper.
 *
 * Buildings are anchored by their inner-bottom corner (the one nearest the
 * road) so the row stays glued to the kerb as it converges on the horizon.
 */
export default class Buildings {
  constructor(scene) {
    this.scene = scene;
    this.sprites = [];

    this.textures = BUILDINGS.textures.filter((key) =>
      scene.textures.exists(key)
    );
    if (this.textures.length === 0) this.textures = ['bg-building-a'];

    // Each side keeps its own queue so the two rows stagger naturally.
    this.nextDepth = { '-1': 0, '1': BUILDINGS.spacing * 0.5 };

    this.prefill();
  }

  /** Fills the street before the first frame, so it never starts empty. */
  prefill() {
    for (let depth = ROAD.despawnDepth; depth > 0; depth -= BUILDINGS.spacing) {
      this.spawn(-1, depth);
      this.spawn(1, depth - BUILDINGS.spacing * 0.5);
    }
  }

  spawn(side, depth) {
    if (depth <= 0) return null;

    const key = Phaser.Utils.Array.GetRandom(this.textures);
    const sprite = this.scene.add.image(0, 0, key);

    // Anchor the corner facing the road; mirror the far side so both rows
    // recede toward the same vanishing point.
    sprite.setOrigin(side < 0 ? 1 : 0, 1);
    sprite.setFlipX(side > 0);

    sprite.side = side;
    sprite.roadDepth = depth;
    sprite.sizeMul = Phaser.Math.FloatBetween(
      BUILDINGS.sizeJitter[0],
      BUILDINGS.sizeJitter[1]
    );

    this.sprites.push(sprite);
    this.place(sprite);
    return sprite;
  }

  place(sprite) {
    const depth = sprite.roadDepth;
    const scale = scaleAt(depth);

    // Sit the facade just beyond the kerb, on the sidewalk.
    const offset = roadHalfWidthAt(depth) + BUILDINGS.setback * scale;
    sprite.x = VIEW.width / 2 + sprite.side * offset;
    sprite.y = groundYAt(depth);
    sprite.setScale(scale * BUILDINGS.sizeMul * sprite.sizeMul);

    // Fade into the distance, so the row resolves out of the horizon
    // instead of popping in at full contrast.
    sprite.setAlpha(Phaser.Math.Clamp(depth / BUILDINGS.fadeInDepth, 0, 1));

    // Behind everything that shares the road, but still depth-sorted so a
    // near building correctly covers a far one.
    sprite.setDepth(depthSortKey(depth) - 50);
  }

  update(delta, speed) {
    const depthStep = (speed * delta) / 1000 / 1000;

    for (let i = this.sprites.length - 1; i >= 0; i -= 1) {
      const sprite = this.sprites[i];
      sprite.roadDepth += depthStep;

      if (sprite.roadDepth >= BUILDINGS.despawnDepth) {
        sprite.destroy();
        this.sprites.splice(i, 1);
        continue;
      }
      this.place(sprite);
    }

    // Feed a fresh building in at the horizon as the row marches forward.
    for (const side of [-1, 1]) {
      this.nextDepth[side] += depthStep;
      if (this.nextDepth[side] >= BUILDINGS.spacing) {
        this.nextDepth[side] -= BUILDINGS.spacing;
        this.spawn(side, this.nextDepth[side]);
      }
    }
  }

  destroy() {
    for (const sprite of this.sprites) sprite.destroy();
    this.sprites.length = 0;
  }
}
