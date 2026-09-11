import Buildings from './Buildings.js';
import { ROAD, VIEW } from '../config/GameConfig.js';
import { groundYAt, roadHalfWidthAt, scaleAt } from '../config/Road.js';

/**
 * The Kingston streetscape.
 *
 * Depth carries the whole scene. The sky is the only layer that scrolls
 * sideways; the buildings, the kerb joints and the lane markings all travel
 * toward the camera on the same road maths the gameplay uses, so the world
 * accelerates as one when the difficulty steps up.
 */
const DASH_COUNT = 16;
const DASH_SPACING = ROAD.despawnDepth / DASH_COUNT;
const DASH_LENGTH = 0.042;

export default class Background {
  constructor(scene) {
    this.scene = scene;
    this.distance = 0;

    this.sky = scene.add
      .tileSprite(0, 0, VIEW.width, ROAD.horizonY + 8, 'bg-sky')
      .setOrigin(0, 0)
      .setDepth(0);

    this.road = scene.add
      .image(0, ROAD.horizonY, 'bg-road')
      .setOrigin(0, 0)
      .setDisplaySize(VIEW.width, VIEW.height - ROAD.horizonY)
      .setDepth(10);

    this.buildings = new Buildings(scene);

    this.dashes = scene.add.graphics().setDepth(11);
    this.dashDepths = Array.from(
      { length: DASH_COUNT },
      (_, i) => i * DASH_SPACING
    );

  }

  /**
   * @param {number} delta frame time in ms
   * @param {number} speed current world speed in px/second
   */
  update(delta, speed) {
    const step = (speed * delta) / 1000;
    this.distance += step;

    // A slow drift only — forward motion is carried by the depth system.
    this.sky.tilePositionX = this.distance * 0.04;

    this.buildings.update(delta, speed);

    const depthStep = step / 1000;
    this.dashDepths = this.dashDepths.map((d) => {
      const next = d + depthStep;
      return next > ROAD.despawnDepth ? next - ROAD.despawnDepth : next;
    });

    this.drawDashes();
  }

  drawDashes() {
    const g = this.dashes;
    g.clear();

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

      // Kerb joints sweeping down both sidewalks.
      const kerb0 = roadHalfWidthAt(depth);
      const kerb1 = roadHalfWidthAt(near);
      g.fillStyle(0xc4c0b7, 0.32);
      for (const side of [-1, 1]) {
        g.fillPoints(
          [
            { x: cx + side * (kerb0 + 10 * s0), y: y0 },
            { x: cx + side * (kerb0 + 96 * s0), y: y0 },
            { x: cx + side * (kerb1 + 96 * s1), y: y1 },
            { x: cx + side * (kerb1 + 10 * s1), y: y1 },
          ],
          true
        );
      }

      // Lane markings.
      g.fillStyle(0xf3efe2, 0.92);
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
    }
  }

  destroy() {
    this.buildings.destroy();
  }
}
