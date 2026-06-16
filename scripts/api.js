import { MODULE_ID } from "./constants.js";
import { flattenEffects } from "./sequencer.js";

let _cache = null;

/**
 * @returns {Array<object>} The flattened effect catalogue (memoized).
 */
export function getEffects() {
  if (!_cache) _cache = flattenEffects();
  return _cache;
}

/**
 * @param {string} label
 * @returns {string} The category portion of an effect label.
 */
export function categoryOf(label = "") {
  const i = label.indexOf(" - ");
  return (i > 0 ? label.slice(0, i) : "MISC").trim().toUpperCase();
}

/**
 * @returns {string[]} Sorted, unique list of effect categories.
 */
export function getCategories() {
  return [...new Set(getEffects().map((e) => e.category))].sort();
}

/**
 * @returns {number} The configured default effect size, in pixels.
 */
function defaultSizePx() {
  const grids = Number(game.settings.get(MODULE_ID, "defaultTileSize")) || 2;
  return grids * (canvas?.grid?.size ?? 100);
}

/**
 * Place an effect on the canvas as a (looping video) Tile centred on a position.
 *
 * @param {object} effect
 * @param {{x: number, y: number}} position
 * @returns {Promise<TileDocument|null>}
 */
export async function placeEffectTile(effect, position) {
  if (!canvas?.scene) {
    ui.notifications.warn("Animated Spell Effects: Cartoon: no active scene to place an effect on.");
    return null;
  }
  if (!game.user.isGM) {
    ui.notifications.warn("Animated Spell Effects: Cartoon: only a GM can place an effect as a Tile.");
    return null;
  }

  const base = defaultSizePx();
  const width = base * (effect.scale?.x ?? 1);
  const height = base * (effect.scale?.y ?? 1);
  const data = {
    texture: { src: effect.file },
    width,
    height,
    x: Math.round(position.x - width / 2),
    y: Math.round(position.y - height / 2),
    rotation: effect.angle ?? 0,
    sort: 100,
  };

  try {
    const [tile] = await canvas.scene.createEmbeddedDocuments("Tile", [data]);
    return tile;
  } catch (err) {
    console.error(`${MODULE_ID} | Failed to create Tile.`, err);
    ui.notifications.error("Animated Spell Effects: Cartoon: failed to place effect tile (see console).");
    return null;
  }
}

/**
 * Play an effect once at a location, preferring Sequencer, then FXMaster, then
 * falling back to a Tile.
 *
 * @param {object} effect
 * @param {{x: number, y: number}} position
 * @returns {Promise<boolean>}
 */
export async function playEffectOneShot(effect, position) {
  if (game.modules.get("sequencer")?.active && typeof globalThis.Sequence !== "undefined") {
    try {
      const seq = new globalThis.Sequence();
      seq.effect().file(effect.file).atLocation(position);
      await seq.play();
      return true;
    } catch (err) {
      console.error(`${MODULE_ID} | Sequencer playback failed.`, err);
    }
  }

  const FX = globalThis.FXMASTER;
  if (game.modules.get("fxmaster")?.active && FX?.specials?.playVideo) {
    try {
      await FX.specials.playVideo({
        file: effect.file,
        position,
        anchor: { x: 0.5, y: 0.5 },
        angle: 0,
        scale: { x: 1, y: 1 },
        width: defaultSizePx(),
      });
      return true;
    } catch (err) {
      console.error(`${MODULE_ID} | FXMaster playback failed.`, err);
    }
  }

  ui.notifications.warn(
    "Animated Spell Effects: Cartoon: install Sequencer (or FXMaster) for one-shot playback. Placing as a Tile instead.",
  );
  return !!(await placeEffectTile(effect, position));
}

/**
 * Place or play an effect.
 *
 * @param {object} effect
 * @param {{mode?: "tile"|"oneshot", position?: {x: number, y: number}}} [options]
 * @returns {Promise<TileDocument|boolean|null>}
 */
export async function playEffect(effect, { mode = "tile", position } = {}) {
  if (!effect || !position) return null;
  return mode === "oneshot"
    ? playEffectOneShot(effect, position)
    : placeEffectTile(effect, position);
}
