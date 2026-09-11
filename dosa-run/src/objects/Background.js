import { ROAD, VIEW } from '../config/GameConfig.js';
import { groundYAt, roadHalfWidthAt, scaleAt } from '../config/Road.js';

/**
 * The Kingston streetscape.
 *
 * Side layers (sky, limestone blocks, storefronts, far sidewalk) scroll
 * horizontally at different rates for parallax. Forward motion is sold by
 * the lane markings, which ride the same depth maths as everything else, so
 * they speed up exactly in step with the gameplay.
 *
 * Layer bands are declared in one table — when the real background PNGs
 * arrive, retune them here and nothing else changes.
 */
const LAYERS = [
  { key: 'bg-sky', y: 0, height: ROAD.horizonY, rate: 0.06 },
  { key: 'bg-limestone', y: ROAD.horizonY - 168, height: 170, rate: 0.22 },
  { key: 'bg-storefronts', y: ROAD.horizonY - 116, height: 118, rate: 0.45 },
  { key: 'bg-sidewalk', y: ROAD.horizonY - 34, height: 36, rate: 0.78 },
];

const DASH_COUNT = 16;
const DASH_SPACING = ROAD.despawnDepth / DASH_COUNT;
const DASH_LENGTH = 0.042;

export default class Background {
  constructor(scene) {
    this.scene = scene;
    this.distance = 0;

    this.layers = LAYERS.map((layer, index) => {
      const sprite = scene.add
        .tileSprite(0, layer.y, VIEW.width, layer.height, layer.key)
        .setOrigin(0, 0)
        .setDepth(index);
      return { sprite, rate: layer.rate };
    });

    this.road = scene.add
      .image(0, ROAD.horizonY, 'bg-road')
      .setOrigin(0, 0)
      .setDisplaySize(VIEW.width, VIEW.height - ROAD.horizonY)
      .setDepth(10);

    this.dashes = scene.add.graphics().setDepth(11);
    this.dashDepths = Array.from(
      { length: DASH_COUNT },
      (_, i) => i * DASH_SPACING
    );

    // Softens the join between the sky and the far end of the street.
    this.haze = scene.add.graphics().setDepth(12);
    this.haze.fillStyle(0xdfe7ec, 0.55);
    this.haze.fillRect(0, ROAD.horizonY - 16, VIEW.width, 26);
  }

  /**
   * @param {number} delta frame time in ms
   * @param {number} speed current world speed in px/second
   */
  update(delta, speed) {
    const step = (speed * delta) / 1000;
    this.distance += step;

    for (const layer of this.layers) {
      layer.sprite.tilePositionX = this.distance * layer.rate;
    }

    const depthStep = step / 1000;
    this.dashDepths = this.dashDepths.map((d) => {
      const next = d + depthStep;
      return next > ROAD.despawnDepth
        ? next - ROAD.despawnDepth
        : next;
    });

    this.drawDashes();
  }

  drawDashes() {
    const g = this.dashes;
    g.clear();
    g.fillStyle(0xf3efe2, 0.92);

    const cx = VIEW.width / 2;
    const boundaries = [-0.5, 0.5];

    for (const depth of this.dashDepths) {
      const near = Math.min(depth + DASH_LENGTH, ROAD.despawnDepth);
      const y0 = groundYAt(depth);
      const y1 = groundYAt(near);
      if (y1 < ROAD.horizonY || y0 > VIEW.height) continue;

      const s0 = scaleAt(depth);
      const s1 = scaleAt(near);
      const halfDash0 = 4 * s0;
      const halfDash1 = 4 * s1;

      for (const boundary of boundaries) {
        const x0 = cx + boundary * ROAD.laneSpacing * s0;
        const x1 = cx + boundary * ROAD.laneSpacing * s1;
        g.fillPoints(
          [
            { x: x0 - halfDash0, y: y0 },
            { x: x0 + halfDash0, y: y0 },
            { x: x1 + halfDash1, y: y1 },
            { x: x1 - halfDash1, y: y1 },
          ],
          true
        );
      }

      // Concrete joints sweeping down both sidewalks. Same depth maths as
      // the lane markings, so the whole street accelerates together.
      const kerb0 = roadHalfWidthAt(depth);
      const kerb1 = roadHalfWidthAt(near);
      g.fillStyle(0xc4c0b7, 0.45);
      for (const side of [-1, 1]) {
        g.fillPoints(
          [
            { x: cx + side * (kerb0 + 12 * s0), y: y0 },
            { x: cx + side * (kerb0 + 130 * s0), y: y0 },
            { x: cx + side * (kerb1 + 130 * s1), y: y1 },
            { x: cx + side * (kerb1 + 12 * s1), y: y1 },
          ],
          true
        );
      }
      g.fillStyle(0xf3efe2, 0.92);

      // Solid edge lines along the shoulders.
      const eo0 = roadHalfWidthAt(depth) - 6 * s0;
      const eo1 = roadHalfWidthAt(near) - 6 * s1;
      for (const side of [-1, 1]) {
        g.fillPoints(
          [
            { x: cx + side * (eo0 - halfDash0), y: y0 },
            { x: cx + side * (eo0 + halfDash0), y: y0 },
            { x: cx + side * (eo1 + halfDash1), y: y1 },
            { x: cx + side * (eo1 - halfDash1), y: y1 },
          ],
          true
        );
      }
    }
  }
}
