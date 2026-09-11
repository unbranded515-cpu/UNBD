import { BAG_CAPACITY, BAG_FILL_STATES } from './GameConfig.js';

/**
 * Which bag-fill frame matches a dosa count.
 *
 * The bag fills over `BAG_CAPACITY` dosas, shows completely full on the
 * dosa that fills it, then starts a fresh bag. Shared by the HUD and the
 * game-over screen so both always agree.
 */
export function bagFrameForScore(score) {
  const withinBag = score % BAG_CAPACITY;
  const isFullBag = score > 0 && withinBag === 0;
  const ratio = isFullBag ? 1 : withinBag / BAG_CAPACITY;

  return Math.min(
    BAG_FILL_STATES - 1,
    Math.floor(ratio * (BAG_FILL_STATES - 1) + 1e-6)
  );
}
