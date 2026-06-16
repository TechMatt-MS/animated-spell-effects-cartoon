import { MODULE_ID } from "./constants.js";

const WELCOME_CONTENT = `<div style="text-align: justify;">
  <h2>Jack Kerouac's Animated Spell Effects: Cartoon</h2>
  <p>Cartoony animated effects for spells for use with various VTTs in the top-down/overhead perspective. All files are transparent webm.</p>
  <hr>
  <p>When Sequencer is active these effects are registered with the <strong>Sequencer Database</strong> (namespace <code>animated-spell-effects-cartoon</code>), so you can use them with <strong>Automated Animations</strong>, the Sequencer Effect Player, and Sequencer macros. You can also place them directly from the wand button in the Token controls.</p>
  <hr>
  <p>No Patreon. No fees or subscriptions. Just free. Always.</p>
  <p style="font-style:italic;">You can disable this pop-up with the <strong>Don't show again</strong> button.</p>
</div>`;

/**
 * Show the one-time welcome dialog, unless it has been disabled in settings.
 */
export async function showWelcomeDialog() {
  if (game.settings.get(MODULE_ID, "runonlyonce")) return;
  try {
    await foundry.applications.api.DialogV2.wait({
      window: { title: "Module Activated!", icon: "fas fa-wand-magic-sparkles" },
      content: WELCOME_CONTENT,
      buttons: [
        { action: "ok", label: "OK", icon: "fas fa-clipboard-list", default: true },
        {
          action: "dismiss",
          label: "Don't show again",
          icon: "fas fa-clipboard-check",
          callback: () => game.settings.set(MODULE_ID, "runonlyonce", true),
        },
      ],
      rejectClose: false,
    });
  } catch (err) {
    console.error(`${MODULE_ID} | Failed to show the welcome dialog.`, err);
  }
}