/**
 * Brand palette for Dosa Run.
 *
 * Themed around Mint Leaf South Indian (Kingston, ON) using COLOUR ONLY.
 * No logo, storefront photography, or other branded asset is referenced
 * anywhere in this project — drop those in later via AssetManifest.js.
 */

export const BRAND = {
  green: 0x1ba37e,
  greenDark: 0x0f7a5c,
  greenLight: 0x5fd3b3,

  orange: 0xf2802b,
  orangeDark: 0xc45f15,
  orangeLight: 0xffb066,

  white: 0xffffff,
  cream: 0xfff6e9,
  ink: 0x12202b,
  inkSoft: 0x2c3d4c,
  grey: 0x9aa8b2,
};

/** Same palette as CSS strings, for Phaser text styles. */
export const CSS = Object.fromEntries(
  Object.entries(BRAND).map(([name, value]) => [
    name,
    `#${value.toString(16).padStart(6, '0')}`,
  ])
);

export const FONT_STACK =
  '"Trebuchet MS", "Segoe UI", Verdana, system-ui, sans-serif';

/** Title / heading text style. */
export function titleStyle(size, color = CSS.ink) {
  return {
    fontFamily: FONT_STACK,
    fontSize: `${size}px`,
    fontStyle: 'bold',
    color,
  };
}

/** Body / HUD text style. */
export function bodyStyle(size, color = CSS.inkSoft) {
  return {
    fontFamily: FONT_STACK,
    fontSize: `${size}px`,
    color,
  };
}
