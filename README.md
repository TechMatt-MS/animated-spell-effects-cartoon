![](https://img.shields.io/badge/Foundry-v13%20%7C%20v14-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/jackkerouac/animated-spell-effects-cartoon/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fanimated-spell-effects-cartoon&colorB=a4dea4) -->

# Animated Spell Effects: Cartoon
More than 350 (and growing!) animated cartoon effects for spells for use with various VTT's in the top-down/overhead perspective. All files are in transparent webm format. In Foundry VTT, fiiles will be located in your "Data\modules\animated-spell-effects\spell-effects" folder. If you like my work, consider saying thanks on Discord: jackkerouac#0624.

# Jack Kerouac's Animated Spell Effects
More than 350 (and growing!) animated cartoon effects for spells for use with various VTT's in the top-down/overhead perspective. All files are in transparent webm format. In Foundry VTT, fiiles will be located in your "Data\modules\animated-spell-effects\spell-effects" folder. If you like my work, consider saying thanks on Discord: jackkerouac#0624.

Preview/Download: https://github.com/jackkerouac/animated-spell-effects-cartoon

Requires Foundry VTT v13 or v14.

Use this manifest link in Foundry VTT:

https://github.com/TechMatt-MS/animated-spell-effects-cartoon/releases/latest/download/module.json

# Requirements

- Foundry VTT **v13 or v14**.
- Recommended: [Sequencer](https://github.com/fantasycalendar/FoundryVTT-Sequencer) and [Automated Animations](https://github.com/theripper93/autoanimations).

# Instructions

When **Sequencer** is active, every effect in this module is registered with the **Sequencer Database** under the `animated-spell-effects-cartoon` namespace (for example `animated-spell-effects-cartoon.air.blast.cone`). That makes them usable anywhere that reads the Sequencer Database:

- **Automated Animations** – add or scan a custom animation and search the database for `animated-spell-effects-cartoon`.
- **Sequencer Effect Player** – browse and place the effects directly from the Sequencer canvas controls.
- **Sequencer / pf2e-jb2a-macros macros** – reference them by their database path or file path.

You can also place an effect without any other module: as a GM, click the **wand button in the Token controls** (or bind a key in Configure Controls) to open the built-in browser, pick an effect, then click the canvas to drop it as a looping video Tile (or play it once if Sequencer/FXMaster is present).

> Note: the bundled dnd5e compendium packs (spells and macros) are unchanged and remain dnd5e-only. The animated effects themselves are system-agnostic and work in any system, including pf2e.
