import { getEffects, playEffect } from "./api.js";

/**
 * Escape a string for safe insertion into HTML.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/**
 * Build the inner HTML for the browser dialog.
 *
 * @returns {string}
 */
function buildContent() {
  const effects = getEffects();
  const rows = effects
    .map((effect, index) => {
      const search = `${effect.label} ${effect.file}`.toLowerCase();
      return `<div class="ase-effect" data-index="${index}" data-search="${escapeHtml(search)}" title="${escapeHtml(effect.file)}">
        <i class="fas fa-wand-magic-sparkles"></i>
        <span class="ase-cat">${escapeHtml(effect.category)}</span>
        <span class="ase-name">${escapeHtml(effect.name)}</span>
      </div>`;
    })
    .join("");

  return `<div class="ase-toolbar">
      <input type="text" class="ase-search" placeholder="Search ${effects.length} effects..." />
      <select class="ase-mode" title="How selecting an effect places it on the canvas">
        <option value="tile">Place as Tile</option>
        <option value="oneshot">Play once (Sequencer / FXMaster)</option>
      </select>
    </div>
    <p class="ase-hint notes">Click an effect, then click the canvas to place it. Right-click or Esc to cancel.</p>
    <div class="ase-list">${rows}</div>`;
}

/**
 * Let the user pick a world position by clicking on the canvas.
 *
 * @returns {Promise<{x: number, y: number}|null>}
 */
function pickCanvasPosition() {
  return new Promise((resolve) => {
    const view = canvas?.app?.view ?? canvas?.app?.canvas ?? document.getElementById("board");
    if (!canvas?.ready || !view) {
      ui.notifications.warn("Animated Spell Effects: Cartoon: the canvas is not ready.");
      resolve(null);
      return;
    }

    ui.notifications.info("Animated Spell Effects: Cartoon: click on the canvas to place the effect (right-click or Esc to cancel).");

    const cleanup = () => {
      view.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
    const toWorld = (clientX, clientY) => {
      const rect = view.getBoundingClientRect();
      const point = new PIXI.Point(clientX - rect.left, clientY - rect.top);
      return canvas.stage.worldTransform.applyInverse(point);
    };
    const onPointerDown = (event) => {
      if (event.button === 2) {
        event.preventDefault();
        event.stopPropagation();
        cleanup();
        resolve(null);
        return;
      }
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const world = toWorld(event.clientX, event.clientY);
      cleanup();
      resolve({ x: world.x, y: world.y });
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        cleanup();
        resolve(null);
      }
    };

    view.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown, true);
  });
}

/**
 * Handle selection of an effect row: close the browser, pick a position, place it.
 *
 * @param {number} index
 * @param {"tile"|"oneshot"} mode
 * @param {foundry.applications.api.DialogV2} dialog
 */
async function handleSelect(index, mode, dialog) {
  const effect = getEffects()[index];
  if (!effect) return;
  if (mode === "tile" && !game.user.isGM) {
    ui.notifications.warn("Animated Spell Effects: Cartoon: only a GM can place an effect as a Tile. Use \"Play once\" instead.");
    return;
  }

  await dialog.close();
  const position = await pickCanvasPosition();
  if (!position) return;
  await playEffect(effect, { mode, position });
}

/**
 * Wire up the search filter and effect-row click handlers on a rendered dialog.
 *
 * @param {foundry.applications.api.DialogV2} dialog
 */
function wireEvents(dialog) {
  const root = dialog.element;
  if (!root) return;

  const search = root.querySelector(".ase-search");
  const list = root.querySelector(".ase-list");
  const mode = root.querySelector(".ase-mode");

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    for (const row of list.querySelectorAll(".ase-effect")) {
      row.classList.toggle("hidden", !!query && !row.dataset.search.includes(query));
    }
  });

  list?.addEventListener("click", (event) => {
    const row = event.target.closest(".ase-effect");
    if (!row) return;
    handleSelect(Number(row.dataset.index), mode?.value ?? "tile", dialog);
  });

  search?.focus();
}

/**
 * A self-contained browser for placing cartoon spell effects on the canvas.
 * Works without any other module (placing Tiles); if Sequencer or FXMaster are
 * present it can also play effects as one-shots.
 */
export class EffectBrowser {
  static async open() {
    if (!canvas?.ready) {
      ui.notifications.warn("Animated Spell Effects: Cartoon: load a scene before opening the effect browser.");
      return;
    }

    const dialog = new foundry.applications.api.DialogV2({
      id: "animated-spell-effects-cartoon-browser",
      classes: ["animated-spell-effects-cartoon-browser"],
      window: { title: "Animated Spell Effects: Cartoon", icon: "fas fa-wand-magic-sparkles", resizable: true },
      position: { width: 480 },
      content: buildContent(),
      buttons: [{ action: "close", label: "Close", icon: "fas fa-times" }],
      rejectClose: false,
    });

    await dialog.render(true);
    wireEvents(dialog);
  }
}
