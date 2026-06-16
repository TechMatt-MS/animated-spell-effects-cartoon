import { MODULE_ID } from "./constants.js";
import { registerSettings } from "./settings.js";
import { registerControls } from "./controls.js";
import { registerWithSequencer } from "./sequencer.js";
import { showWelcomeDialog } from "./windowpopup.js";
import { EffectBrowser } from "./browser.js";
import * as api from "./api.js";

Hooks.once("init", () => {
  registerSettings();
  registerControls();

  const moduleApi = {
    getEffects: api.getEffects,
    getCategories: api.getCategories,
    playEffect: api.playEffect,
    placeEffectTile: api.placeEffectTile,
    playEffectOneShot: api.playEffectOneShot,
    openBrowser: () => EffectBrowser.open(),
  };
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = moduleApi;
  globalThis.AnimatedSpellEffectsCartoon = moduleApi;
});

Hooks.once("sequencer.ready", () => registerWithSequencer());

Hooks.once("ready", () => {
  registerWithSequencer();
  showWelcomeDialog();
});
