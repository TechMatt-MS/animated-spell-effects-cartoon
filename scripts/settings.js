import { MODULE_ID } from "./constants.js";

/**
 * Register the module's client settings.
 */
export function registerSettings() {
  game.settings.register(MODULE_ID, "runonlyonce", {
    name: "Disable startup popup",
    hint: "Disable the welcome window that appears when the module loads.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_ID, "defaultTileSize", {
    name: "Default effect size (grid squares)",
    hint: "Size, in grid squares, used when placing a cartoon effect on the canvas.",
    scope: "client",
    config: true,
    type: Number,
    default: 2,
    range: { min: 1, max: 20, step: 1 },
  });
}
