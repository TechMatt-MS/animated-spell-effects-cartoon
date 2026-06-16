import { EffectBrowser } from "./browser.js";
import { MODULE_ID } from "./constants.js";

/**
 * Add an "Animated Spell Effects: Cartoon" button to the scene controls (v13+).
 *
 * @param {Record<string, object>} controls
 */
function onGetSceneControlButtons(controls) {
  if (!game.user?.isGM) return;

  const target = controls.tokens ?? Object.values(controls ?? {})[0];
  if (!target?.tools) return;

  target.tools[MODULE_ID] = {
    name: MODULE_ID,
    title: "Animated Spell Effects: Cartoon",
    icon: "fas fa-wand-magic-sparkles",
    button: true,
    visible: true,
    order: 991,
    onChange: () => EffectBrowser.open(),
  };
}

/**
 * Register the scene-control button and a (user-rebindable) keybinding to open
 * the effect browser.
 */
export function registerControls() {
  Hooks.on("getSceneControlButtons", onGetSceneControlButtons);

  game.keybindings.register(MODULE_ID, "open-browser", {
    name: "Open the Animated Spell Effects: Cartoon browser",
    hint: "Opens the browser used to place a cartoon spell effect on the canvas.",
    editable: [],
    onDown: () => {
      EffectBrowser.open();
      return true;
    },
    restricted: false,
  });
}
